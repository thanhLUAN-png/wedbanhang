/* THÔNG TIN SHOP SELLER – chạy sau sample-restaurants.sql */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* Các số liệu chưa có dữ liệu thực đều mặc định bằng 0. */
IF COL_LENGTH('dbo.Restaurants', 'Rating') IS NULL
  ALTER TABLE dbo.Restaurants ADD Rating DECIMAL(3,2) NOT NULL CONSTRAINT DF_Restaurants_Rating DEFAULT 0;
IF COL_LENGTH('dbo.Restaurants', 'RatingCount') IS NULL
  ALTER TABLE dbo.Restaurants ADD RatingCount INT NOT NULL CONSTRAINT DF_Restaurants_RatingCount DEFAULT 0;
IF COL_LENGTH('dbo.Restaurants', 'TotalOrderCount') IS NULL
  ALTER TABLE dbo.Restaurants ADD TotalOrderCount INT NOT NULL CONSTRAINT DF_Restaurants_TotalOrderCount DEFAULT 0;
IF COL_LENGTH('dbo.Restaurants', 'CompletionRate') IS NULL
  ALTER TABLE dbo.Restaurants ADD CompletionRate DECIMAL(5,2) NOT NULL CONSTRAINT DF_Restaurants_CompletionRate DEFAULT 0;
IF COL_LENGTH('dbo.Restaurants', 'OpeningHours') IS NULL
  ALTER TABLE dbo.Restaurants ADD OpeningHours NVARCHAR(100) NOT NULL CONSTRAINT DF_Restaurants_OpeningHours DEFAULT N'0';
IF COL_LENGTH('dbo.Restaurants', 'LogoUrl') IS NULL
  ALTER TABLE dbo.Restaurants ADD LogoUrl NVARCHAR(1000) NULL;

/* Quán số 1: giữ thông tin mẫu đã tạo; số liệu chưa có là 0. */
UPDATE dbo.Restaurants
SET Rating = 0,
    RatingCount = 0,
    TotalOrderCount = 0,
    CompletionRate = 0,
    OpeningHours = N'0'
WHERE RestaurantCode = N'BT-74101118-0001';

GO
CREATE OR ALTER VIEW dbo.vSellerShopInfo AS
SELECT s.SellerCode, r.RestaurantCode, r.Name, r.Description, r.Phone, r.Email, r.Address,
       r.RegionCode, r.Latitude, r.Longitude, r.Rating, r.RatingCount, r.TotalOrderCount,
       r.CompletionRate, r.OpeningHours, r.LogoUrl
FROM dbo.Restaurants r
JOIN dbo.Sellers s ON s.SellerId = r.SellerId;
GO

COMMIT TRANSACTION;
