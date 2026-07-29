/*
  SHIPPER – TRANG NHẬN ĐƠN
  Chạy sau orders/sample-orders.sql và orders/sample-delivery-details.sql.
  Dùng các đơn pending chưa có ShipperId trong dữ liệu đơn mẫu;
  không tạo thêm đơn mock. Giá trị giao hàng chưa có giữ 0.
*/

IF OBJECT_ID(N'dbo.ShipperWorkStates', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperWorkStates (
    ShipperId INT NOT NULL PRIMARY KEY,
    IsOnline BIT NOT NULL CONSTRAINT DF_ShipperWorkStates_IsOnline DEFAULT 0,
    LastLatitude DECIMAL(9,5) NOT NULL CONSTRAINT DF_ShipperWorkStates_LastLatitude DEFAULT 0,
    LastLongitude DECIMAL(9,5) NOT NULL CONSTRAINT DF_ShipperWorkStates_LastLongitude DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperWorkStates_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ShipperWorkStates_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId)
  );
END;
GO

INSERT INTO dbo.ShipperWorkStates (ShipperId, IsOnline, LastLatitude, LastLongitude)
SELECT s.ShipperId, 0, 0, 0
FROM dbo.Shippers s
WHERE NOT EXISTS (SELECT 1 FROM dbo.ShipperWorkStates ws WHERE ws.ShipperId = s.ShipperId);
GO

CREATE OR ALTER VIEW dbo.vShipperAvailableOrders
AS
SELECT
  o.OrderCode,
  r.RestaurantCode,
  r.Name AS RestaurantName,
  COALESCE(r.Address, N'0') AS PickupAddress,
  c.FullName AS RecipientName,
  c.Phone AS RecipientPhone,
  o.DeliveryAddress,
  COALESCE(items.ItemSummary, N'0') AS ItemSummary,
  COALESCE(items.TotalQuantity, 0) AS TotalItemQuantity,
  COALESCE(o.PackageWeightKg, 0) AS PackageWeightKg,
  COALESCE(o.ShippingFee, 0) AS ShippingFee,
  COALESCE(o.CodAmount, 0) AS CodAmount,
  COALESCE(o.DistanceKm, 0) AS DistanceKm,
  o.PaymentMethod,
  o.OrderedAt,
  N'pending_pickup' AS PickupStatus
FROM dbo.Orders o
INNER JOIN dbo.Restaurants r ON r.RestaurantId = o.RestaurantId
INNER JOIN dbo.Customers c ON c.CustomerId = o.CustomerId
OUTER APPLY (
  SELECT
    STRING_AGG(CONCAT(oi.ProductNameSnapshot, N' x', oi.Quantity), N', ') AS ItemSummary,
    SUM(oi.Quantity) AS TotalQuantity
  FROM dbo.OrderItems oi
  WHERE oi.OrderId = o.OrderId
) items
WHERE o.ShipperId IS NULL AND o.Status = N'pending';
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperSetWorkState
  @ShipperCode NVARCHAR(30),
  @IsOnline BIT,
  @Latitude DECIMAL(9,5) = 0,
  @Longitude DECIMAL(9,5) = 0
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE ws
  SET IsOnline = @IsOnline,
      LastLatitude = COALESCE(@Latitude, 0),
      LastLongitude = COALESCE(@Longitude, 0),
      UpdatedAt = SYSUTCDATETIME()
  FROM dbo.ShipperWorkStates ws
  INNER JOIN dbo.Shippers s ON s.ShipperId = ws.ShipperId
  WHERE s.ShipperCode = @ShipperCode;
  IF @@ROWCOUNT = 0 THROW 50041, N'Không tìm thấy shipper.', 1;
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperAcceptOrder
  @ShipperCode NVARCHAR(30),
  @OrderCode NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT;
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  IF @ShipperId IS NULL THROW 50042, N'Không tìm thấy shipper.', 1;

  UPDATE dbo.Orders
  SET ShipperId = @ShipperId,
      ShipperCodeSnapshot = @ShipperCode,
      Status = N'accepted'
  WHERE OrderCode = @OrderCode
    AND ShipperId IS NULL
    AND Status = N'pending';
  IF @@ROWCOUNT = 0 THROW 50043, N'Đơn không còn ở trạng thái chờ nhận hoặc đã có shipper khác nhận.', 1;
END;
GO
