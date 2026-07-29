/*
  SHIPPER – VÍ CÁ NHÂN
  Chạy sau orders/sample-orders.sql và orders/sample-delivery-details.sql.
  Chỉ sinh phí ship/COD cho các đơn completed đã có, không dùng giao dịch mock.
*/

IF COL_LENGTH(N'dbo.Orders', N'DeliveredAt') IS NULL
  ALTER TABLE dbo.Orders ADD DeliveredAt DATETIME2 NULL;
GO

IF OBJECT_ID(N'dbo.ShipperWalletTransactions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperWalletTransactions (
    ShipperWalletTransactionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TransactionCode NVARCHAR(70) NOT NULL UNIQUE,
    ShipperId INT NOT NULL,
    OrderId INT NULL,
    TransactionType NVARCHAR(30) NOT NULL,
    Description NVARCHAR(500) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Description DEFAULT N'0',
    Amount DECIMAL(18,0) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Amount DEFAULT 0,
    TransactionStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Status DEFAULT N'completed',
    OccurredAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperWalletTransactions_OccurredAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_ShipperWalletTransactions_Type CHECK (TransactionType IN (N'shipping_fee', N'cod_collected', N'cod_remitted', N'withdrawal', N'adjustment')),
    CONSTRAINT CK_ShipperWalletTransactions_Status CHECK (TransactionStatus IN (N'pending', N'completed', N'cancelled')),
    CONSTRAINT FK_ShipperWalletTransactions_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId),
    CONSTRAINT FK_ShipperWalletTransactions_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

/* Phí ship là thu nhập của shipper. */
INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'FEE-', o.OrderCode), o.ShipperId, o.OrderId, N'shipping_fee',
       CONCAT(N'Phí ship đơn ', o.OrderCode), COALESCE(o.ShippingFee, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed'
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'FEE-', o.OrderCode));
GO

/* COD là tiền thu hộ: thu vào rồi chuyển cho quán, hai dòng triệt tiêu nhau trong số dư. */
INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'COD-IN-', o.OrderCode), o.ShipperId, o.OrderId, N'cod_collected',
       CONCAT(N'Đã thu COD đơn ', o.OrderCode), COALESCE(o.CodAmount, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed' AND COALESCE(o.CodAmount, 0) > 0
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'COD-IN-', o.OrderCode));
GO

INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'COD-OUT-', o.OrderCode), o.ShipperId, o.OrderId, N'cod_remitted',
       CONCAT(N'Đã hoàn COD về quán - đơn ', o.OrderCode), -COALESCE(o.CodAmount, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed' AND COALESCE(o.CodAmount, 0) > 0
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'COD-OUT-', o.OrderCode));
GO

CREATE OR ALTER VIEW dbo.vShipperWalletTransactions
AS
SELECT
  sh.ShipperCode,
  wt.TransactionCode,
  o.OrderCode,
  wt.TransactionType,
  CASE wt.TransactionType
    WHEN N'shipping_fee' THEN N'Phí ship'
    WHEN N'cod_collected' THEN N'Thu COD'
    WHEN N'cod_remitted' THEN N'Chuyển COD'
    WHEN N'withdrawal' THEN N'Rút tiền'
    ELSE N'Điều chỉnh'
  END AS TransactionTypeName,
  wt.Description,
  wt.Amount,
  wt.TransactionStatus,
  wt.OccurredAt
FROM dbo.ShipperWalletTransactions wt
INNER JOIN dbo.Shippers sh ON sh.ShipperId = wt.ShipperId
LEFT JOIN dbo.Orders o ON o.OrderId = wt.OrderId;
GO

CREATE OR ALTER VIEW dbo.vShipperWalletSummary
AS
SELECT
  sh.ShipperCode,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed'
                      OR (wt.TransactionType = N'withdrawal' AND wt.TransactionStatus = N'pending')
                    THEN wt.Amount ELSE 0 END), 0) AS AvailableBalance,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed' AND wt.TransactionType = N'shipping_fee' THEN wt.Amount ELSE 0 END), 0) AS TotalShippingFee,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed' AND wt.TransactionType IN (N'cod_collected', N'cod_remitted') THEN wt.Amount ELSE 0 END), 0) AS CodHoldingAmount,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'pending' THEN wt.Amount ELSE 0 END), 0) AS PendingAmount
FROM dbo.Shippers sh
LEFT JOIN dbo.ShipperWalletTransactions wt ON wt.ShipperId = sh.ShipperId
GROUP BY sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperRequestWithdrawal
  @ShipperCode NVARCHAR(30),
  @Amount DECIMAL(18,0)
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT, @AvailableBalance DECIMAL(18,0);
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  SELECT @AvailableBalance = AvailableBalance FROM dbo.vShipperWalletSummary WHERE ShipperCode = @ShipperCode;
  IF @ShipperId IS NULL THROW 50071, N'Không tìm thấy shipper.', 1;
  IF @Amount <= 0 OR @Amount > COALESCE(@AvailableBalance, 0) THROW 50072, N'Số tiền rút không hợp lệ hoặc vượt số dư khả dụng.', 1;
  INSERT INTO dbo.ShipperWalletTransactions
    (TransactionCode, ShipperId, TransactionType, Description, Amount, TransactionStatus)
  VALUES
    (CONCAT(N'WD-', @ShipperCode, N'-', FORMAT(SYSUTCDATETIME(), N'yyyyMMddHHmmss')), @ShipperId,
     N'withdrawal', N'Rút tiền về tài khoản', -@Amount, N'pending');
END;
GO
