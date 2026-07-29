/*
  SHIPPER – LỊCH SỬ GIAO HÀNG
  Chạy sau orders/sample-orders.sql và orders/sample-delivery-details.sql.
  Lấy lịch sử từ chính Orders đã có ShipperId và trạng thái hoàn tất/hoàn/hủy.
*/

IF COL_LENGTH(N'dbo.Orders', N'ShipperDeliveryNote') IS NULL
  ALTER TABLE dbo.Orders ADD ShipperDeliveryNote NVARCHAR(1000) NOT NULL
    CONSTRAINT DF_Orders_ShipperDeliveryNote DEFAULT N'0';
GO

IF COL_LENGTH(N'dbo.Orders', N'DeliveredAt') IS NULL
  ALTER TABLE dbo.Orders ADD DeliveredAt DATETIME2 NULL;
GO

CREATE OR ALTER VIEW dbo.vShipperDeliveryHistory
AS
SELECT
  sh.ShipperCode,
  o.OrderCode,
  CAST(o.OrderedAt AS DATE) AS DeliveryDate,
  c.FullName AS RecipientName,
  c.Phone AS RecipientPhone,
  o.DeliveryAddress,
  COALESCE(items.ItemSummary, N'0') AS ItemSummary,
  COALESCE(o.ShippingFee, 0) AS ShippingFee,
  COALESCE(o.CodAmount, 0) AS CodAmount,
  COALESCE(o.DistanceKm, 0) AS DistanceKm,
  CASE WHEN o.Status = N'completed' THEN N'success' ELSE N'failed' END AS DeliveryResult,
  CASE WHEN o.Status = N'completed' THEN N'Giao thành công' ELSE N'Không giao được' END AS DeliveryResultName,
  COALESCE(o.ShipperDeliveryNote, N'0') AS DeliveryNote,
  COALESCE(o.DeliveredAt, o.OrderedAt) AS CompletedAt
FROM dbo.Orders o
INNER JOIN dbo.Shippers sh ON sh.ShipperId = o.ShipperId
INNER JOIN dbo.Customers c ON c.CustomerId = o.CustomerId
OUTER APPLY (
  SELECT STRING_AGG(CONCAT(oi.ProductNameSnapshot, N' x', oi.Quantity), N', ') AS ItemSummary
  FROM dbo.OrderItems oi WHERE oi.OrderId = o.OrderId
) items
WHERE o.ShipperId IS NOT NULL
  AND o.Status IN (N'completed', N'returned', N'cancelled');
GO

CREATE OR ALTER VIEW dbo.vShipperDeliveryHistorySummary
AS
SELECT
  ShipperCode,
  COUNT(*) AS TotalOrderCount,
  COUNT(CASE WHEN DeliveryResult = N'success' THEN 1 END) AS SuccessOrderCount,
  COUNT(CASE WHEN DeliveryResult = N'failed' THEN 1 END) AS FailedOrderCount,
  CAST(CASE WHEN COUNT(*) = 0 THEN 0
       ELSE COUNT(CASE WHEN DeliveryResult = N'success' THEN 1 END) * 100.0 / COUNT(*) END AS DECIMAL(7,2)) AS SuccessRatePercent,
  COALESCE(SUM(CASE WHEN DeliveryResult = N'success' THEN ShippingFee ELSE 0 END), 0) AS TotalShippingFee
FROM dbo.vShipperDeliveryHistory
GROUP BY ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperCompleteDelivery
  @ShipperCode NVARCHAR(30),
  @OrderCode NVARCHAR(30),
  @DeliveryNote NVARCHAR(1000) = N'0'
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE o
  SET Status = N'completed',
      ShipperDeliveryNote = COALESCE(NULLIF(@DeliveryNote, N''), N'0'),
      DeliveredAt = SYSUTCDATETIME()
  FROM dbo.Orders o
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = o.ShipperId
  WHERE o.OrderCode = @OrderCode AND sh.ShipperCode = @ShipperCode
    AND o.Status IN (N'accepted', N'preparing', N'shipping');
  IF @@ROWCOUNT = 0 THROW 50051, N'Đơn không thuộc shipper hoặc không thể hoàn tất ở trạng thái hiện tại.', 1;
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperMarkDeliveryFailed
  @ShipperCode NVARCHAR(30),
  @OrderCode NVARCHAR(30),
  @FailureNote NVARCHAR(1000) = N'0'
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE o
  SET Status = N'returned',
      ShipperDeliveryNote = COALESCE(NULLIF(@FailureNote, N''), N'0'),
      DeliveredAt = SYSUTCDATETIME()
  FROM dbo.Orders o
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = o.ShipperId
  WHERE o.OrderCode = @OrderCode AND sh.ShipperCode = @ShipperCode
    AND o.Status IN (N'accepted', N'preparing', N'shipping');
  IF @@ROWCOUNT = 0 THROW 50052, N'Đơn không thuộc shipper hoặc không thể cập nhật giao thất bại.', 1;
END;
GO
