/*
  DANH MỤC QUÁN ĂN (CÀI ĐẶT SELLER)
  Đây là danh mục chuyên môn chính của MỖI QUÁN, không phải danh mục từng món.
  Mỗi Restaurant chỉ chọn 01 danh mục chính; MenuItems vẫn có Category riêng
  trong seller/sample-product-management.sql.
*/

IF OBJECT_ID(N'dbo.RestaurantCategories', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.RestaurantCategories (
    RestaurantCategoryId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CategoryCode NVARCHAR(40) NOT NULL UNIQUE,
    CategoryName NVARCHAR(120) NOT NULL UNIQUE,
    Description NVARCHAR(500) NOT NULL CONSTRAINT DF_RestaurantCategories_Description DEFAULT N'0',
    IsActive BIT NOT NULL CONSTRAINT DF_RestaurantCategories_IsActive DEFAULT 1
  );
END;
GO

IF COL_LENGTH(N'dbo.Restaurants', N'PrimaryRestaurantCategoryId') IS NULL
BEGIN
  ALTER TABLE dbo.Restaurants ADD PrimaryRestaurantCategoryId INT NULL;
  ALTER TABLE dbo.Restaurants ADD CONSTRAINT FK_Restaurants_PrimaryRestaurantCategory
    FOREIGN KEY (PrimaryRestaurantCategoryId) REFERENCES dbo.RestaurantCategories(RestaurantCategoryId);
END;
GO

MERGE dbo.RestaurantCategories AS target
USING (VALUES
  (N'PHO_BUN', N'Phở / Bún', N'Quán chuyên các món phở, bún và món nước.'),
  (N'COM', N'Cơm', N'Quán chuyên cơm tấm, cơm niêu và cơm gia đình.'),
  (N'HU_TIEU_BANH_CANH', N'Hủ tiếu / Bánh canh', N'Quán chuyên hủ tiếu và bánh canh.'),
  (N'BANH_XEO_KHOT', N'Bánh xèo / Bánh khọt', N'Quán chuyên bánh xèo và bánh khọt.'),
  (N'MI', N'Mì', N'Quán chuyên mì tàu và mì vịt tiềm.'),
  (N'LAU', N'Lẩu', N'Quán chuyên lẩu mắm và lẩu dê.'),
  (N'BUN_DAU', N'Bún đậu mắm tôm', N'Quán chuyên bún đậu mắm tôm.'),
  (N'BANH_MI', N'Bánh mì', N'Quán chuyên bánh mì.'),
  (N'CHAO', N'Cháo', N'Quán chuyên cháo lòng và cháo đêm.'),
  (N'DO_NUONG', N'Đồ nướng', N'Quán chuyên bò lá lốt và món nướng.'),
  (N'MON_CHAY', N'Món chay', N'Quán chuyên món chay.'),
  (N'HAI_SAN', N'Hải sản', N'Quán chuyên ốc và hải sản bình dân.')
) AS source(CategoryCode, CategoryName, Description)
ON target.CategoryCode = source.CategoryCode
WHEN MATCHED THEN UPDATE SET CategoryName = source.CategoryName, Description = source.Description, IsActive = 1
WHEN NOT MATCHED THEN INSERT (CategoryCode, CategoryName, Description) VALUES (source.CategoryCode, source.CategoryName, source.Description);
GO

;WITH CategoryAssignments AS (
  SELECT * FROM (VALUES
    (N'BT-74101118-0001', N'PHO_BUN'), (N'Q1-77680091-0002', N'COM'),
    (N'Q3-78258472-0003', N'PHO_BUN'), (N'Q5-75436514-0004', N'HU_TIEU_BANH_CANH'),
    (N'Q7-73062145-0005', N'BANH_XEO_KHOT'), (N'Q10-77187025-0006', N'MI'),
    (N'Q11-76244781-0007', N'PHO_BUN'), (N'BTH-80760724-0008', N'LAU'),
    (N'GV-83867458-0009', N'HU_TIEU_BANH_CANH'), (N'TB-80105317-0010', N'COM'),
    (N'TPD-84925344-0011', N'BUN_DAU'), (N'Q4-75990463-0012', N'PHO_BUN'),
    (N'Q6-74653529-0013', N'BANH_MI'), (N'Q8-74178156-0014', N'PHO_BUN'),
    (N'Q12-86535502-0015', N'CHAO'), (N'BTN-76910043-0016', N'DO_NUONG'),
    (N'HM-88369384-0017', N'MON_CHAY'), (N'NB-69713269-0018', N'PHO_BUN'),
    (N'BC-69987631-0019', N'HAI_SAN'), (N'CC-97469317-0020', N'LAU')
  ) v(RestaurantCode, CategoryCode)
)
UPDATE r SET PrimaryRestaurantCategoryId = c.RestaurantCategoryId
FROM dbo.Restaurants r
INNER JOIN CategoryAssignments a ON a.RestaurantCode = r.RestaurantCode
INNER JOIN dbo.RestaurantCategories c ON c.CategoryCode = a.CategoryCode;
GO

CREATE OR ALTER VIEW dbo.vRestaurantCategoryManagement
AS
SELECT
  r.RestaurantCode,
  r.Name AS RestaurantName,
  s.SellerCode,
  s.FullName AS SellerName,
  COALESCE(c.CategoryCode, N'0') AS CategoryCode,
  COALESCE(c.CategoryName, N'0') AS CategoryName,
  COUNT(m.MenuItemId) AS MenuItemCount
FROM dbo.Restaurants r
INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId
LEFT JOIN dbo.RestaurantCategories c ON c.RestaurantCategoryId = r.PrimaryRestaurantCategoryId
LEFT JOIN dbo.MenuItems m ON m.RestaurantId = r.RestaurantId
GROUP BY r.RestaurantCode, r.Name, s.SellerCode, s.FullName, c.CategoryCode, c.CategoryName;
GO

CREATE OR ALTER PROCEDURE dbo.uspSellerSetRestaurantCategory
  @SellerCode NVARCHAR(30),
  @RestaurantCode NVARCHAR(40),
  @CategoryCode NVARCHAR(40)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE r SET PrimaryRestaurantCategoryId = c.RestaurantCategoryId
  FROM dbo.Restaurants r
  INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId
  INNER JOIN dbo.RestaurantCategories c ON c.CategoryCode = @CategoryCode AND c.IsActive = 1
  WHERE r.RestaurantCode = @RestaurantCode AND s.SellerCode = @SellerCode;
  IF @@ROWCOUNT = 0 THROW 50031, N'Không tìm thấy quán thuộc Seller hoặc danh mục không hợp lệ.', 1;
END;
GO
