/* BỔ SUNG QUẢN LÝ SẢN PHẨM SELLER – chạy sau sample-restaurants.sql */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* Món đơn: danh mục, trạng thái, tồn kho, hình ảnh và thùng rác. */
IF COL_LENGTH('dbo.MenuItems', 'Category') IS NULL
  ALTER TABLE dbo.MenuItems ADD Category NVARCHAR(100) NOT NULL CONSTRAINT DF_MenuItems_Category DEFAULT N'Khác';
IF COL_LENGTH('dbo.MenuItems', 'ProductStatus') IS NULL
  ALTER TABLE dbo.MenuItems ADD ProductStatus NVARCHAR(30) NOT NULL CONSTRAINT DF_MenuItems_Status DEFAULT N'active';
IF COL_LENGTH('dbo.MenuItems', 'StockQuantity') IS NULL
  ALTER TABLE dbo.MenuItems ADD StockQuantity INT NOT NULL CONSTRAINT DF_MenuItems_Stock DEFAULT 0;
IF COL_LENGTH('dbo.MenuItems', 'ImageUrl') IS NULL
  ALTER TABLE dbo.MenuItems ADD ImageUrl NVARCHAR(1000) NULL;
IF COL_LENGTH('dbo.MenuItems', 'DeletedAt') IS NULL
  ALTER TABLE dbo.MenuItems ADD DeletedAt DATETIME2 NULL;

/* Combo có cùng trường để Seller lọc theo một giao diện thống nhất. */
IF COL_LENGTH('dbo.Combos', 'Category') IS NULL
  ALTER TABLE dbo.Combos ADD Category NVARCHAR(100) NOT NULL CONSTRAINT DF_Combos_Category DEFAULT N'Khác';
IF COL_LENGTH('dbo.Combos', 'ProductStatus') IS NULL
  ALTER TABLE dbo.Combos ADD ProductStatus NVARCHAR(30) NOT NULL CONSTRAINT DF_Combos_Status DEFAULT N'active';
IF COL_LENGTH('dbo.Combos', 'StockQuantity') IS NULL
  ALTER TABLE dbo.Combos ADD StockQuantity INT NOT NULL CONSTRAINT DF_Combos_Stock DEFAULT 0;
IF COL_LENGTH('dbo.Combos', 'ImageUrl') IS NULL
  ALTER TABLE dbo.Combos ADD ImageUrl NVARCHAR(1000) NULL;
IF COL_LENGTH('dbo.Combos', 'DeletedAt') IS NULL
  ALTER TABLE dbo.Combos ADD DeletedAt DATETIME2 NULL;

GO

/* Topping tách bảng riêng; giá/tồn kho không có dữ liệu thì là 0. */
IF OBJECT_ID(N'dbo.ProductToppings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ProductToppings (
    ProductToppingId INT IDENTITY(1,1) PRIMARY KEY,
    MenuItemId INT NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    ExtraPrice DECIMAL(18,0) NOT NULL DEFAULT 0,
    StockQuantity INT NOT NULL DEFAULT 0,
    IsAvailable BIT NOT NULL DEFAULT 1,
    SortOrder INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_ProductToppings_MenuItems FOREIGN KEY (MenuItemId) REFERENCES dbo.MenuItems(MenuItemId)
  );
END;

/* Dữ liệu topping từ cột JSON đã có trong sample-restaurants.sql. */
INSERT INTO dbo.ProductToppings (MenuItemId, Name, ExtraPrice, StockQuantity, IsAvailable, SortOrder)
SELECT m.MenuItemId, topping.[value], 0, 0, 1, topping.[key]
FROM dbo.MenuItems m
CROSS APPLY OPENJSON(m.ToppingsJson) topping
WHERE NOT EXISTS (
  SELECT 1 FROM dbo.ProductToppings pt WHERE pt.MenuItemId = m.MenuItemId AND pt.Name = topping.[value]
);

/* Gán danh mục mẫu. ProductStatus: active=Đang bán, out_of_stock=Hết hàng, hidden=Đã ẩn. */
UPDATE dbo.MenuItems
SET Category = CASE
  WHEN Name LIKE N'%Cơm%' THEN N'Cơm'
  WHEN Name LIKE N'%Phở%' OR Name LIKE N'%Bún%' OR Name LIKE N'%Hủ Tiếu%' THEN N'Bún/Phở'
  WHEN Name LIKE N'%Bánh%' THEN N'Ăn vặt'
  ELSE N'Khác'
END,
StockQuantity = CASE WHEN StockQuantity IS NULL THEN 0 ELSE StockQuantity END,
ProductStatus = CASE WHEN IsAvailable = 0 THEN N'out_of_stock' ELSE N'active' END;

UPDATE dbo.Combos
SET Category = N'Khác', StockQuantity = CASE WHEN StockQuantity IS NULL THEN 0 ELSE StockQuantity END,
    ProductStatus = N'active';

GO
CREATE OR ALTER VIEW dbo.vSellerProducts AS
SELECT r.SellerId, r.RestaurantId, m.MenuItemCode AS ProductCode, m.Name AS ProductName,
       m.Category, N'single' AS ProductType, m.Price, m.ProductStatus, m.StockQuantity, m.ImageUrl, m.DeletedAt
FROM dbo.MenuItems m JOIN dbo.Restaurants r ON r.RestaurantId = m.RestaurantId
UNION ALL
SELECT r.SellerId, r.RestaurantId, c.ComboCode AS ProductCode, c.Name AS ProductName,
       c.Category, N'combo' AS ProductType, c.Price, c.ProductStatus, c.StockQuantity, c.ImageUrl, c.DeletedAt
FROM dbo.Combos c JOIN dbo.Restaurants r ON r.RestaurantId = c.RestaurantId;
GO

COMMIT TRANSACTION;
