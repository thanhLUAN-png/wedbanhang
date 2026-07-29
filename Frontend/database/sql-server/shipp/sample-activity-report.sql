/*
  SHIPPER – BÁO CÁO HOẠT ĐỘNG
  Chạy sau orders/sample-orders.sql, orders/sample-delivery-details.sql và shipp/sample-wallet.sql.
  Đơn/thu nhập lấy từ dữ liệu thật; đánh giá và ca hoạt động chưa có nên trả 0.
*/

IF OBJECT_ID(N'dbo.ShipperActivitySessions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperActivitySessions (
    ShipperActivitySessionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ShipperId INT NOT NULL,
    StartedAt DATETIME2 NOT NULL,
    EndedAt DATETIME2 NULL,
    CONSTRAINT FK_ShipperActivitySessions_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vShipperActivityDaily
AS
WITH OrderDaily AS (
  SELECT
    o.ShipperId,
    CAST(o.OrderedAt AS DATE) AS ActivityDate,
    COUNT(*) AS TotalOrderCount,
    COUNT(CASE WHEN o.Status = N'completed' THEN 1 END) AS SuccessOrderCount,
    COUNT(CASE WHEN o.Status IN (N'returned', N'cancelled') THEN 1 END) AS FailedOrderCount,
    COALESCE(SUM(CASE WHEN o.Status = N'completed' THEN COALESCE(o.ShippingFee, 0) ELSE 0 END), 0) AS ShippingIncome
  FROM dbo.Orders o
  WHERE o.ShipperId IS NOT NULL
  GROUP BY o.ShipperId, CAST(o.OrderedAt AS DATE)
), SessionDaily AS (
  SELECT
    ShipperId,
    CAST(StartedAt AS DATE) AS ActivityDate,
    COALESCE(SUM(DATEDIFF(MINUTE, StartedAt, COALESCE(EndedAt, StartedAt))), 0) AS ActiveMinutes
  FROM dbo.ShipperActivitySessions
  GROUP BY ShipperId, CAST(StartedAt AS DATE)
), Daily AS (
  SELECT
    COALESCE(o.ShipperId, s.ShipperId) AS ShipperId,
    COALESCE(o.ActivityDate, s.ActivityDate) AS ActivityDate,
    COALESCE(o.TotalOrderCount, 0) AS TotalOrderCount,
    COALESCE(o.SuccessOrderCount, 0) AS SuccessOrderCount,
    COALESCE(o.FailedOrderCount, 0) AS FailedOrderCount,
    COALESCE(o.ShippingIncome, 0) AS ShippingIncome,
    COALESCE(s.ActiveMinutes, 0) AS ActiveMinutes
  FROM OrderDaily o
  FULL OUTER JOIN SessionDaily s ON s.ShipperId = o.ShipperId AND s.ActivityDate = o.ActivityDate
)
SELECT
  sh.ShipperCode,
  d.ActivityDate,
  d.TotalOrderCount,
  d.SuccessOrderCount,
  d.FailedOrderCount,
  d.ShippingIncome,
  d.ActiveMinutes
FROM dbo.Shippers sh
LEFT JOIN Daily d ON d.ShipperId = sh.ShipperId;
GO

CREATE OR ALTER VIEW dbo.vShipperActivityReport
AS
SELECT
  sh.ShipperCode,
  COALESCE(SUM(d.TotalOrderCount), 0) AS TotalOrderCount,
  COALESCE(SUM(d.SuccessOrderCount), 0) AS SuccessOrderCount,
  COALESCE(SUM(d.FailedOrderCount), 0) AS FailedOrderCount,
  CAST(CASE WHEN COALESCE(SUM(d.TotalOrderCount), 0) = 0 THEN 0
       ELSE COALESCE(SUM(d.SuccessOrderCount), 0) * 100.0 / SUM(d.TotalOrderCount) END AS DECIMAL(7,2)) AS SuccessRatePercent,
  COALESCE(SUM(d.ShippingIncome), 0) AS ShippingIncome,
  COALESCE(SUM(d.ActiveMinutes), 0) AS ActiveMinutes,
  CAST(0 AS DECIMAL(3,2)) AS AverageRating,
  CAST(0 AS INT) AS RatingCount
FROM dbo.Shippers sh
LEFT JOIN dbo.vShipperActivityDaily d ON d.ShipperCode = sh.ShipperCode
GROUP BY sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperStartActivitySession
  @ShipperCode NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT;
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  IF @ShipperId IS NULL THROW 50081, N'Không tìm thấy shipper.', 1;
  IF EXISTS (SELECT 1 FROM dbo.ShipperActivitySessions WHERE ShipperId = @ShipperId AND EndedAt IS NULL)
    THROW 50082, N'Shipper đang có ca hoạt động chưa kết thúc.', 1;
  INSERT INTO dbo.ShipperActivitySessions (ShipperId, StartedAt) VALUES (@ShipperId, SYSUTCDATETIME());
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperEndActivitySession
  @ShipperCode NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE s SET EndedAt = SYSUTCDATETIME()
  FROM dbo.ShipperActivitySessions s
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = s.ShipperId
  WHERE sh.ShipperCode = @ShipperCode AND s.EndedAt IS NULL;
  IF @@ROWCOUNT = 0 THROW 50083, N'Không có ca hoạt động đang mở để kết thúc.', 1;
END;
GO
