/* THỐNG KÊ ĐƠN HÀNG SELLER – chạy sau các file trong orders/ */
GO
CREATE OR ALTER VIEW dbo.vSellerOrderStatistics AS
SELECT
  r.SellerId,
  r.RestaurantId,
  r.RestaurantCode,
  COALESCE(COUNT(o.OrderId), 0) AS TotalOrders,
  COALESCE(SUM(CASE WHEN o.Status = N'completed' THEN 1 ELSE 0 END), 0) AS CompletedOrders,
  COALESCE(SUM(CASE WHEN o.Status = N'returned' THEN 1 ELSE 0 END), 0) AS ReturnedOrders,
  COALESCE(SUM(CASE WHEN o.Status = N'cancelled' THEN 1 ELSE 0 END), 0) AS CancelledOrders,
  COALESCE(SUM(CASE WHEN o.Status = N'confirmed' THEN 1 ELSE 0 END), 0) AS ConfirmedOrders,
  COALESCE(SUM(CASE WHEN o.Status = N'pending' THEN 1 ELSE 0 END), 0) AS PendingOrders,
  CAST(CASE WHEN COUNT(o.OrderId) = 0 THEN 0
       ELSE SUM(CASE WHEN o.Status = N'completed' THEN 1.0 ELSE 0 END) * 100 / COUNT(o.OrderId) END AS DECIMAL(5,2)) AS CompletionRate
FROM dbo.Restaurants r
LEFT JOIN dbo.Orders o ON o.RestaurantId = r.RestaurantId
GROUP BY r.SellerId, r.RestaurantId, r.RestaurantCode;
GO

CREATE OR ALTER VIEW dbo.vSellerProductStatistics AS
SELECT
  r.SellerId,
  r.RestaurantId,
  m.MenuItemCode,
  m.Name AS ProductName,
  COALESCE(SUM(oi.Quantity), 0) AS SoldQuantity,
  COALESCE(SUM(oi.Quantity * oi.UnitPrice), 0) AS Revenue
FROM dbo.Restaurants r
JOIN dbo.MenuItems m ON m.RestaurantId = r.RestaurantId
LEFT JOIN dbo.Orders o ON o.RestaurantId = r.RestaurantId
LEFT JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId AND oi.ProductNameSnapshot = m.Name
GROUP BY r.SellerId, r.RestaurantId, m.MenuItemCode, m.Name;
GO

/* Ví dụ quán số 1 BT-74101118-0001 chưa có đơn: cả hai view trả về số 0. */
