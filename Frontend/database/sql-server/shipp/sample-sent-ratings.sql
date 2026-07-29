/*
  SHIPPER – ĐÁNH GIÁ ĐÃ GỬI
  Chạy sau orders/sample-orders.sql.
  Shipper đánh giá khách hàng và quán ăn theo đơn completed; chưa có đánh giá mẫu.
*/

IF OBJECT_ID(N'dbo.ShipperSentRatings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperSentRatings (
    ShipperSentRatingId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ShipperId INT NOT NULL,
    OrderId INT NOT NULL,
    RatedPartyType NVARCHAR(20) NOT NULL,
    Rating TINYINT NOT NULL,
    Comment NVARCHAR(1000) NOT NULL CONSTRAINT DF_ShipperSentRatings_Comment DEFAULT N'0',
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperSentRatings_CreatedAt DEFAULT SYSUTCDATETIME(),
    EditableUntil DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT UQ_ShipperSentRatings UNIQUE (ShipperId, OrderId, RatedPartyType),
    CONSTRAINT CK_ShipperSentRatings_Party CHECK (RatedPartyType IN (N'customer', N'seller')),
    CONSTRAINT CK_ShipperSentRatings_Rating CHECK (Rating BETWEEN 1 AND 5),
    CONSTRAINT FK_ShipperSentRatings_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId),
    CONSTRAINT FK_ShipperSentRatings_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vShipperSentRatings
AS
SELECT
  sh.ShipperCode,
  o.OrderCode,
  CAST(o.OrderedAt AS DATE) AS OrderDate,
  sr.RatedPartyType,
  CASE WHEN sr.RatedPartyType = N'customer' THEN c.FullName ELSE s.FullName END AS RatedPartyName,
  sr.Rating,
  sr.Comment,
  sr.CreatedAt,
  sr.EditableUntil,
  CASE WHEN SYSUTCDATETIME() <= sr.EditableUntil THEN 1 ELSE 0 END AS IsEditable,
  CASE WHEN SYSUTCDATETIME() > sr.EditableUntil THEN 1 ELSE 0 END AS IsLocked
FROM dbo.ShipperSentRatings sr
INNER JOIN dbo.Shippers sh ON sh.ShipperId = sr.ShipperId
INNER JOIN dbo.Orders o ON o.OrderId = sr.OrderId
INNER JOIN dbo.Customers c ON c.CustomerId = o.CustomerId
INNER JOIN dbo.Restaurants r ON r.RestaurantId = o.RestaurantId
INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId;
GO

CREATE OR ALTER VIEW dbo.vShipperSentRatingSummary
AS
SELECT
  sh.ShipperCode,
  COALESCE(AVG(CASE WHEN sr.RatedPartyType = N'customer' THEN CAST(sr.Rating AS DECIMAL(3,2)) END), 0) AS AverageCustomerRating,
  COALESCE(AVG(CASE WHEN sr.RatedPartyType = N'seller' THEN CAST(sr.Rating AS DECIMAL(3,2)) END), 0) AS AverageSellerRating,
  COUNT(DISTINCT sr.OrderId) AS RatedOrderCount
FROM dbo.Shippers sh
LEFT JOIN dbo.ShipperSentRatings sr ON sr.ShipperId = sh.ShipperId
GROUP BY sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperSubmitRating
  @ShipperCode NVARCHAR(30),
  @OrderCode NVARCHAR(30),
  @RatedPartyType NVARCHAR(20),
  @Rating TINYINT,
  @Comment NVARCHAR(1000) = N'0'
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT, @OrderId INT;
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  SELECT @OrderId = OrderId FROM dbo.Orders WHERE OrderCode = @OrderCode AND ShipperId = @ShipperId AND Status = N'completed';
  IF @ShipperId IS NULL OR @OrderId IS NULL THROW 50091, N'Chỉ đánh giá được đơn hoàn thành thuộc shipper.', 1;
  IF @RatedPartyType NOT IN (N'customer', N'seller') OR @Rating NOT BETWEEN 1 AND 5
    THROW 50092, N'Loại đối tượng hoặc số sao không hợp lệ.', 1;
  IF EXISTS (SELECT 1 FROM dbo.ShipperSentRatings WHERE ShipperId = @ShipperId AND OrderId = @OrderId AND RatedPartyType = @RatedPartyType)
    THROW 50093, N'Đối tượng này đã được đánh giá cho đơn hàng.', 1;
  INSERT INTO dbo.ShipperSentRatings (ShipperId, OrderId, RatedPartyType, Rating, Comment, EditableUntil)
  VALUES (@ShipperId, @OrderId, @RatedPartyType, @Rating, COALESCE(NULLIF(@Comment, N''), N'0'), DATEADD(MINUTE, 30, SYSUTCDATETIME()));
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperUpdateRating
  @ShipperCode NVARCHAR(30),
  @ShipperSentRatingId BIGINT,
  @Rating TINYINT,
  @Comment NVARCHAR(1000) = N'0'
AS
BEGIN
  SET NOCOUNT ON;
  IF @Rating NOT BETWEEN 1 AND 5 THROW 50094, N'Số sao phải từ 1 đến 5.', 1;
  UPDATE sr
  SET Rating = @Rating, Comment = COALESCE(NULLIF(@Comment, N''), N'0'), UpdatedAt = SYSUTCDATETIME()
  FROM dbo.ShipperSentRatings sr
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = sr.ShipperId
  WHERE sr.ShipperSentRatingId = @ShipperSentRatingId
    AND sh.ShipperCode = @ShipperCode
    AND SYSUTCDATETIME() <= sr.EditableUntil;
  IF @@ROWCOUNT = 0 THROW 50095, N'Không tìm thấy đánh giá hoặc đã hết thời gian chỉnh sửa.', 1;
END;
GO
