/*
  KIỂM DUYỆT SẢN PHẨM – ADMIN
  Chạy sau seller/sample-restaurants.sql và admin/sample-admin.sql.
  Lấy trực tiếp 240 MenuItems + 24 Combos của dữ liệu mẫu đã tạo.
  Chưa có lịch sử kiểm duyệt nên tất cả bắt đầu là pending;
  ghi chú, người duyệt và số liệu chưa có hiển thị/lưu là 0.
*/

IF OBJECT_ID(N'dbo.ProductModerations', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ProductModerations (
    ProductModerationId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ProductCode NVARCHAR(60) NOT NULL UNIQUE,
    ProductType NVARCHAR(20) NOT NULL,
    RestaurantId INT NOT NULL,
    ModerationStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ProductModerations_Status DEFAULT N'pending',
    ReviewNote NVARCHAR(1000) NOT NULL CONSTRAINT DF_ProductModerations_ReviewNote DEFAULT N'0',
    ReviewedByAdminId INT NULL,
    SubmittedAt DATETIME2 NOT NULL CONSTRAINT DF_ProductModerations_SubmittedAt DEFAULT SYSUTCDATETIME(),
    ReviewedAt DATETIME2 NULL,
    CONSTRAINT CK_ProductModerations_Type CHECK (ProductType IN (N'menu_item', N'combo')),
    CONSTRAINT CK_ProductModerations_Status CHECK (ModerationStatus IN (N'pending', N'approved', N'rejected')),
    CONSTRAINT FK_ProductModerations_Restaurant FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId),
    CONSTRAINT FK_ProductModerations_Admin FOREIGN KEY (ReviewedByAdminId) REFERENCES dbo.Administrators(AdminId)
  );
END;
GO

IF OBJECT_ID(N'dbo.ProductModerationHistory', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ProductModerationHistory (
    ProductModerationHistoryId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ProductModerationId BIGINT NOT NULL,
    OldStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ProductModerationHistory_OldStatus DEFAULT N'0',
    NewStatus NVARCHAR(20) NOT NULL,
    ReviewNote NVARCHAR(1000) NOT NULL CONSTRAINT DF_ProductModerationHistory_ReviewNote DEFAULT N'0',
    ChangedByAdminId INT NULL,
    ChangedAt DATETIME2 NOT NULL CONSTRAINT DF_ProductModerationHistory_ChangedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ProductModerationHistory_Moderation FOREIGN KEY (ProductModerationId) REFERENCES dbo.ProductModerations(ProductModerationId),
    CONSTRAINT FK_ProductModerationHistory_Admin FOREIGN KEY (ChangedByAdminId) REFERENCES dbo.Administrators(AdminId)
  );
END;
GO

INSERT INTO dbo.ProductModerations (ProductCode, ProductType, RestaurantId, ModerationStatus, ReviewNote)
SELECT m.MenuItemCode, N'menu_item', m.RestaurantId, N'pending', N'0'
FROM dbo.MenuItems m
WHERE NOT EXISTS (SELECT 1 FROM dbo.ProductModerations pm WHERE pm.ProductCode = m.MenuItemCode);
GO

INSERT INTO dbo.ProductModerations (ProductCode, ProductType, RestaurantId, ModerationStatus, ReviewNote)
SELECT c.ComboCode, N'combo', c.RestaurantId, N'pending', N'0'
FROM dbo.Combos c
WHERE NOT EXISTS (SELECT 1 FROM dbo.ProductModerations pm WHERE pm.ProductCode = c.ComboCode);
GO

CREATE OR ALTER VIEW dbo.vAdminProductModeration
AS
WITH Products AS (
  SELECT MenuItemCode AS ProductCode, N'menu_item' AS ProductType, RestaurantId, Name, Description, Price, N'0' AS CategoryName
  FROM dbo.MenuItems
  UNION ALL
  SELECT ComboCode, N'combo', RestaurantId, Name, Description, Price, N'Combo'
  FROM dbo.Combos
)
SELECT
  pm.ProductCode,
  pm.ProductType,
  p.Name AS ProductName,
  COALESCE(p.Description, N'0') AS ProductDescription,
  p.CategoryName,
  p.Price,
  r.RestaurantCode,
  r.Name AS RestaurantName,
  s.SellerCode,
  s.FullName AS SellerName,
  pm.ModerationStatus,
  pm.ReviewNote,
  pm.SubmittedAt,
  pm.ReviewedAt,
  COALESCE(a.AdminCode, N'0') AS ReviewedByAdminCode
FROM dbo.ProductModerations pm
INNER JOIN Products p ON p.ProductCode = pm.ProductCode
INNER JOIN dbo.Restaurants r ON r.RestaurantId = pm.RestaurantId
INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId
LEFT JOIN dbo.Administrators a ON a.AdminId = pm.ReviewedByAdminId;
GO

CREATE OR ALTER VIEW dbo.vAdminProductModerationSummary
AS
SELECT
  COUNT(*) AS TotalProductCount,
  COUNT(CASE WHEN ModerationStatus = N'pending' THEN 1 END) AS PendingCount,
  COUNT(CASE WHEN ModerationStatus = N'approved' THEN 1 END) AS ApprovedCount,
  COUNT(CASE WHEN ModerationStatus = N'rejected' THEN 1 END) AS RejectedCount
FROM dbo.ProductModerations;
GO

CREATE OR ALTER PROCEDURE dbo.uspAdminReviewProduct
  @ProductCode NVARCHAR(60),
  @NewStatus NVARCHAR(20),
  @ReviewNote NVARCHAR(1000) = N'0',
  @AdminCode NVARCHAR(20) = N'ADM-0001'
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ProductModerationId BIGINT, @OldStatus NVARCHAR(20), @AdminId INT;
  SELECT @ProductModerationId = ProductModerationId, @OldStatus = ModerationStatus
  FROM dbo.ProductModerations WHERE ProductCode = @ProductCode;
  SELECT @AdminId = AdminId FROM dbo.Administrators WHERE AdminCode = @AdminCode;
  IF @ProductModerationId IS NULL THROW 50011, N'Không tìm thấy sản phẩm.', 1;
  IF @NewStatus NOT IN (N'pending', N'approved', N'rejected') THROW 50012, N'Trạng thái kiểm duyệt không hợp lệ.', 1;
  IF @NewStatus = N'rejected' AND COALESCE(NULLIF(@ReviewNote, N''), N'0') = N'0'
    THROW 50013, N'Từ chối sản phẩm cần có lý do.', 1;

  UPDATE dbo.ProductModerations
  SET ModerationStatus = @NewStatus,
      ReviewNote = COALESCE(NULLIF(@ReviewNote, N''), N'0'),
      ReviewedByAdminId = CASE WHEN @NewStatus = N'pending' THEN NULL ELSE @AdminId END,
      ReviewedAt = CASE WHEN @NewStatus = N'pending' THEN NULL ELSE SYSUTCDATETIME() END
  WHERE ProductModerationId = @ProductModerationId;

  INSERT INTO dbo.ProductModerationHistory (ProductModerationId, OldStatus, NewStatus, ReviewNote, ChangedByAdminId)
  VALUES (@ProductModerationId, @OldStatus, @NewStatus, COALESCE(NULLIF(@ReviewNote, N''), N'0'), @AdminId);
END;
GO
