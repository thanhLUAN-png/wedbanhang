/* CÀI ĐẶT SELLER VÀ QUÁN ĂN */
IF OBJECT_ID(N'dbo.RestaurantSettings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.RestaurantSettings (
    RestaurantId INT PRIMARY KEY,
    ShopCategory NVARCHAR(100) NOT NULL DEFAULT N'0',
    OpenTime NVARCHAR(10) NOT NULL DEFAULT N'0',
    CloseTime NVARCHAR(10) NOT NULL DEFAULT N'0',
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RestaurantSettings_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId)
  );
END;
GO

IF OBJECT_ID(N'dbo.SellerNotificationSettings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.SellerNotificationSettings (
    SellerId INT PRIMARY KEY,
    NewOrderEnabled BIT NOT NULL DEFAULT 0,
    ShippingOrderEnabled BIT NOT NULL DEFAULT 0,
    CompletedOrderEnabled BIT NOT NULL DEFAULT 0,
    CustomerMessageEnabled BIT NOT NULL DEFAULT 0,
    SystemPromotionEnabled BIT NOT NULL DEFAULT 0,
    EmailEnabled BIT NOT NULL DEFAULT 0,
    SmsEnabled BIT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_SellerNotificationSettings_Sellers FOREIGN KEY (SellerId) REFERENCES dbo.Sellers(SellerId)
  );
END;
GO

/* Tạo cấu hình mặc định: thông tin/chọn lựa chưa có đều là 0. */
INSERT INTO dbo.RestaurantSettings (RestaurantId, ShopCategory, OpenTime, CloseTime)
SELECT r.RestaurantId, N'0', N'0', N'0'
FROM dbo.Restaurants r
WHERE NOT EXISTS (SELECT 1 FROM dbo.RestaurantSettings rs WHERE rs.RestaurantId = r.RestaurantId);

INSERT INTO dbo.SellerNotificationSettings (SellerId)
SELECT s.SellerId
FROM dbo.Sellers s
WHERE NOT EXISTS (SELECT 1 FROM dbo.SellerNotificationSettings ns WHERE ns.SellerId = s.SellerId);
GO

CREATE OR ALTER VIEW dbo.vSellerSettings AS
SELECT s.SellerCode, r.RestaurantCode, r.Name, r.Phone, r.Email, r.Address, r.Description,
       COALESCE(rs.ShopCategory, N'0') AS ShopCategory,
       COALESCE(rs.OpenTime, N'0') AS OpenTime,
       COALESCE(rs.CloseTime, N'0') AS CloseTime,
       COALESCE(ns.NewOrderEnabled, 0) AS NewOrderEnabled,
       COALESCE(ns.ShippingOrderEnabled, 0) AS ShippingOrderEnabled,
       COALESCE(ns.CompletedOrderEnabled, 0) AS CompletedOrderEnabled,
       COALESCE(ns.CustomerMessageEnabled, 0) AS CustomerMessageEnabled,
       COALESCE(ns.SystemPromotionEnabled, 0) AS SystemPromotionEnabled,
       COALESCE(ns.EmailEnabled, 0) AS EmailEnabled,
       COALESCE(ns.SmsEnabled, 0) AS SmsEnabled
FROM dbo.Sellers s
JOIN dbo.Restaurants r ON r.SellerId = s.SellerId
LEFT JOIN dbo.RestaurantSettings rs ON rs.RestaurantId = r.RestaurantId
LEFT JOIN dbo.SellerNotificationSettings ns ON ns.SellerId = s.SellerId;
GO
