/* QUẢN LÝ KHUYẾN MÃI SELLER */
IF OBJECT_ID(N'dbo.Promotions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Promotions (
    PromotionId INT IDENTITY(1,1) PRIMARY KEY,
    PromotionCode NVARCHAR(50) NOT NULL UNIQUE,
    RestaurantId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL DEFAULT N'0',
    Description NVARCHAR(1000) NOT NULL DEFAULT N'0',
    DiscountType NVARCHAR(20) NOT NULL, /* amount | percent | shipping */
    DiscountValue DECIMAL(18,0) NOT NULL DEFAULT 0,
    MinimumOrderAmount DECIMAL(18,0) NOT NULL DEFAULT 0,
    MaximumDiscountAmount DECIMAL(18,0) NOT NULL DEFAULT 0,
    UsageLimit INT NOT NULL DEFAULT 0,
    UsageCount INT NOT NULL DEFAULT 0,
    StartAt DATETIME2 NULL,
    EndAt DATETIME2 NULL,
    PromotionStatus NVARCHAR(30) NOT NULL DEFAULT N'draft', /* draft | active | upcoming | expired | hidden */
    AppliesTo NVARCHAR(30) NOT NULL DEFAULT N'all_menu', /* all_menu | selected_items | selected_combos */
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Promotions_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId),
    CONSTRAINT CK_Promotions_DiscountType CHECK (DiscountType IN (N'amount', N'percent', N'shipping')),
    CONSTRAINT CK_Promotions_Usage CHECK (UsageCount >= 0 AND UsageLimit >= 0)
  );
END;
GO

IF OBJECT_ID(N'dbo.PromotionMenuItems', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.PromotionMenuItems (
    PromotionId INT NOT NULL,
    MenuItemId INT NOT NULL,
    PRIMARY KEY (PromotionId, MenuItemId),
    CONSTRAINT FK_PromotionMenuItems_Promotions FOREIGN KEY (PromotionId) REFERENCES dbo.Promotions(PromotionId),
    CONSTRAINT FK_PromotionMenuItems_MenuItems FOREIGN KEY (MenuItemId) REFERENCES dbo.MenuItems(MenuItemId)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vSellerPromotionSummary AS
SELECT
  r.SellerId,
  r.RestaurantId,
  r.RestaurantCode,
  COALESCE(COUNT(p.PromotionId), 0) AS TotalPromotions,
  COALESCE(SUM(CASE WHEN p.PromotionStatus = N'active' THEN 1 ELSE 0 END), 0) AS ActivePromotions,
  COALESCE(SUM(CASE WHEN p.PromotionStatus = N'upcoming' THEN 1 ELSE 0 END), 0) AS UpcomingPromotions,
  COALESCE(SUM(CASE WHEN p.PromotionStatus = N'expired' THEN 1 ELSE 0 END), 0) AS ExpiredPromotions
FROM dbo.Restaurants r
LEFT JOIN dbo.Promotions p ON p.RestaurantId = r.RestaurantId AND p.IsDeleted = 0
GROUP BY r.SellerId, r.RestaurantId, r.RestaurantCode;
GO

/* Chưa thêm khuyến mãi mẫu: số lượng, lượt dùng và giá trị thiếu đều trả 0. */
