/*
  DOANH THU & HOA HỒNG – ADMIN
  Chạy sau orders/sample-orders.sql, orders/sample-delivery-details.sql
  và admin/sample-admin.sql.

  Giao dịch được tạo từ đơn hàng mẫu, không dùng giao dịch mock của giao diện.
  Chưa có chính sách hoa hồng nên CommissionRatePercent và CommissionAmount = 0.
*/

IF OBJECT_ID(N'dbo.AdminCommissionTransactions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AdminCommissionTransactions (
    AdminCommissionTransactionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TransactionCode NVARCHAR(50) NOT NULL UNIQUE,
    PartnerType NVARCHAR(20) NOT NULL,
    PartnerCode NVARCHAR(40) NOT NULL,
    OrderId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Description DEFAULT N'0',
    GrossAmount DECIMAL(18,0) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_GrossAmount DEFAULT 0,
    CommissionRatePercent DECIMAL(7,2) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Rate DEFAULT 0,
    CommissionAmount DECIMAL(18,0) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Amount DEFAULT 0,
    TransactionStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Status DEFAULT N'pending',
    TransactionDate DATETIME2 NOT NULL,
    CONSTRAINT CK_AdminCommissionTransactions_Partner CHECK (PartnerType IN (N'seller', N'shipper')),
    CONSTRAINT CK_AdminCommissionTransactions_Status CHECK (TransactionStatus IN (N'pending', N'completed', N'refunded')),
    CONSTRAINT FK_AdminCommissionTransactions_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

INSERT INTO dbo.AdminCommissionTransactions
  (TransactionCode, PartnerType, PartnerCode, OrderId, Description, GrossAmount, CommissionRatePercent, CommissionAmount, TransactionStatus, TransactionDate)
SELECT
  CONCAT(N'SL-', o.OrderCode), N'seller', s.SellerCode, o.OrderId,
  CONCAT(N'Khấu trừ doanh thu đơn ', o.OrderCode), o.TotalAmount, 0, 0,
  CASE WHEN o.Status IN (N'completed', N'delivered', N'Hoàn thành') THEN N'completed'
       WHEN o.Status IN (N'refunded', N'cancelled', N'Hoàn tiền') THEN N'refunded'
       ELSE N'pending' END,
  o.OrderedAt
FROM dbo.Orders o
INNER JOIN dbo.Restaurants r ON r.RestaurantId = o.RestaurantId
INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId
WHERE NOT EXISTS (
  SELECT 1 FROM dbo.AdminCommissionTransactions t WHERE t.TransactionCode = CONCAT(N'SL-', o.OrderCode)
);
GO

INSERT INTO dbo.AdminCommissionTransactions
  (TransactionCode, PartnerType, PartnerCode, OrderId, Description, GrossAmount, CommissionRatePercent, CommissionAmount, TransactionStatus, TransactionDate)
SELECT
  CONCAT(N'SP-', o.OrderCode), N'shipper', sh.ShipperCode, o.OrderId,
  CONCAT(N'Khấu trừ phí giao hàng đơn ', o.OrderCode), COALESCE(o.ShippingFee, 0), 0, 0,
  CASE WHEN o.Status IN (N'completed', N'delivered', N'Hoàn thành') THEN N'completed'
       WHEN o.Status IN (N'refunded', N'cancelled', N'Hoàn tiền') THEN N'refunded'
       ELSE N'pending' END,
  o.OrderedAt
FROM dbo.Orders o
INNER JOIN dbo.Shippers sh ON sh.ShipperId = o.ShipperId
WHERE NOT EXISTS (
  SELECT 1 FROM dbo.AdminCommissionTransactions t WHERE t.TransactionCode = CONCAT(N'SP-', o.OrderCode)
);
GO

CREATE OR ALTER VIEW dbo.vAdminRevenueCommissionTransactions
AS
SELECT
  t.TransactionCode,
  t.PartnerType,
  t.PartnerCode,
  CASE WHEN t.PartnerType = N'seller' THEN s.FullName ELSE sh.FullName END AS PartnerName,
  COALESCE(r.Name, N'0') AS RestaurantName,
  t.Description,
  t.GrossAmount,
  t.CommissionRatePercent,
  t.CommissionAmount,
  t.TransactionStatus,
  t.TransactionDate
FROM dbo.AdminCommissionTransactions t
LEFT JOIN dbo.Sellers s ON t.PartnerType = N'seller' AND s.SellerCode = t.PartnerCode
LEFT JOIN dbo.Restaurants r ON r.SellerId = s.SellerId
LEFT JOIN dbo.Shippers sh ON t.PartnerType = N'shipper' AND sh.ShipperCode = t.PartnerCode;
GO

CREATE OR ALTER VIEW dbo.vAdminRevenueCommissionSummary
AS
SELECT
  COALESCE(SUM(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END), 0) AS TotalCommissionRevenue,
  COUNT(*) AS TransactionCount,
  COALESCE(AVG(CAST(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END AS DECIMAL(18,2))), 0) AS AverageCommissionPerTransaction,
  COUNT(CASE WHEN PartnerType = N'seller' THEN 1 END) AS SellerTransactionCount,
  COUNT(CASE WHEN PartnerType = N'shipper' THEN 1 END) AS ShipperTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'pending' THEN 1 END) AS PendingTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'completed' THEN 1 END) AS CompletedTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'refunded' THEN 1 END) AS RefundedTransactionCount
FROM dbo.AdminCommissionTransactions;
GO

CREATE OR ALTER VIEW dbo.vAdminDailyCommissionRevenue
AS
SELECT
  CAST(TransactionDate AS DATE) AS RevenueDate,
  COALESCE(SUM(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END), 0) AS CommissionRevenue,
  COUNT(*) AS TransactionCount
FROM dbo.AdminCommissionTransactions
GROUP BY CAST(TransactionDate AS DATE);
GO

CREATE OR ALTER PROCEDURE dbo.uspAdminSetCommissionRate
  @TransactionCode NVARCHAR(50),
  @CommissionRatePercent DECIMAL(7,2)
AS
BEGIN
  SET NOCOUNT ON;
  IF @CommissionRatePercent < 0 OR @CommissionRatePercent > 100
    THROW 50021, N'Tỷ lệ hoa hồng phải từ 0 đến 100.', 1;
  UPDATE dbo.AdminCommissionTransactions
  SET CommissionRatePercent = @CommissionRatePercent,
      CommissionAmount = ROUND(GrossAmount * @CommissionRatePercent / 100, 0)
  WHERE TransactionCode = @TransactionCode;
  IF @@ROWCOUNT = 0 THROW 50022, N'Không tìm thấy giao dịch.', 1;
END;
GO
