/* WEDBANDOAN – SQL SERVER (TỰ CHỨA TRONG MỘT FILE) */
USE [WEDBANDOAN];
GO
/* MODULE: frontend\database\sql-server\seller\sample-restaurants.sql */
/* DỮ LIỆU MẪU SQL SERVER: 20 SELLER – 20 QUÁN */

SET XACT_ABORT ON;

BEGIN TRANSACTION;



IF OBJECT_ID(N'dbo.Sellers', N'U') IS NULL BEGIN CREATE TABLE dbo.Sellers (SellerId INT IDENTITY(1,1) PRIMARY KEY, SellerCode NVARCHAR(30) NOT NULL UNIQUE, RegionCode NVARCHAR(10) NOT NULL, FullName NVARCHAR(150) NOT NULL, Email NVARCHAR(255) NOT NULL UNIQUE, Phone NVARCHAR(20) NOT NULL); END;



IF OBJECT_ID(N'dbo.Restaurants', N'U') IS NULL BEGIN CREATE TABLE dbo.Restaurants (RestaurantId INT IDENTITY(1,1) PRIMARY KEY, RestaurantCode NVARCHAR(40) NOT NULL UNIQUE, SellerId INT NOT NULL, RegionCode NVARCHAR(10) NOT NULL, Latitude DECIMAL(9,5) NOT NULL, Longitude DECIMAL(9,5) NOT NULL, Name NVARCHAR(200) NOT NULL, Phone NVARCHAR(20) NULL, Email NVARCHAR(255) NULL, Address NVARCHAR(500) NULL, Description NVARCHAR(1000) NULL, CONSTRAINT FK_Restaurants_Sellers FOREIGN KEY (SellerId) REFERENCES dbo.Sellers(SellerId)); END;



IF OBJECT_ID(N'dbo.MenuItems', N'U') IS NULL BEGIN CREATE TABLE dbo.MenuItems (MenuItemId INT IDENTITY(1,1) PRIMARY KEY, MenuItemCode NVARCHAR(60) NOT NULL UNIQUE, RestaurantId INT NOT NULL, Name NVARCHAR(200) NOT NULL, Description NVARCHAR(1000) NULL, Price DECIMAL(18,0) NOT NULL DEFAULT 0, ToppingsJson NVARCHAR(MAX) NOT NULL DEFAULT N'[]', IsAvailable BIT NOT NULL DEFAULT 1, CONSTRAINT FK_MenuItems_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId)); END;



IF OBJECT_ID(N'dbo.Combos', N'U') IS NULL BEGIN CREATE TABLE dbo.Combos (ComboId INT IDENTITY(1,1) PRIMARY KEY, ComboCode NVARCHAR(60) NOT NULL UNIQUE, RestaurantId INT NOT NULL, Name NVARCHAR(200) NOT NULL, Description NVARCHAR(1000) NULL, Price DECIMAL(18,0) NOT NULL DEFAULT 0, CONSTRAINT FK_Combos_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId)); END;



-- 20 seller mẫu

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-BT-0001') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-BT-0001', N'BT', N'Nguyễn Văn Nam', N'seller@example.com', N'0912000001');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q1-0002') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q1-0002', N'Q1', N'Trần Minh Hùng', N'seller02@example.com', N'0912000002');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q3-0003') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q3-0003', N'Q3', N'Lê Thị Lan', N'seller03@example.com', N'0912000003');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q5-0004') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q5-0004', N'Q5', N'Phạm Quốc Bảo', N'seller04@example.com', N'0912000004');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q7-0005') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q7-0005', N'Q7', N'Hoàng Thu Trang', N'seller05@example.com', N'0912000005');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q10-0006') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q10-0006', N'Q10', N'Võ Minh Đức', N'seller06@example.com', N'0912000006');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q11-0007') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q11-0007', N'Q11', N'Đặng Ngọc Anh', N'seller07@example.com', N'0912000007');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-BTH-0008') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-BTH-0008', N'BTH', N'Bùi Thành Long', N'seller08@example.com', N'0912000008');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-GV-0009') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-GV-0009', N'GV', N'Đỗ Kim Oanh', N'seller09@example.com', N'0912000009');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-TB-0010') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-TB-0010', N'TB', N'Ngô Quốc Khánh', N'seller10@example.com', N'0912000010');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-TPD-0011') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-TPD-0011', N'TPD', N'Dương Mỹ Linh', N'seller11@example.com', N'0912000011');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q4-0012') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q4-0012', N'Q4', N'Lý Thành Đạt', N'seller12@example.com', N'0912000012');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q6-0013') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q6-0013', N'Q6', N'Mai Phương Thảo', N'seller13@example.com', N'0912000013');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q8-0014') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q8-0014', N'Q8', N'Tạ Minh Châu', N'seller14@example.com', N'0912000014');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-Q12-0015') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-Q12-0015', N'Q12', N'Chu Quốc Việt', N'seller15@example.com', N'0912000015');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-BTN-0016') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-BTN-0016', N'BTN', N'Cao Thu Hà', N'seller16@example.com', N'0912000016');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-HM-0017') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-HM-0017', N'HM', N'Hồ Minh Tâm', N'seller17@example.com', N'0912000017');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-NB-0018') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-NB-0018', N'NB', N'La Anh Tú', N'seller18@example.com', N'0912000018');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-BC-0019') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-BC-0019', N'BC', N'Tôn Ngọc Mai', N'seller19@example.com', N'0912000019');

IF NOT EXISTS (SELECT 1 FROM dbo.Sellers WHERE SellerCode = N'SL-CC-0020') INSERT INTO dbo.Sellers (SellerCode, RegionCode, FullName, Email, Phone) VALUES (N'SL-CC-0020', N'CC', N'Quách Thành Sơn', N'seller20@example.com', N'0912000020');



-- 20 quán mẫu, mỗi quán thuộc một seller

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'BT-74101118-0001', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-BT-0001'), N'BT', 10.74103, 106.61118, N'Phở Gia Truyền', N'0902000001', N'quan01@amthucmau.vn', N'106/30/15 Đỗ Năng Tế, Phường An Lạc, Quận Bình Tân, TP. Hồ Chí Minh', N'Quán phở phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q1-77680091-0002', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q1-0002'), N'Q1', 10.77689, 106.70091, N'Cơm Tấm Sài Gòn', N'0902000002', N'quan02@amthucmau.vn', N'42 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', N'Quán cơm tấm phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q3-78258472-0003', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q3-0003'), N'Q3', 10.78256, 106.68472, N'Bún Bò Huế Cố Đô', N'0902000003', N'quan03@amthucmau.vn', N'118 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', N'Quán bún bò huế phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q5-75436514-0004', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q5-0004'), N'Q5', 10.75438, 106.66514, N'Hủ Tiếu Nam Vang Phát Tài', N'0902000004', N'quan04@amthucmau.vn', N'215 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh', N'Quán hủ tiếu nam vang phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q7-73062145-0005', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q7-0005'), N'Q7', 10.73062, 106.72145, N'Bánh Xèo – Bánh Khọt Miền Tây', N'0902000005', N'quan05@amthucmau.vn', N'68 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh', N'Quán bánh xèo, bánh khọt phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q10-77187025-0006', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q10-0006'), N'Q10', 10.77184, 106.67025, N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn', N'0902000006', N'quan06@amthucmau.vn', N'94 Thành Thái, Quận 10, TP. Hồ Chí Minh', N'Quán mì tàu, mì vịt tiềm phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q11-76244781-0007', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q11-0007'), N'Q11', 10.76243, 106.64781, N'Bún Chả Hà Nội', N'0902000007', N'quan07@amthucmau.vn', N'33 Lạc Long Quân, Quận 11, TP. Hồ Chí Minh', N'Quán bún chả phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'BTH-80760724-0008', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-BTH-0008'), N'BTH', 10.80762, 106.70724, N'Lẩu Mắm Miền Tây', N'0902000008', N'quan08@amthucmau.vn', N'201 Phan Văn Trị, Quận Bình Thạnh, TP. Hồ Chí Minh', N'Quán lẩu mắm phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'GV-83867458-0009', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-GV-0009'), N'GV', 10.83864, 106.67458, N'Bánh Canh Cua – Hủ Tiếu Cua', N'0902000009', N'quan09@amthucmau.vn', N'125 Quang Trung, Quận Gò Vấp, TP. Hồ Chí Minh', N'Quán món cua phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'TB-80105317-0010', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-TB-0010'), N'TB', 10.80105, 106.65317, N'Cơm Niêu Gia Đình', N'0902000010', N'quan10@amthucmau.vn', N'79 Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh', N'Quán cơm niêu, cơm gia đình phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'TPD-84925344-0011', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-TPD-0011'), N'TPD', 10.84921, 106.75344, N'Bún Đậu Mắm Tôm', N'0902000011', N'quan11@amthucmau.vn', N'16 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh', N'Quán bún đậu phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q4-75990463-0012', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q4-0012'), N'Q4', 10.75991, 106.70463, N'Bún Mắm Miền Tây', N'0902000012', N'quan12@amthucmau.vn', N'57 Hoàng Diệu, Quận 4, TP. Hồ Chí Minh', N'Quán bún mắm phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q6-74653529-0013', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q6-0013'), N'Q6', 10.74658, 106.63529, N'Bánh Mì Sài Gòn', N'0902000013', N'quan13@amthucmau.vn', N'212 Hậu Giang, Quận 6, TP. Hồ Chí Minh', N'Quán bánh mì phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q8-74178156-0014', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q8-0014'), N'Q8', 10.74177, 106.68156, N'Bún Mắm Nêm – Bún Thịt Nướng', N'0902000014', N'quan14@amthucmau.vn', N'98 Tạ Quang Bửu, Quận 8, TP. Hồ Chí Minh', N'Quán bún mắm nêm phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'Q12-86535502-0015', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-Q12-0015'), N'Q12', 10.86531, 106.65502, N'Cháo Lòng Đêm', N'0902000015', N'quan15@amthucmau.vn', N'45 Lê Văn Khương, Quận 12, TP. Hồ Chí Minh', N'Quán cháo lòng phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'BTN-76910043-0016', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-BTN-0016'), N'BTN', 10.76918, 106.60043, N'Bò Lá Lốt & Đồ Nướng', N'0902000016', N'quan16@amthucmau.vn', N'168 Tên Lửa, Quận Bình Tân, TP. Hồ Chí Minh', N'Quán món bò nướng phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'HM-88369384-0017', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-HM-0017'), N'HM', 10.88361, 106.59384, N'Vị Chay An Nhiên', N'0902000017', N'quan17@amthucmau.vn', N'71 Quốc lộ 22, Huyện Hóc Môn, TP. Hồ Chí Minh', N'Quán món chay phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'NB-69713269-0018', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-NB-0018'), N'NB', 10.69715, 106.73269, N'Bún Cá Kiên Giang – Nha Trang', N'0902000018', N'quan18@amthucmau.vn', N'22 Huỳnh Tấn Phát, Huyện Nhà Bè, TP. Hồ Chí Minh', N'Quán bún cá phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'BC-69987631-0019', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-BC-0019'), N'BC', 10.69983, 106.57631, N'Ốc & Hải Sản Bình Dân', N'0902000019', N'quan19@amthucmau.vn', N'93 Nguyễn Văn Linh, Huyện Bình Chánh, TP. Hồ Chí Minh', N'Quán ốc, hải sản phục vụ mỗi ngày.');

IF NOT EXISTS (SELECT 1 FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020') INSERT INTO dbo.Restaurants (RestaurantCode, SellerId, RegionCode, Latitude, Longitude, Name, Phone, Email, Address, Description) VALUES (N'CC-97469317-0020', (SELECT SellerId FROM dbo.Sellers WHERE SellerCode = N'SL-CC-0020'), N'CC', 10.97462, 106.49317, N'Lẩu Dê Núi', N'0902000020', N'quan20@amthucmau.vn', N'36 Tỉnh lộ 8, Huyện Củ Chi, TP. Hồ Chí Minh', N'Quán lẩu dê, món dê phục vụ mỗi ngày.');



-- 240 món mẫu

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Truyền thống', NULL, 35000, N'["Tái"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Thập cẩm', NULL, 40000, N'["Tái","Gầu"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Đầy đủ', NULL, 45000, N'["Tái","Gầu","Bò viên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Thêm trứng', NULL, 55000, N'["Tái"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Cỡ nhỏ', NULL, 60000, N'["Tái","Gầu"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Cỡ vừa', NULL, 65000, N'["Tái","Gầu","Bò viên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Cay nhẹ', NULL, 75000, N'["Tái"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Không cay', NULL, 80000, N'["Tái","Gầu"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BT-74101118-0001-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BT-74101118-0001-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BT-74101118-0001'), N'Phở Gia Truyền – Phần đặc biệt', NULL, 85000, N'["Tái","Gầu","Bò viên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Truyền thống', NULL, 35000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Thập cẩm', NULL, 40000, N'["Trứng ốp la","Bì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Đầy đủ', NULL, 45000, N'["Trứng ốp la","Bì","Chả"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Thêm trứng', NULL, 55000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Cỡ nhỏ', NULL, 60000, N'["Trứng ốp la","Bì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Cỡ vừa', NULL, 65000, N'["Trứng ốp la","Bì","Chả"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Cay nhẹ', NULL, 75000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Không cay', NULL, 80000, N'["Trứng ốp la","Bì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q1-77680091-0002-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q1-77680091-0002-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Cơm Tấm Sài Gòn – Phần đặc biệt', NULL, 85000, N'["Trứng ốp la","Bì","Chả"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Truyền thống', NULL, 35000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Thập cẩm', NULL, 40000, N'["Chả cua","Giò heo"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Đầy đủ', NULL, 45000, N'["Chả cua","Giò heo","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Thêm trứng', NULL, 55000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Cỡ nhỏ', NULL, 60000, N'["Chả cua","Giò heo"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Cỡ vừa', NULL, 65000, N'["Chả cua","Giò heo","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Cay nhẹ', NULL, 75000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Không cay', NULL, 80000, N'["Chả cua","Giò heo"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q3-78258472-0003-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q3-78258472-0003-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q3-78258472-0003'), N'Bún Bò Huế Cố Đô – Phần đặc biệt', NULL, 85000, N'["Chả cua","Giò heo","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Truyền thống', NULL, 35000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Thập cẩm', NULL, 40000, N'["Tôm","Thịt bằm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Đầy đủ', NULL, 45000, N'["Tôm","Thịt bằm","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Thêm trứng', NULL, 55000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Cỡ nhỏ', NULL, 60000, N'["Tôm","Thịt bằm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Cỡ vừa', NULL, 65000, N'["Tôm","Thịt bằm","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Cay nhẹ', NULL, 75000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Không cay', NULL, 80000, N'["Tôm","Thịt bằm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q5-75436514-0004-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q5-75436514-0004-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q5-75436514-0004'), N'Hủ Tiếu Nam Vang Phát Tài – Phần đặc biệt', NULL, 85000, N'["Tôm","Thịt bằm","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Truyền thống', NULL, 35000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Thập cẩm', NULL, 40000, N'["Tôm","Thịt vịt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Đầy đủ', NULL, 45000, N'["Tôm","Thịt vịt","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Thêm trứng', NULL, 55000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Cỡ nhỏ', NULL, 60000, N'["Tôm","Thịt vịt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Cỡ vừa', NULL, 65000, N'["Tôm","Thịt vịt","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Cay nhẹ', NULL, 75000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Không cay', NULL, 80000, N'["Tôm","Thịt vịt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q7-73062145-0005-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q7-73062145-0005-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Bánh Xèo – Bánh Khọt Miền Tây – Phần đặc biệt', NULL, 85000, N'["Tôm","Thịt vịt","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Truyền thống', NULL, 35000, N'["Vịt quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Thập cẩm', NULL, 40000, N'["Vịt quay","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Đầy đủ', NULL, 45000, N'["Vịt quay","Trứng","Cải xanh"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Thêm trứng', NULL, 55000, N'["Vịt quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Cỡ nhỏ', NULL, 60000, N'["Vịt quay","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Cỡ vừa', NULL, 65000, N'["Vịt quay","Trứng","Cải xanh"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Cay nhẹ', NULL, 75000, N'["Vịt quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Không cay', NULL, 80000, N'["Vịt quay","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q10-77187025-0006-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q10-77187025-0006-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q10-77187025-0006'), N'Mì Tàu – Mì Vịt Tiềm Chợ Lớn – Phần đặc biệt', NULL, 85000, N'["Vịt quay","Trứng","Cải xanh"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Truyền thống', NULL, 35000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Thập cẩm', NULL, 40000, N'["Chả cua","Nem rán"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Đầy đủ', NULL, 45000, N'["Chả cua","Nem rán","Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Thêm trứng', NULL, 55000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Cỡ nhỏ', NULL, 60000, N'["Chả cua","Nem rán"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Cỡ vừa', NULL, 65000, N'["Chả cua","Nem rán","Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Cay nhẹ', NULL, 75000, N'["Chả cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Không cay', NULL, 80000, N'["Chả cua","Nem rán"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q11-76244781-0007-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q11-76244781-0007-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q11-76244781-0007'), N'Bún Chả Hà Nội – Phần đặc biệt', NULL, 85000, N'["Chả cua","Nem rán","Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Truyền thống', NULL, 35000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Thập cẩm', NULL, 40000, N'["Tôm","Mực"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Đầy đủ', NULL, 45000, N'["Tôm","Mực","Rau nhút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Thêm trứng', NULL, 55000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Cỡ nhỏ', NULL, 60000, N'["Tôm","Mực"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Cỡ vừa', NULL, 65000, N'["Tôm","Mực","Rau nhút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Cay nhẹ', NULL, 75000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Không cay', NULL, 80000, N'["Tôm","Mực"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTH-80760724-0008-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTH-80760724-0008-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Lẩu Mắm Miền Tây – Phần đặc biệt', NULL, 85000, N'["Tôm","Mực","Rau nhút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Truyền thống', NULL, 35000, N'["Thịt cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Thập cẩm', NULL, 40000, N'["Thịt cua","Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Đầy đủ', NULL, 45000, N'["Thịt cua","Chả cá","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Thêm trứng', NULL, 55000, N'["Thịt cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Cỡ nhỏ', NULL, 60000, N'["Thịt cua","Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Cỡ vừa', NULL, 65000, N'["Thịt cua","Chả cá","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Cay nhẹ', NULL, 75000, N'["Thịt cua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Không cay', NULL, 80000, N'["Thịt cua","Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'GV-83867458-0009-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'GV-83867458-0009-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'GV-83867458-0009'), N'Bánh Canh Cua – Hủ Tiếu Cua – Phần đặc biệt', NULL, 85000, N'["Thịt cua","Chả cá","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Truyền thống', NULL, 35000, N'["Trứng chiên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Thập cẩm', NULL, 40000, N'["Trứng chiên","Canh chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Đầy đủ', NULL, 45000, N'["Trứng chiên","Canh chua","Rau xào"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Thêm trứng', NULL, 55000, N'["Trứng chiên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Cỡ nhỏ', NULL, 60000, N'["Trứng chiên","Canh chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Cỡ vừa', NULL, 65000, N'["Trứng chiên","Canh chua","Rau xào"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Cay nhẹ', NULL, 75000, N'["Trứng chiên"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Không cay', NULL, 80000, N'["Trứng chiên","Canh chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TB-80105317-0010-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TB-80105317-0010-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Cơm Niêu Gia Đình – Phần đặc biệt', NULL, 85000, N'["Trứng chiên","Canh chua","Rau xào"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Truyền thống', NULL, 35000, N'["Chả cốm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Thập cẩm', NULL, 40000, N'["Chả cốm","Nem chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Đầy đủ', NULL, 45000, N'["Chả cốm","Nem chua","Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Thêm trứng', NULL, 55000, N'["Chả cốm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Cỡ nhỏ', NULL, 60000, N'["Chả cốm","Nem chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Cỡ vừa', NULL, 65000, N'["Chả cốm","Nem chua","Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Cay nhẹ', NULL, 75000, N'["Chả cốm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Không cay', NULL, 80000, N'["Chả cốm","Nem chua"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'TPD-84925344-0011-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'TPD-84925344-0011-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Bún Đậu Mắm Tôm – Phần đặc biệt', NULL, 85000, N'["Chả cốm","Nem chua","Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Truyền thống', NULL, 35000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Thập cẩm', NULL, 40000, N'["Tôm","Cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Đầy đủ', NULL, 45000, N'["Tôm","Cá","Heo quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Thêm trứng', NULL, 55000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Cỡ nhỏ', NULL, 60000, N'["Tôm","Cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Cỡ vừa', NULL, 65000, N'["Tôm","Cá","Heo quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Cay nhẹ', NULL, 75000, N'["Tôm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Không cay', NULL, 80000, N'["Tôm","Cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q4-75990463-0012-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q4-75990463-0012-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q4-75990463-0012'), N'Bún Mắm Miền Tây – Phần đặc biệt', NULL, 85000, N'["Tôm","Cá","Heo quay"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Truyền thống', NULL, 35000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Thập cẩm', NULL, 40000, N'["Trứng ốp la","Xúc xích"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Đầy đủ', NULL, 45000, N'["Trứng ốp la","Xúc xích","Phô mai"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Thêm trứng', NULL, 55000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Cỡ nhỏ', NULL, 60000, N'["Trứng ốp la","Xúc xích"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Cỡ vừa', NULL, 65000, N'["Trứng ốp la","Xúc xích","Phô mai"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Cay nhẹ', NULL, 75000, N'["Trứng ốp la"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Không cay', NULL, 80000, N'["Trứng ốp la","Xúc xích"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q6-74653529-0013-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q6-74653529-0013-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q6-74653529-0013'), N'Bánh Mì Sài Gòn – Phần đặc biệt', NULL, 85000, N'["Trứng ốp la","Xúc xích","Phô mai"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Truyền thống', NULL, 35000, N'["Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Thập cẩm', NULL, 40000, N'["Thịt nướng","Chả giò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Đầy đủ', NULL, 45000, N'["Thịt nướng","Chả giò","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Thêm trứng', NULL, 55000, N'["Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Cỡ nhỏ', NULL, 60000, N'["Thịt nướng","Chả giò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Cỡ vừa', NULL, 65000, N'["Thịt nướng","Chả giò","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Cay nhẹ', NULL, 75000, N'["Thịt nướng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Không cay', NULL, 80000, N'["Thịt nướng","Chả giò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q8-74178156-0014-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q8-74178156-0014-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q8-74178156-0014'), N'Bún Mắm Nêm – Bún Thịt Nướng – Phần đặc biệt', NULL, 85000, N'["Thịt nướng","Chả giò","Trứng"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Truyền thống', NULL, 35000, N'["Lòng non"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Thập cẩm', NULL, 40000, N'["Lòng non","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Đầy đủ', NULL, 45000, N'["Lòng non","Huyết","Quẩy"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Thêm trứng', NULL, 55000, N'["Lòng non"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Cỡ nhỏ', NULL, 60000, N'["Lòng non","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Cỡ vừa', NULL, 65000, N'["Lòng non","Huyết","Quẩy"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Cay nhẹ', NULL, 75000, N'["Lòng non"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Không cay', NULL, 80000, N'["Lòng non","Huyết"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'Q12-86535502-0015-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'Q12-86535502-0015-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q12-86535502-0015'), N'Cháo Lòng Đêm – Phần đặc biệt', NULL, 85000, N'["Lòng non","Huyết","Quẩy"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Truyền thống', NULL, 35000, N'["Bò lá lốt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Thập cẩm', NULL, 40000, N'["Bò lá lốt","Ba chỉ bò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Đầy đủ', NULL, 45000, N'["Bò lá lốt","Ba chỉ bò","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Thêm trứng', NULL, 55000, N'["Bò lá lốt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Cỡ nhỏ', NULL, 60000, N'["Bò lá lốt","Ba chỉ bò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Cỡ vừa', NULL, 65000, N'["Bò lá lốt","Ba chỉ bò","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Cay nhẹ', NULL, 75000, N'["Bò lá lốt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Không cay', NULL, 80000, N'["Bò lá lốt","Ba chỉ bò"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BTN-76910043-0016-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BTN-76910043-0016-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Bò Lá Lốt & Đồ Nướng – Phần đặc biệt', NULL, 85000, N'["Bò lá lốt","Ba chỉ bò","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Truyền thống', NULL, 35000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Thập cẩm', NULL, 40000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Đầy đủ', NULL, 45000, N'["Đậu hũ","Nấm","Rau củ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Thêm trứng', NULL, 55000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Cỡ nhỏ', NULL, 60000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Cỡ vừa', NULL, 65000, N'["Đậu hũ","Nấm","Rau củ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Cay nhẹ', NULL, 75000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Không cay', NULL, 80000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'HM-88369384-0017-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'HM-88369384-0017-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'HM-88369384-0017'), N'Vị Chay An Nhiên – Phần đặc biệt', NULL, 85000, N'["Đậu hũ","Nấm","Rau củ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Truyền thống', NULL, 35000, N'["Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Thập cẩm', NULL, 40000, N'["Chả cá","Rau sống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Đầy đủ', NULL, 45000, N'["Chả cá","Rau sống","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Thêm trứng', NULL, 55000, N'["Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Cỡ nhỏ', NULL, 60000, N'["Chả cá","Rau sống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Cỡ vừa', NULL, 65000, N'["Chả cá","Rau sống","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Cay nhẹ', NULL, 75000, N'["Chả cá"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Không cay', NULL, 80000, N'["Chả cá","Rau sống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'NB-69713269-0018-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'NB-69713269-0018-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'NB-69713269-0018'), N'Bún Cá Kiên Giang – Nha Trang – Phần đặc biệt', NULL, 85000, N'["Chả cá","Rau sống","Trứng cút"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Truyền thống', NULL, 35000, N'["Rau muống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Thập cẩm', NULL, 40000, N'["Rau muống","Bánh mì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Đầy đủ', NULL, 45000, N'["Rau muống","Bánh mì","Muối ớt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Thêm trứng', NULL, 55000, N'["Rau muống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Cỡ nhỏ', NULL, 60000, N'["Rau muống","Bánh mì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Cỡ vừa', NULL, 65000, N'["Rau muống","Bánh mì","Muối ớt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Cay nhẹ', NULL, 75000, N'["Rau muống"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Không cay', NULL, 80000, N'["Rau muống","Bánh mì"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'BC-69987631-0019-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'BC-69987631-0019-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Ốc & Hải Sản Bình Dân – Phần đặc biệt', NULL, 85000, N'["Rau muống","Bánh mì","Muối ớt"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M01') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Đặc biệt', NULL, 30000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M02') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Truyền thống', NULL, 35000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M03') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Thập cẩm', NULL, 40000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M04') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M04', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Đầy đủ', NULL, 45000, N'["Đậu hũ","Nấm","Mì gói"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M05') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M05', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Thêm thịt', NULL, 50000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M06') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M06', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Thêm trứng', NULL, 55000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M07') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M07', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Cỡ nhỏ', NULL, 60000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M08') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M08', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Cỡ vừa', NULL, 65000, N'["Đậu hũ","Nấm","Mì gói"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M09') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M09', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Cỡ lớn', NULL, 70000, N'[]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M10') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M10', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Cay nhẹ', NULL, 75000, N'["Đậu hũ"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M11') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M11', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Không cay', NULL, 80000, N'["Đậu hũ","Nấm"]', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.MenuItems WHERE MenuItemCode = N'CC-97469317-0020-M12') INSERT INTO dbo.MenuItems (MenuItemCode, RestaurantId, Name, Description, Price, ToppingsJson, IsAvailable) VALUES (N'CC-97469317-0020-M12', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Lẩu Dê Núi – Phần đặc biệt', NULL, 85000, N'["Đậu hũ","Nấm","Mì gói"]', 1);



-- 24 combo mẫu

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q1-77680091-0002-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q1-77680091-0002-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Combo 1 – Cơm Tấm Sài Gòn', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q1-77680091-0002-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q1-77680091-0002-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Combo 2 – Cơm Tấm Sài Gòn', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q1-77680091-0002-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q1-77680091-0002-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), N'Combo 3 – Cơm Tấm Sài Gòn', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q7-73062145-0005-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q7-73062145-0005-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Combo 1 – Bánh Xèo – Bánh Khọt Miền Tây', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q7-73062145-0005-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q7-73062145-0005-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Combo 2 – Bánh Xèo – Bánh Khọt Miền Tây', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'Q7-73062145-0005-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'Q7-73062145-0005-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q7-73062145-0005'), N'Combo 3 – Bánh Xèo – Bánh Khọt Miền Tây', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTH-80760724-0008-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTH-80760724-0008-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Combo 1 – Lẩu Mắm Miền Tây', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTH-80760724-0008-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTH-80760724-0008-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Combo 2 – Lẩu Mắm Miền Tây', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTH-80760724-0008-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTH-80760724-0008-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTH-80760724-0008'), N'Combo 3 – Lẩu Mắm Miền Tây', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TB-80105317-0010-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TB-80105317-0010-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Combo 1 – Cơm Niêu Gia Đình', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TB-80105317-0010-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TB-80105317-0010-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Combo 2 – Cơm Niêu Gia Đình', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TB-80105317-0010-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TB-80105317-0010-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TB-80105317-0010'), N'Combo 3 – Cơm Niêu Gia Đình', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TPD-84925344-0011-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TPD-84925344-0011-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Combo 1 – Bún Đậu Mắm Tôm', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TPD-84925344-0011-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TPD-84925344-0011-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Combo 2 – Bún Đậu Mắm Tôm', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'TPD-84925344-0011-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'TPD-84925344-0011-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'TPD-84925344-0011'), N'Combo 3 – Bún Đậu Mắm Tôm', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTN-76910043-0016-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTN-76910043-0016-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Combo 1 – Bò Lá Lốt & Đồ Nướng', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTN-76910043-0016-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTN-76910043-0016-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Combo 2 – Bò Lá Lốt & Đồ Nướng', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BTN-76910043-0016-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BTN-76910043-0016-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BTN-76910043-0016'), N'Combo 3 – Bò Lá Lốt & Đồ Nướng', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BC-69987631-0019-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BC-69987631-0019-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Combo 1 – Ốc & Hải Sản Bình Dân', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BC-69987631-0019-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BC-69987631-0019-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Combo 2 – Ốc & Hải Sản Bình Dân', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'BC-69987631-0019-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'BC-69987631-0019-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'BC-69987631-0019'), N'Combo 3 – Ốc & Hải Sản Bình Dân', N'Món chính kèm món phụ và nước uống.', 119000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'CC-97469317-0020-C01') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'CC-97469317-0020-C01', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Combo 1 – Lẩu Dê Núi', N'Món chính kèm món phụ và nước uống.', 79000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'CC-97469317-0020-C02') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'CC-97469317-0020-C02', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Combo 2 – Lẩu Dê Núi', N'Món chính kèm món phụ và nước uống.', 99000);

IF NOT EXISTS (SELECT 1 FROM dbo.Combos WHERE ComboCode = N'CC-97469317-0020-C03') INSERT INTO dbo.Combos (ComboCode, RestaurantId, Name, Description, Price) VALUES (N'CC-97469317-0020-C03', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'CC-97469317-0020'), N'Combo 3 – Lẩu Dê Núi', N'Món chính kèm món phụ và nước uống.', 119000);



COMMIT TRANSACTION;

/* MODULE: frontend\database\sql-server\seller\sample-shop-info.sql */
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


/* MODULE: frontend\database\sql-server\seller\sample-restaurant-categories.sql */
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


/* MODULE: frontend\database\sql-server\seller\sample-product-management.sql */
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


/* MODULE: frontend\database\sql-server\orders\sample-orders.sql */
/* DỮ LIỆU ĐƠN HÀNG MẪU – SQL SERVER */

SET XACT_ABORT ON;

BEGIN TRANSACTION;



IF OBJECT_ID(N'dbo.Shippers', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Shippers (
    ShipperId INT IDENTITY(1,1) PRIMARY KEY,
    ShipperCode NVARCHAR(30) NOT NULL UNIQUE,
    RegionCode NVARCHAR(10) NOT NULL,
    FullName NVARCHAR(150) NOT NULL, Email NVARCHAR(255) NOT NULL UNIQUE, Phone NVARCHAR(20) NOT NULL,
    PermanentAddress NVARCHAR(500) NULL, DeliveryVehicle NVARCHAR(150) NULL, LicensePlate NVARCHAR(30) NULL,
    CitizenId NVARCHAR(30) NULL, DriverLicense NVARCHAR(50) NULL, VehicleRegistration NVARCHAR(50) NULL
  );
END;



IF OBJECT_ID(N'dbo.Customers', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL, Phone NVARCHAR(20) NOT NULL UNIQUE
  );
END;



IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY, OrderCode NVARCHAR(30) NOT NULL UNIQUE,
    RestaurantId INT NOT NULL, CustomerId INT NOT NULL, ShipperId INT NULL, ShipperCodeSnapshot NVARCHAR(30) NOT NULL DEFAULT N'0',
    Status NVARCHAR(30) NOT NULL, PaymentMethod NVARCHAR(50) NOT NULL,
    DeliveryAddress NVARCHAR(500) NOT NULL, CustomerNote NVARCHAR(1000) NOT NULL DEFAULT N'0',
    TotalAmount DECIMAL(18,0) NOT NULL DEFAULT 0, OrderedAt DATETIME2 NOT NULL,
    CONSTRAINT FK_Orders_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_Orders_Shippers FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId)
  );
END;



IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY, OrderId INT NOT NULL,
    ProductNameSnapshot NVARCHAR(200) NOT NULL, UnitPrice DECIMAL(18,0) NOT NULL DEFAULT 0, Quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;



-- 20 shipper mẫu

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q1-0001')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q1-0001', N'Q1', N'Nguyễn Minh Quân', N'shipper01@example.com', N'0933000001', N'Quận 1, TP. Hồ Chí Minh', N'Xe máy Honda Wave', N'59X1-0000', N'000000000001', N'A1-SAMPLE-01', N'CVX-SAMPLE-01');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q3-0002')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q3-0002', N'Q3', N'Trần Quốc Huy', N'shipper02@example.com', N'0933000002', N'Quận 3, TP. Hồ Chí Minh', N'Xe máy Yamaha Sirius', N'59X1-0001', N'000000000002', N'A1-SAMPLE-02', N'CVX-SAMPLE-02');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q5-0003')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q5-0003', N'Q5', N'Lê Hoàng Nam', N'shipper03@example.com', N'0933000003', N'Quận 5, TP. Hồ Chí Minh', N'Xe máy Honda Vision', N'59X1-0002', N'000000000003', N'A1-SAMPLE-03', N'CVX-SAMPLE-03');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q7-0004')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q7-0004', N'Q7', N'Phạm Đức Anh', N'shipper04@example.com', N'0933000004', N'Quận 7, TP. Hồ Chí Minh', N'Xe máy Honda Air Blade', N'59X1-0003', N'000000000004', N'A1-SAMPLE-04', N'CVX-SAMPLE-04');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q10-0005')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q10-0005', N'Q10', N'Hoàng Gia Bảo', N'shipper05@example.com', N'0933000005', N'Quận 10, TP. Hồ Chí Minh', N'Xe máy Yamaha Janus', N'59X1-0004', N'000000000005', N'A1-SAMPLE-05', N'CVX-SAMPLE-05');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q11-0006')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q11-0006', N'Q11', N'Võ Thành Đạt', N'shipper06@example.com', N'0933000006', N'Quận 11, TP. Hồ Chí Minh', N'Xe máy Honda Future', N'59X1-0005', N'000000000006', N'A1-SAMPLE-06', N'CVX-SAMPLE-06');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-BTH-0007')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-BTH-0007', N'BTH', N'Đặng Nhật Minh', N'shipper07@example.com', N'0933000007', N'Quận Bình Thạnh, TP. Hồ Chí Minh', N'Xe máy Suzuki Raider', N'59X1-0006', N'000000000007', N'A1-SAMPLE-07', N'CVX-SAMPLE-07');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-GV-0008')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-GV-0008', N'GV', N'Bùi Quang Vinh', N'shipper08@example.com', N'0933000008', N'Quận Gò Vấp, TP. Hồ Chí Minh', N'Xe máy Honda Blade', N'59X1-0007', N'000000000008', N'A1-SAMPLE-08', N'CVX-SAMPLE-08');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-TB-0009')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-TB-0009', N'TB', N'Đỗ Trung Kiên', N'shipper09@example.com', N'0933000009', N'Quận Tân Bình, TP. Hồ Chí Minh', N'Xe máy Yamaha Exciter', N'59X1-0008', N'000000000009', N'A1-SAMPLE-09', N'CVX-SAMPLE-09');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-TPD-0010')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-TPD-0010', N'TPD', N'Ngô Phúc Long', N'shipper10@example.com', N'0933000010', N'Quận Tân Phú, TP. Hồ Chí Minh', N'Xe máy Honda Lead', N'59X1-0009', N'000000000010', N'A1-SAMPLE-10', N'CVX-SAMPLE-10');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q4-0011')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q4-0011', N'Q4', N'Dương Thành Công', N'shipper11@example.com', N'0933000011', N'TP. Thủ Đức, TP. Hồ Chí Minh', N'Xe máy Honda SH Mode', N'59X1-0010', N'000000000011', N'A1-SAMPLE-11', N'CVX-SAMPLE-11');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q6-0012')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q6-0012', N'Q6', N'Lý Minh Tài', N'shipper12@example.com', N'0933000012', N'Quận 4, TP. Hồ Chí Minh', N'Xe máy Yamaha FreeGo', N'59X1-0011', N'000000000012', N'A1-SAMPLE-12', N'CVX-SAMPLE-12');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q8-0013')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q8-0013', N'Q8', N'Mai Quốc Việt', N'shipper13@example.com', N'0933000013', N'Quận 6, TP. Hồ Chí Minh', N'Xe máy Honda Winner X', N'59X1-0012', N'000000000013', N'A1-SAMPLE-13', N'CVX-SAMPLE-13');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-Q12-0014')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-Q12-0014', N'Q12', N'Tạ Hữu Phát', N'shipper14@example.com', N'0933000014', N'Quận 8, TP. Hồ Chí Minh', N'Xe máy Honda Wave Alpha', N'59X1-0013', N'000000000014', N'A1-SAMPLE-14', N'CVX-SAMPLE-14');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-HM-0015')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-HM-0015', N'HM', N'Chu Văn Khải', N'shipper15@example.com', N'0933000015', N'Quận 12, TP. Hồ Chí Minh', N'Xe máy Yamaha Grande', N'59X1-0014', N'000000000015', N'A1-SAMPLE-15', N'CVX-SAMPLE-15');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-BT-0016')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-BT-0016', N'BT', N'Cao Đức Thịnh', N'shipper16@example.com', N'0933000016', N'Quận Bình Tân, TP. Hồ Chí Minh', N'Xe máy Honda Vario', N'59X1-0015', N'000000000016', N'A1-SAMPLE-16', N'CVX-SAMPLE-16');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-HM-0017')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-HM-0017', N'HM', N'Hồ Anh Tuấn', N'shipper17@example.com', N'0933000017', N'Huyện Hóc Môn, TP. Hồ Chí Minh', N'Xe máy Suzuki Burgman', N'59X1-0016', N'000000000017', N'A1-SAMPLE-17', N'CVX-SAMPLE-17');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-NB-0018')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-NB-0018', N'NB', N'La Minh Khoa', N'shipper18@example.com', N'0933000018', N'Huyện Nhà Bè, TP. Hồ Chí Minh', N'Xe máy Honda PCX', N'59X1-0017', N'000000000018', N'A1-SAMPLE-18', N'CVX-SAMPLE-18');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-BC-0019')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-BC-0019', N'BC', N'Tôn Gia Hưng', N'shipper19@example.com', N'0933000019', N'Huyện Bình Chánh, TP. Hồ Chí Minh', N'Xe máy Yamaha NVX', N'59X1-0018', N'000000000019', N'A1-SAMPLE-19', N'CVX-SAMPLE-19');

IF NOT EXISTS (SELECT 1 FROM dbo.Shippers WHERE ShipperCode = N'SP-CC-0020')
  INSERT INTO dbo.Shippers (ShipperCode, RegionCode, FullName, Email, Phone, PermanentAddress, DeliveryVehicle, LicensePlate, CitizenId, DriverLicense, VehicleRegistration)
  VALUES (N'SP-CC-0020', N'CC', N'Quách Thanh Sơn', N'shipper20@example.com', N'0933000020', N'Huyện Củ Chi, TP. Hồ Chí Minh', N'Xe máy Honda Winner', N'59X1-0019', N'000000000020', N'A1-SAMPLE-20', N'CVX-SAMPLE-20');



-- 13 đơn hàng mẫu của quán Cơm Tấm Sài Gòn

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0901234567')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Nguyễn Văn An', N'0901234567');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260001')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260001', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0901234567'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q1-0001'), N'SP-Q1-0001', N'pending', N'COD', N'123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', N'Không hành, thêm nhiều tương ớt', 110000, N'2026-07-13T20:55:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260001' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260001'), N'Cơm Sườn Nướng', 35000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260001' AND oi.ProductNameSnapshot = N'Chả Giò Tôm Cua')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260001'), N'Chả Giò Tôm Cua', 25000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0912345678')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Trần Thị Bích', N'0912345678');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260002')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260002', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0912345678'), NULL, N'0', N'pending', N'MoMo', N'456 Lê Lợi, Quận 3, TP. Hồ Chí Minh', N'0', 75000, N'2026-07-13T20:40:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260002' AND oi.ProductNameSnapshot = N'Cơm Gà Xối Mỡ')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260002'), N'Cơm Gà Xối Mỡ', 40000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260002' AND oi.ProductNameSnapshot = N'Canh Chua Cá Lóc')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260002'), N'Canh Chua Cá Lóc', 30000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0987654321')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Lê Minh Tuấn', N'0987654321');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260003')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260003', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0987654321'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q10-0004'), N'SP-Q10-0004', N'preparing', N'Chuyển khoản', N'789 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh', N'0', 90000, N'2026-07-13T19:30:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260003' AND oi.ProductNameSnapshot = N'Cơm Chiên Hải Sản')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260003'), N'Cơm Chiên Hải Sản', 45000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0905667788')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Phạm Ngọc Mai', N'0905667788');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260004')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260004', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0905667788'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q1-0001'), N'SP-Q1-0001', N'shipping', N'COD', N'12 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh', N'0', 105000, N'2026-07-13T18:15:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260004' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260004'), N'Cơm Sườn Nướng', 35000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260004' AND oi.ProductNameSnapshot = N'Nước ngọt')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260004'), N'Nước ngọt', 15000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0901122334')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Vũ Đức Hải', N'0901122334');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260005')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260005', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0901122334'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q3-0002'), N'SP-Q3-0002', N'completed', N'MoMo', N'88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', N'0', 145000, N'2026-07-13T11:00:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260005' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260005'), N'Cơm Sườn Nướng', 35000, 3);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260005' AND oi.ProductNameSnapshot = N'Canh Chua Cá Lóc')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260005'), N'Canh Chua Cá Lóc', 30000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0933666555')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Hoàng Thu Hà', N'0933666555');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791207260001')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791207260001', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0933666555'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-BTH-0007'), N'SP-BTH-0007', N'returned', N'COD', N'56 Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh', N'Shipper giao nhầm, nhận được cơm chiên thay vì cơm gà', 55000, N'2026-07-12T14:30:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791207260001' AND oi.ProductNameSnapshot = N'Cơm Gà Xối Mỡ')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791207260001'), N'Cơm Gà Xối Mỡ', 40000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0981112222')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Nguyễn Minh Nhật', N'0981112222');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'011307260006')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'011307260006', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0981112222'), NULL, N'0', N'pending', N'MoMo', N'125 Thái Hà, Đống Đa, Hà Nội', N'0', 130000, N'2026-07-13T21:05:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'011307260006' AND oi.ProductNameSnapshot = N'Phở Bò Tái Nạm')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'011307260006'), N'Phở Bò Tái Nạm', 55000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0977888999')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Lý Hải', N'0977888999');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260007')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260007', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0977888999'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-TPD-0010'), N'SP-TPD-0010', N'preparing', N'Chuyển khoản', N'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh', N'0', 140000, N'2026-07-13T20:10:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260007' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260007'), N'Cơm Sườn Nướng', 35000, 4);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0966444555')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Đỗ Bảo', N'0966444555');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'621307260001')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'621307260001', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0966444555'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q11-0006'), N'SP-Q11-0006', N'shipping', N'COD', N'Biên Hòa, Đồng Nai', N'0', 105000, N'2026-07-13T19:45:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'621307260001' AND oi.ProductNameSnapshot = N'Bún Bò Huế')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'621307260001'), N'Bún Bò Huế', 50000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'621307260001' AND oi.ProductNameSnapshot = N'Chả giò')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'621307260001'), N'Chả giò', 25000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0922112233')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Trương Minh Châu', N'0922112233');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'751307260002')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'751307260002', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0922112233'), NULL, N'0', N'pending', N'MoMo', N'Quận 7, TP. Hồ Chí Minh', N'0', 80000, N'2026-07-13T21:15:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'751307260002' AND oi.ProductNameSnapshot = N'Bún Bò Huế')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'751307260002'), N'Bún Bò Huế', 50000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0908777888')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Dương Thanh Loan', N'0908777888');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'741307260003')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'741307260003', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0908777888'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-BTH-0007'), N'SP-BTH-0007', N'completed', N'Chuyển khoản', N'Quận Bình Thạnh, TP. Hồ Chí Minh', N'0', 155000, N'2026-07-13T12:20:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'741307260003' AND oi.ProductNameSnapshot = N'Cơm Gà Xối Mỡ')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'741307260003'), N'Cơm Gà Xối Mỡ', 40000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'741307260003' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'741307260003'), N'Cơm Sườn Nướng', 35000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0988777999')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Cao Thắng', N'0988777999');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260008')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260008', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0988777999'), (SELECT ShipperId FROM dbo.Shippers WHERE ShipperCode = N'SP-Q7-0004'), N'SP-Q7-0004', N'cancelled', N'COD', N'Quận 7, TP. Hồ Chí Minh', N'Giao trễ quá nên khách hủy', 95000, N'2026-07-13T10:05:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260008' AND oi.ProductNameSnapshot = N'Cơm Gà Xối Mỡ')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260008'), N'Cơm Gà Xối Mỡ', 40000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Phone = N'0909090909')
  INSERT INTO dbo.Customers (FullName, Phone) VALUES (N'Nguyễn Thị Lớn', N'0909090909');

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderCode = N'791307260009')
  INSERT INTO dbo.Orders (OrderCode, RestaurantId, CustomerId, ShipperId, ShipperCodeSnapshot, Status, PaymentMethod, DeliveryAddress, CustomerNote, TotalAmount, OrderedAt)
  VALUES (N'791307260009', (SELECT RestaurantId FROM dbo.Restaurants WHERE RestaurantCode = N'Q1-77680091-0002'), (SELECT CustomerId FROM dbo.Customers WHERE Phone = N'0909090909'), NULL, N'0', N'pending', N'MoMo', N'Quận 1, TP. Hồ Chí Minh', N'Cho nhiều nước mắm', 230000, N'2026-07-13T22:00:00');

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260009' AND oi.ProductNameSnapshot = N'Cơm Sườn Nướng')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260009'), N'Cơm Sườn Nướng', 35000, 2);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260009' AND oi.ProductNameSnapshot = N'Cơm Gà Xối Mỡ')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260009'), N'Cơm Gà Xối Mỡ', 40000, 1);

IF NOT EXISTS (SELECT 1 FROM dbo.OrderItems oi JOIN dbo.Orders o ON o.OrderId = oi.OrderId WHERE o.OrderCode = N'791307260009' AND oi.ProductNameSnapshot = N'Canh Chua Cá Lóc')
  INSERT INTO dbo.OrderItems (OrderId, ProductNameSnapshot, UnitPrice, Quantity) VALUES ((SELECT OrderId FROM dbo.Orders WHERE OrderCode = N'791307260009'), N'Canh Chua Cá Lóc', 30000, 1);



COMMIT TRANSACTION;

/* MODULE: frontend\database\sql-server\orders\sample-delivery-details.sql */
/* BỔ SUNG THÔNG TIN GIAO HÀNG MẪU – chạy sau sample-orders.sql */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF COL_LENGTH('dbo.Orders', 'ShippingFee') IS NULL
  ALTER TABLE dbo.Orders ADD ShippingFee DECIMAL(18,0) NOT NULL CONSTRAINT DF_Orders_ShippingFee DEFAULT 0;

IF COL_LENGTH('dbo.Orders', 'CodAmount') IS NULL
  ALTER TABLE dbo.Orders ADD CodAmount DECIMAL(18,0) NOT NULL CONSTRAINT DF_Orders_CodAmount DEFAULT 0;

IF COL_LENGTH('dbo.Orders', 'DistanceKm') IS NULL
  ALTER TABLE dbo.Orders ADD DistanceKm DECIMAL(6,2) NOT NULL CONSTRAINT DF_Orders_DistanceKm DEFAULT 0;

IF COL_LENGTH('dbo.Orders', 'PackageWeightKg') IS NULL
  ALTER TABLE dbo.Orders ADD PackageWeightKg DECIMAL(6,2) NOT NULL CONSTRAINT DF_Orders_PackageWeightKg DEFAULT 0;

/* Số 0 = thông tin chưa được phân shipper hoặc chưa tính được. */
UPDATE dbo.Orders SET ShippingFee = 25000, CodAmount = 105000, DistanceKm = 3.20, PackageWeightKg = 1.00 WHERE OrderCode = N'791307260001';
UPDATE dbo.Orders SET ShippingFee = 0, CodAmount = 0, DistanceKm = 0, PackageWeightKg = 0 WHERE OrderCode = N'791307260002';
UPDATE dbo.Orders SET ShippingFee = 22000, CodAmount = 0, DistanceKm = 2.80, PackageWeightKg = 0.80 WHERE OrderCode = N'791307260003';
UPDATE dbo.Orders SET ShippingFee = 25000, CodAmount = 105000, DistanceKm = 3.60, PackageWeightKg = 1.20 WHERE OrderCode = N'791307260004';
UPDATE dbo.Orders SET ShippingFee = 20000, CodAmount = 0, DistanceKm = 2.10, PackageWeightKg = 1.30 WHERE OrderCode = N'791307260005';
UPDATE dbo.Orders SET ShippingFee = 15000, CodAmount = 55000, DistanceKm = 1.80, PackageWeightKg = 0.60 WHERE OrderCode = N'791207260001';
UPDATE dbo.Orders SET ShippingFee = 0, CodAmount = 0, DistanceKm = 0, PackageWeightKg = 0 WHERE OrderCode = N'011307260006';
UPDATE dbo.Orders SET ShippingFee = 25000, CodAmount = 0, DistanceKm = 4.20, PackageWeightKg = 1.40 WHERE OrderCode = N'791307260007';
UPDATE dbo.Orders SET ShippingFee = 25000, CodAmount = 105000, DistanceKm = 5.40, PackageWeightKg = 0.90 WHERE OrderCode = N'621307260001';
UPDATE dbo.Orders SET ShippingFee = 0, CodAmount = 0, DistanceKm = 0, PackageWeightKg = 0 WHERE OrderCode = N'751307260002';
UPDATE dbo.Orders SET ShippingFee = 20000, CodAmount = 0, DistanceKm = 2.60, PackageWeightKg = 1.50 WHERE OrderCode = N'741307260003';
UPDATE dbo.Orders SET ShippingFee = 18000, CodAmount = 95000, DistanceKm = 3.10, PackageWeightKg = 0.70 WHERE OrderCode = N'791307260008';
UPDATE dbo.Orders SET ShippingFee = 0, CodAmount = 0, DistanceKm = 0, PackageWeightKg = 0 WHERE OrderCode = N'791307260009';

COMMIT TRANSACTION;


/* MODULE: frontend\database\sql-server\seller\sample-order-analytics.sql */
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


/* MODULE: frontend\database\sql-server\seller\sample-finance.sql */
/* BÁO CÁO TÀI CHÍNH SELLER – chạy sau các file trong orders/ */
IF OBJECT_ID(N'dbo.SellerTransactions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.SellerTransactions (
    TransactionId INT IDENTITY(1,1) PRIMARY KEY,
    TransactionCode NVARCHAR(40) NOT NULL UNIQUE,
    SellerId INT NOT NULL,
    RestaurantId INT NOT NULL,
    TransactionType NVARCHAR(20) NOT NULL, /* income | expense */
    Amount DECIMAL(18,0) NOT NULL DEFAULT 0,
    Description NVARCHAR(1000) NOT NULL DEFAULT N'0',
    TransactionStatus NVARCHAR(30) NOT NULL DEFAULT N'pending', /* pending | completed | failed */
    OccurredAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_SellerTransactions_Sellers FOREIGN KEY (SellerId) REFERENCES dbo.Sellers(SellerId),
    CONSTRAINT FK_SellerTransactions_Restaurants FOREIGN KEY (RestaurantId) REFERENCES dbo.Restaurants(RestaurantId),
    CONSTRAINT CK_SellerTransactions_Type CHECK (TransactionType IN (N'income', N'expense')),
    CONSTRAINT CK_SellerTransactions_Amount CHECK (Amount >= 0)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vSellerFinanceSummary AS
SELECT
  r.SellerId,
  r.RestaurantId,
  r.RestaurantCode,
  COALESCE(SUM(CASE WHEN t.TransactionType = N'income' AND t.TransactionStatus = N'completed' THEN t.Amount ELSE 0 END), 0) AS TotalRevenue,
  COALESCE(SUM(CASE WHEN t.TransactionType = N'expense' AND t.TransactionStatus = N'completed' THEN t.Amount ELSE 0 END), 0) AS TotalExpense,
  COALESCE(SUM(CASE
    WHEN t.TransactionType = N'income' AND t.TransactionStatus = N'completed' THEN t.Amount
    WHEN t.TransactionType = N'expense' AND t.TransactionStatus = N'completed' THEN -t.Amount
    ELSE 0
  END), 0) AS Profit
FROM dbo.Restaurants r
LEFT JOIN dbo.SellerTransactions t ON t.RestaurantId = r.RestaurantId
GROUP BY r.SellerId, r.RestaurantId, r.RestaurantCode;
GO

CREATE OR ALTER VIEW dbo.vSellerDailyFinance AS
SELECT
  r.SellerId,
  r.RestaurantId,
  CAST(COALESCE(t.OccurredAt, '19000101') AS DATE) AS TransactionDate,
  COALESCE(SUM(CASE WHEN t.TransactionType = N'income' AND t.TransactionStatus = N'completed' THEN t.Amount ELSE 0 END), 0) AS Revenue,
  COALESCE(SUM(CASE WHEN t.TransactionType = N'expense' AND t.TransactionStatus = N'completed' THEN t.Amount ELSE 0 END), 0) AS Expense
FROM dbo.Restaurants r
LEFT JOIN dbo.SellerTransactions t ON t.RestaurantId = r.RestaurantId
GROUP BY r.SellerId, r.RestaurantId, CAST(COALESCE(t.OccurredAt, '19000101') AS DATE);
GO

/* Chưa thêm giao dịch mẫu: quán chưa có giao dịch thì view trả doanh thu, chi phí và lợi nhuận bằng 0. */


/* MODULE: frontend\database\sql-server\seller\sample-promotions.sql */
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


/* MODULE: frontend\database\sql-server\seller\sample-messages.sql */
/* TIN NHẮN SELLER – chạy sau các file trong orders/ */
IF OBJECT_ID(N'dbo.Conversations', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Conversations (
    ConversationId INT IDENTITY(1,1) PRIMARY KEY,
    SellerId INT NOT NULL,
    CustomerId INT NULL,
    ShipperId INT NULL,
    OrderId INT NULL,
    ParticipantType NVARCHAR(20) NOT NULL, /* customer | shipper */
    ConversationStatus NVARCHAR(20) NOT NULL DEFAULT N'active',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    LastMessageAt DATETIME2 NULL,
    CONSTRAINT FK_Conversations_Sellers FOREIGN KEY (SellerId) REFERENCES dbo.Sellers(SellerId),
    CONSTRAINT FK_Conversations_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_Conversations_Shippers FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId),
    CONSTRAINT FK_Conversations_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId),
    CONSTRAINT CK_Conversations_Participant CHECK (
      (ParticipantType = N'customer' AND CustomerId IS NOT NULL AND ShipperId IS NULL) OR
      (ParticipantType = N'shipper' AND ShipperId IS NOT NULL AND CustomerId IS NULL)
    )
  );
END;
GO

IF OBJECT_ID(N'dbo.Messages', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Messages (
    MessageId INT IDENTITY(1,1) PRIMARY KEY,
    ConversationId INT NOT NULL,
    SenderType NVARCHAR(20) NOT NULL, /* seller | customer | shipper | system */
    Content NVARCHAR(MAX) NOT NULL DEFAULT N'0',
    MessageType NVARCHAR(20) NOT NULL DEFAULT N'text', /* text | image | file | system */
    IsRead BIT NOT NULL DEFAULT 0,
    SentAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2 NULL,
    CONSTRAINT FK_Messages_Conversations FOREIGN KEY (ConversationId) REFERENCES dbo.Conversations(ConversationId)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vSellerMessageSummary AS
SELECT
  s.SellerId,
  s.SellerCode,
  COALESCE(SUM(CASE WHEN c.ParticipantType = N'customer' THEN 1 ELSE 0 END), 0) AS CustomerConversationCount,
  COALESCE(SUM(CASE WHEN c.ParticipantType = N'shipper' THEN 1 ELSE 0 END), 0) AS ShipperConversationCount,
  COALESCE(SUM(CASE WHEN m.IsRead = 0 AND m.SenderType <> N'seller' THEN 1 ELSE 0 END), 0) AS UnreadMessageCount
FROM dbo.Sellers s
LEFT JOIN dbo.Conversations c ON c.SellerId = s.SellerId AND c.ConversationStatus = N'active'
LEFT JOIN dbo.Messages m ON m.ConversationId = c.ConversationId AND m.DeletedAt IS NULL
GROUP BY s.SellerId, s.SellerCode;
GO

/* Chưa thêm hội thoại mẫu: CustomerConversationCount, ShipperConversationCount và UnreadMessageCount trả 0. */


/* MODULE: frontend\database\sql-server\seller\sample-settings.sql */
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


/* MODULE: frontend\database\sql-server\shipp\sample-order-pickup.sql */
/*
  SHIPPER – TRANG NHẬN ĐƠN
  Chạy sau orders/sample-orders.sql và orders/sample-delivery-details.sql.
  Dùng các đơn pending chưa có ShipperId trong dữ liệu đơn mẫu;
  không tạo thêm đơn mock. Giá trị giao hàng chưa có giữ 0.
*/

IF OBJECT_ID(N'dbo.ShipperWorkStates', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperWorkStates (
    ShipperId INT NOT NULL PRIMARY KEY,
    IsOnline BIT NOT NULL CONSTRAINT DF_ShipperWorkStates_IsOnline DEFAULT 0,
    LastLatitude DECIMAL(9,5) NOT NULL CONSTRAINT DF_ShipperWorkStates_LastLatitude DEFAULT 0,
    LastLongitude DECIMAL(9,5) NOT NULL CONSTRAINT DF_ShipperWorkStates_LastLongitude DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperWorkStates_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ShipperWorkStates_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId)
  );
END;
GO

INSERT INTO dbo.ShipperWorkStates (ShipperId, IsOnline, LastLatitude, LastLongitude)
SELECT s.ShipperId, 0, 0, 0
FROM dbo.Shippers s
WHERE NOT EXISTS (SELECT 1 FROM dbo.ShipperWorkStates ws WHERE ws.ShipperId = s.ShipperId);
GO

CREATE OR ALTER VIEW dbo.vShipperAvailableOrders
AS
SELECT
  o.OrderCode,
  r.RestaurantCode,
  r.Name AS RestaurantName,
  COALESCE(r.Address, N'0') AS PickupAddress,
  c.FullName AS RecipientName,
  c.Phone AS RecipientPhone,
  o.DeliveryAddress,
  COALESCE(items.ItemSummary, N'0') AS ItemSummary,
  COALESCE(items.TotalQuantity, 0) AS TotalItemQuantity,
  COALESCE(o.PackageWeightKg, 0) AS PackageWeightKg,
  COALESCE(o.ShippingFee, 0) AS ShippingFee,
  COALESCE(o.CodAmount, 0) AS CodAmount,
  COALESCE(o.DistanceKm, 0) AS DistanceKm,
  o.PaymentMethod,
  o.OrderedAt,
  N'pending_pickup' AS PickupStatus
FROM dbo.Orders o
INNER JOIN dbo.Restaurants r ON r.RestaurantId = o.RestaurantId
INNER JOIN dbo.Customers c ON c.CustomerId = o.CustomerId
OUTER APPLY (
  SELECT
    STRING_AGG(CONCAT(oi.ProductNameSnapshot, N' x', oi.Quantity), N', ') AS ItemSummary,
    SUM(oi.Quantity) AS TotalQuantity
  FROM dbo.OrderItems oi
  WHERE oi.OrderId = o.OrderId
) items
WHERE o.ShipperId IS NULL AND o.Status = N'pending';
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperSetWorkState
  @ShipperCode NVARCHAR(30),
  @IsOnline BIT,
  @Latitude DECIMAL(9,5) = 0,
  @Longitude DECIMAL(9,5) = 0
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE ws
  SET IsOnline = @IsOnline,
      LastLatitude = COALESCE(@Latitude, 0),
      LastLongitude = COALESCE(@Longitude, 0),
      UpdatedAt = SYSUTCDATETIME()
  FROM dbo.ShipperWorkStates ws
  INNER JOIN dbo.Shippers s ON s.ShipperId = ws.ShipperId
  WHERE s.ShipperCode = @ShipperCode;
  IF @@ROWCOUNT = 0 THROW 50041, N'Không tìm thấy shipper.', 1;
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperAcceptOrder
  @ShipperCode NVARCHAR(30),
  @OrderCode NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT;
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  IF @ShipperId IS NULL THROW 50042, N'Không tìm thấy shipper.', 1;

  UPDATE dbo.Orders
  SET ShipperId = @ShipperId,
      ShipperCodeSnapshot = @ShipperCode,
      Status = N'accepted'
  WHERE OrderCode = @OrderCode
    AND ShipperId IS NULL
    AND Status = N'pending';
  IF @@ROWCOUNT = 0 THROW 50043, N'Đơn không còn ở trạng thái chờ nhận hoặc đã có shipper khác nhận.', 1;
END;
GO


/* MODULE: frontend\database\sql-server\shipp\sample-delivery-history.sql */
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


/* MODULE: frontend\database\sql-server\shipp\sample-messages.sql */
/*
  SHIPPER – TIN NHẮN
  Chạy sau orders/sample-orders.sql.
  Không tạo tin nhắn mock: hội thoại, tin chưa đọc và tin cuối đều trả 0 khi chưa phát sinh.
*/

IF OBJECT_ID(N'dbo.ShipperConversations', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperConversations (
    ShipperConversationId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ShipperId INT NOT NULL,
    CustomerId INT NULL,
    SellerId INT NULL,
    OrderId INT NULL,
    ParticipantType NVARCHAR(20) NOT NULL,
    ConversationStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ShipperConversations_Status DEFAULT N'active',
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperConversations_CreatedAt DEFAULT SYSUTCDATETIME(),
    LastMessageAt DATETIME2 NULL,
    CONSTRAINT CK_ShipperConversations_Participant CHECK (
      (ParticipantType = N'customer' AND CustomerId IS NOT NULL AND SellerId IS NULL) OR
      (ParticipantType = N'seller' AND SellerId IS NOT NULL AND CustomerId IS NULL)
    ),
    CONSTRAINT FK_ShipperConversations_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId),
    CONSTRAINT FK_ShipperConversations_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId),
    CONSTRAINT FK_ShipperConversations_Seller FOREIGN KEY (SellerId) REFERENCES dbo.Sellers(SellerId),
    CONSTRAINT FK_ShipperConversations_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

IF OBJECT_ID(N'dbo.ShipperMessages', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperMessages (
    ShipperMessageId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ShipperConversationId BIGINT NOT NULL,
    SenderType NVARCHAR(20) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL CONSTRAINT DF_ShipperMessages_Content DEFAULT N'0',
    MessageType NVARCHAR(20) NOT NULL CONSTRAINT DF_ShipperMessages_Type DEFAULT N'text',
    IsRead BIT NOT NULL CONSTRAINT DF_ShipperMessages_IsRead DEFAULT 0,
    SentAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperMessages_SentAt DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2 NULL,
    CONSTRAINT CK_ShipperMessages_Sender CHECK (SenderType IN (N'shipper', N'customer', N'seller', N'system')),
    CONSTRAINT CK_ShipperMessages_Type CHECK (MessageType IN (N'text', N'image', N'file', N'system')),
    CONSTRAINT FK_ShipperMessages_Conversation FOREIGN KEY (ShipperConversationId)
      REFERENCES dbo.ShipperConversations(ShipperConversationId)
  );
END;
GO

CREATE OR ALTER VIEW dbo.vShipperMessageConversations
AS
SELECT
  sc.ShipperConversationId,
  sh.ShipperCode,
  sc.ParticipantType,
  o.OrderCode,
  CASE WHEN sc.ParticipantType = N'customer' THEN c.FullName ELSE s.FullName END AS ParticipantName,
  CASE WHEN sc.ParticipantType = N'customer' THEN c.Phone ELSE s.Phone END AS ParticipantPhone,
  COALESCE(lastMessage.Content, N'0') AS LastMessageContent,
  COALESCE(lastMessage.SentAt, sc.LastMessageAt, sc.CreatedAt) AS LastMessageAt,
  COALESCE(unread.UnreadCount, 0) AS UnreadCount
FROM dbo.ShipperConversations sc
INNER JOIN dbo.Shippers sh ON sh.ShipperId = sc.ShipperId
LEFT JOIN dbo.Customers c ON c.CustomerId = sc.CustomerId
LEFT JOIN dbo.Sellers s ON s.SellerId = sc.SellerId
LEFT JOIN dbo.Orders o ON o.OrderId = sc.OrderId
OUTER APPLY (
  SELECT TOP (1) sm.Content, sm.SentAt
  FROM dbo.ShipperMessages sm
  WHERE sm.ShipperConversationId = sc.ShipperConversationId AND sm.DeletedAt IS NULL
  ORDER BY sm.SentAt DESC, sm.ShipperMessageId DESC
) lastMessage
OUTER APPLY (
  SELECT COUNT(*) AS UnreadCount
  FROM dbo.ShipperMessages sm
  WHERE sm.ShipperConversationId = sc.ShipperConversationId
    AND sm.SenderType <> N'shipper' AND sm.IsRead = 0 AND sm.DeletedAt IS NULL
) unread
WHERE sc.ConversationStatus = N'active';
GO

CREATE OR ALTER VIEW dbo.vShipperMessageSummary
AS
SELECT
  sh.ShipperCode,
  COALESCE(SUM(CASE WHEN sc.ParticipantType = N'customer' THEN 1 ELSE 0 END), 0) AS CustomerConversationCount,
  COALESCE(SUM(CASE WHEN sc.ParticipantType = N'seller' THEN 1 ELSE 0 END), 0) AS SellerConversationCount,
  COALESCE(SUM(COALESCE(v.UnreadCount, 0)), 0) AS UnreadMessageCount
FROM dbo.Shippers sh
LEFT JOIN dbo.ShipperConversations sc ON sc.ShipperId = sh.ShipperId AND sc.ConversationStatus = N'active'
LEFT JOIN dbo.vShipperMessageConversations v ON v.ShipperConversationId = sc.ShipperConversationId
GROUP BY sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperSendMessage
  @ShipperCode NVARCHAR(30),
  @ShipperConversationId BIGINT,
  @Content NVARCHAR(MAX),
  @MessageType NVARCHAR(20) = N'text'
AS
BEGIN
  SET NOCOUNT ON;
  IF COALESCE(NULLIF(@Content, N''), N'') = N'' THROW 50061, N'Nội dung tin nhắn không được để trống.', 1;
  INSERT INTO dbo.ShipperMessages (ShipperConversationId, SenderType, Content, MessageType, IsRead)
  SELECT sc.ShipperConversationId, N'shipper', @Content, @MessageType, 1
  FROM dbo.ShipperConversations sc
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = sc.ShipperId
  WHERE sc.ShipperConversationId = @ShipperConversationId AND sh.ShipperCode = @ShipperCode;
  IF @@ROWCOUNT = 0 THROW 50062, N'Không tìm thấy hội thoại của shipper.', 1;
  UPDATE sc SET LastMessageAt = SYSUTCDATETIME()
  FROM dbo.ShipperConversations sc WHERE sc.ShipperConversationId = @ShipperConversationId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperMarkConversationRead
  @ShipperCode NVARCHAR(30),
  @ShipperConversationId BIGINT
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE sm SET IsRead = 1
  FROM dbo.ShipperMessages sm
  INNER JOIN dbo.ShipperConversations sc ON sc.ShipperConversationId = sm.ShipperConversationId
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = sc.ShipperId
  WHERE sm.ShipperConversationId = @ShipperConversationId
    AND sh.ShipperCode = @ShipperCode
    AND sm.SenderType <> N'shipper';
END;
GO


/* MODULE: frontend\database\sql-server\shipp\sample-wallet.sql */
/*
  SHIPPER – VÍ CÁ NHÂN
  Chạy sau orders/sample-orders.sql và orders/sample-delivery-details.sql.
  Chỉ sinh phí ship/COD cho các đơn completed đã có, không dùng giao dịch mock.
*/

IF COL_LENGTH(N'dbo.Orders', N'DeliveredAt') IS NULL
  ALTER TABLE dbo.Orders ADD DeliveredAt DATETIME2 NULL;
GO

IF OBJECT_ID(N'dbo.ShipperWalletTransactions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperWalletTransactions (
    ShipperWalletTransactionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TransactionCode NVARCHAR(70) NOT NULL UNIQUE,
    ShipperId INT NOT NULL,
    OrderId INT NULL,
    TransactionType NVARCHAR(30) NOT NULL,
    Description NVARCHAR(500) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Description DEFAULT N'0',
    Amount DECIMAL(18,0) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Amount DEFAULT 0,
    TransactionStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ShipperWalletTransactions_Status DEFAULT N'completed',
    OccurredAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperWalletTransactions_OccurredAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_ShipperWalletTransactions_Type CHECK (TransactionType IN (N'shipping_fee', N'cod_collected', N'cod_remitted', N'withdrawal', N'adjustment')),
    CONSTRAINT CK_ShipperWalletTransactions_Status CHECK (TransactionStatus IN (N'pending', N'completed', N'cancelled')),
    CONSTRAINT FK_ShipperWalletTransactions_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId),
    CONSTRAINT FK_ShipperWalletTransactions_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

/* Phí ship là thu nhập của shipper. */
INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'FEE-', o.OrderCode), o.ShipperId, o.OrderId, N'shipping_fee',
       CONCAT(N'Phí ship đơn ', o.OrderCode), COALESCE(o.ShippingFee, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed'
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'FEE-', o.OrderCode));
GO

/* COD là tiền thu hộ: thu vào rồi chuyển cho quán, hai dòng triệt tiêu nhau trong số dư. */
INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'COD-IN-', o.OrderCode), o.ShipperId, o.OrderId, N'cod_collected',
       CONCAT(N'Đã thu COD đơn ', o.OrderCode), COALESCE(o.CodAmount, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed' AND COALESCE(o.CodAmount, 0) > 0
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'COD-IN-', o.OrderCode));
GO

INSERT INTO dbo.ShipperWalletTransactions
  (TransactionCode, ShipperId, OrderId, TransactionType, Description, Amount, TransactionStatus, OccurredAt)
SELECT CONCAT(N'COD-OUT-', o.OrderCode), o.ShipperId, o.OrderId, N'cod_remitted',
       CONCAT(N'Đã hoàn COD về quán - đơn ', o.OrderCode), -COALESCE(o.CodAmount, 0), N'completed', COALESCE(o.DeliveredAt, o.OrderedAt)
FROM dbo.Orders o
WHERE o.ShipperId IS NOT NULL AND o.Status = N'completed' AND COALESCE(o.CodAmount, 0) > 0
  AND NOT EXISTS (SELECT 1 FROM dbo.ShipperWalletTransactions wt WHERE wt.TransactionCode = CONCAT(N'COD-OUT-', o.OrderCode));
GO

CREATE OR ALTER VIEW dbo.vShipperWalletTransactions
AS
SELECT
  sh.ShipperCode,
  wt.TransactionCode,
  o.OrderCode,
  wt.TransactionType,
  CASE wt.TransactionType
    WHEN N'shipping_fee' THEN N'Phí ship'
    WHEN N'cod_collected' THEN N'Thu COD'
    WHEN N'cod_remitted' THEN N'Chuyển COD'
    WHEN N'withdrawal' THEN N'Rút tiền'
    ELSE N'Điều chỉnh'
  END AS TransactionTypeName,
  wt.Description,
  wt.Amount,
  wt.TransactionStatus,
  wt.OccurredAt
FROM dbo.ShipperWalletTransactions wt
INNER JOIN dbo.Shippers sh ON sh.ShipperId = wt.ShipperId
LEFT JOIN dbo.Orders o ON o.OrderId = wt.OrderId;
GO

CREATE OR ALTER VIEW dbo.vShipperWalletSummary
AS
SELECT
  sh.ShipperCode,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed'
                      OR (wt.TransactionType = N'withdrawal' AND wt.TransactionStatus = N'pending')
                    THEN wt.Amount ELSE 0 END), 0) AS AvailableBalance,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed' AND wt.TransactionType = N'shipping_fee' THEN wt.Amount ELSE 0 END), 0) AS TotalShippingFee,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'completed' AND wt.TransactionType IN (N'cod_collected', N'cod_remitted') THEN wt.Amount ELSE 0 END), 0) AS CodHoldingAmount,
  COALESCE(SUM(CASE WHEN wt.TransactionStatus = N'pending' THEN wt.Amount ELSE 0 END), 0) AS PendingAmount
FROM dbo.Shippers sh
LEFT JOIN dbo.ShipperWalletTransactions wt ON wt.ShipperId = sh.ShipperId
GROUP BY sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperRequestWithdrawal
  @ShipperCode NVARCHAR(30),
  @Amount DECIMAL(18,0)
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @ShipperId INT, @AvailableBalance DECIMAL(18,0);
  SELECT @ShipperId = ShipperId FROM dbo.Shippers WHERE ShipperCode = @ShipperCode;
  SELECT @AvailableBalance = AvailableBalance FROM dbo.vShipperWalletSummary WHERE ShipperCode = @ShipperCode;
  IF @ShipperId IS NULL THROW 50071, N'Không tìm thấy shipper.', 1;
  IF @Amount <= 0 OR @Amount > COALESCE(@AvailableBalance, 0) THROW 50072, N'Số tiền rút không hợp lệ hoặc vượt số dư khả dụng.', 1;
  INSERT INTO dbo.ShipperWalletTransactions
    (TransactionCode, ShipperId, TransactionType, Description, Amount, TransactionStatus)
  VALUES
    (CONCAT(N'WD-', @ShipperCode, N'-', FORMAT(SYSUTCDATETIME(), N'yyyyMMddHHmmss')), @ShipperId,
     N'withdrawal', N'Rút tiền về tài khoản', -@Amount, N'pending');
END;
GO


/* MODULE: frontend\database\sql-server\shipp\sample-activity-report.sql */
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


/* MODULE: frontend\database\sql-server\shipp\sample-sent-ratings.sql */
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


/* MODULE: frontend\database\sql-server\shipp\sample-profile.sql */
/*
  SHIPPER – TRANG CÁ NHÂN
  Chạy sau orders/sample-orders.sql và shipp/sample-activity-report.sql.
  Thông tin định danh/phương tiện có sẵn trong Shippers; cài đặt chưa có trả 0.
*/

IF OBJECT_ID(N'dbo.ShipperProfileSettings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ShipperProfileSettings (
    ShipperId INT NOT NULL PRIMARY KEY,
    AvatarUrl NVARCHAR(1000) NOT NULL CONSTRAINT DF_ShipperProfileSettings_Avatar DEFAULT N'0',
    VehicleRegistrationDate DATE NULL,
    VehicleVerificationStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_ShipperProfileSettings_Verification DEFAULT N'0',
    OrderNotificationEnabled BIT NOT NULL CONSTRAINT DF_ShipperProfileSettings_OrderNotification DEFAULT 0,
    MessageNotificationEnabled BIT NOT NULL CONSTRAINT DF_ShipperProfileSettings_MessageNotification DEFAULT 0,
    TwoFactorEnabled BIT NOT NULL CONSTRAINT DF_ShipperProfileSettings_TwoFactor DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_ShipperProfileSettings_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_ShipperProfileSettings_Verification CHECK (VehicleVerificationStatus IN (N'0', N'pending', N'verified', N'rejected')),
    CONSTRAINT FK_ShipperProfileSettings_Shipper FOREIGN KEY (ShipperId) REFERENCES dbo.Shippers(ShipperId)
  );
END;
GO

INSERT INTO dbo.ShipperProfileSettings (ShipperId)
SELECT s.ShipperId
FROM dbo.Shippers s
WHERE NOT EXISTS (SELECT 1 FROM dbo.ShipperProfileSettings p WHERE p.ShipperId = s.ShipperId);
GO

CREATE OR ALTER VIEW dbo.vShipperProfile
AS
SELECT
  sh.ShipperCode,
  sh.FullName,
  sh.Email,
  sh.Phone,
  sh.PermanentAddress,
  sh.DeliveryVehicle,
  sh.LicensePlate,
  sh.CitizenId,
  sh.DriverLicense,
  sh.VehicleRegistration,
  p.AvatarUrl,
  COALESCE(CONVERT(NVARCHAR(10), p.VehicleRegistrationDate, 23), N'0') AS VehicleRegistrationDate,
  p.VehicleVerificationStatus,
  p.OrderNotificationEnabled,
  p.MessageNotificationEnabled,
  p.TwoFactorEnabled,
  COALESCE(a.TotalOrderCount, 0) AS TotalOrderCount,
  COALESCE(a.SuccessRatePercent, 0) AS SuccessRatePercent,
  CAST(0 AS DECIMAL(3,2)) AS AverageReceivedRating,
  CAST(0 AS INT) AS ReceivedRatingCount
FROM dbo.Shippers sh
LEFT JOIN dbo.ShipperProfileSettings p ON p.ShipperId = sh.ShipperId
LEFT JOIN dbo.vShipperActivityReport a ON a.ShipperCode = sh.ShipperCode;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperUpdateProfile
  @ShipperCode NVARCHAR(30),
  @Phone NVARCHAR(20),
  @PermanentAddress NVARCHAR(500),
  @DeliveryVehicle NVARCHAR(150),
  @LicensePlate NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE dbo.Shippers
  SET Phone = @Phone,
      PermanentAddress = @PermanentAddress,
      DeliveryVehicle = @DeliveryVehicle,
      LicensePlate = @LicensePlate
  WHERE ShipperCode = @ShipperCode;
  IF @@ROWCOUNT = 0 THROW 50101, N'Không tìm thấy shipper.', 1;
END;
GO

CREATE OR ALTER PROCEDURE dbo.uspShipperUpdateProfileSettings
  @ShipperCode NVARCHAR(30),
  @OrderNotificationEnabled BIT = 0,
  @MessageNotificationEnabled BIT = 0,
  @TwoFactorEnabled BIT = 0
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE p
  SET OrderNotificationEnabled = @OrderNotificationEnabled,
      MessageNotificationEnabled = @MessageNotificationEnabled,
      TwoFactorEnabled = @TwoFactorEnabled,
      UpdatedAt = SYSUTCDATETIME()
  FROM dbo.ShipperProfileSettings p
  INNER JOIN dbo.Shippers sh ON sh.ShipperId = p.ShipperId
  WHERE sh.ShipperCode = @ShipperCode;
  IF @@ROWCOUNT = 0 THROW 50102, N'Không tìm thấy shipper.', 1;
END;
GO


/* MODULE: frontend\database\sql-server\admin\sample-admin.sql */
/*
  DỮ LIỆU MẪU ADMIN
  - Có đúng 01 tài khoản quản trị.
  - Các chỉ số Tổng quan chưa có dữ liệu đều mặc định là 0.
  - PasswordHash là nơi lưu mật khẩu đã băm khi làm backend thật;
    giá trị N'0' trong script này chỉ là dữ liệu mẫu, không dùng để đăng nhập thật.
*/

IF OBJECT_ID(N'dbo.Administrators', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Administrators (
    AdminId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AdminCode NVARCHAR(20) NOT NULL UNIQUE,
    FullName NVARCHAR(120) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL CONSTRAINT DF_Administrators_Phone DEFAULT N'0',
    PasswordHash NVARCHAR(255) NOT NULL CONSTRAINT DF_Administrators_PasswordHash DEFAULT N'0',
    AccountStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_Administrators_Status DEFAULT N'active',
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Administrators_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_Administrators_Status CHECK (AccountStatus IN (N'active', N'blocked'))
  );
END;
GO

IF OBJECT_ID(N'dbo.AdminDashboardSnapshots', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AdminDashboardSnapshots (
    AdminDashboardSnapshotId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AdminId INT NOT NULL UNIQUE,
    TotalRevenue DECIMAL(18,2) NOT NULL CONSTRAINT DF_AdminDashboard_TotalRevenue DEFAULT 0,
    TotalOrders INT NOT NULL CONSTRAINT DF_AdminDashboard_TotalOrders DEFAULT 0,
    NewUsers INT NOT NULL CONSTRAINT DF_AdminDashboard_NewUsers DEFAULT 0,
    RevenueGrowthPercent DECIMAL(7,2) NOT NULL CONSTRAINT DF_AdminDashboard_RevenueGrowth DEFAULT 0,
    OrderGrowthPercent DECIMAL(7,2) NOT NULL CONSTRAINT DF_AdminDashboard_OrderGrowth DEFAULT 0,
    NewUserGrowthPercent DECIMAL(7,2) NOT NULL CONSTRAINT DF_AdminDashboard_NewUserGrowth DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_AdminDashboard_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AdminDashboard_Administrator FOREIGN KEY (AdminId)
      REFERENCES dbo.Administrators(AdminId)
  );
END;
GO

IF OBJECT_ID(N'dbo.AdminAuditLogs', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AdminAuditLogs (
    AdminAuditLogId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AdminId INT NOT NULL,
    ActionName NVARCHAR(150) NOT NULL,
    TargetType NVARCHAR(80) NOT NULL CONSTRAINT DF_AdminAuditLogs_TargetType DEFAULT N'0',
    TargetCode NVARCHAR(80) NOT NULL CONSTRAINT DF_AdminAuditLogs_TargetCode DEFAULT N'0',
    Detail NVARCHAR(1000) NOT NULL CONSTRAINT DF_AdminAuditLogs_Detail DEFAULT N'0',
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_AdminAuditLogs_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AdminAuditLogs_Administrator FOREIGN KEY (AdminId)
      REFERENCES dbo.Administrators(AdminId)
  );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Administrators WHERE AdminCode = N'ADM-0001')
BEGIN
  INSERT INTO dbo.Administrators (AdminCode, FullName, Email, Phone, PasswordHash, AccountStatus)
  VALUES (N'ADM-0001', N'Quản trị viên', N'admin@shopviet.vn', N'0901999999', N'0', N'active');
END;
GO

INSERT INTO dbo.AdminDashboardSnapshots
  (AdminId, TotalRevenue, TotalOrders, NewUsers, RevenueGrowthPercent, OrderGrowthPercent, NewUserGrowthPercent)
SELECT a.AdminId, 0, 0, 0, 0, 0, 0
FROM dbo.Administrators a
WHERE a.AdminCode = N'ADM-0001'
  AND NOT EXISTS (
    SELECT 1 FROM dbo.AdminDashboardSnapshots d WHERE d.AdminId = a.AdminId
  );
GO

CREATE OR ALTER VIEW dbo.vAdminDashboardSummary
AS
SELECT
  a.AdminCode,
  a.FullName,
  a.Email,
  COALESCE(d.TotalRevenue, 0) AS TotalRevenue,
  COALESCE(d.TotalOrders, 0) AS TotalOrders,
  COALESCE(d.NewUsers, 0) AS NewUsers,
  COALESCE(d.RevenueGrowthPercent, 0) AS RevenueGrowthPercent,
  COALESCE(d.OrderGrowthPercent, 0) AS OrderGrowthPercent,
  COALESCE(d.NewUserGrowthPercent, 0) AS NewUserGrowthPercent,
  COALESCE(d.UpdatedAt, a.CreatedAt) AS UpdatedAt
FROM dbo.Administrators a
LEFT JOIN dbo.AdminDashboardSnapshots d ON d.AdminId = a.AdminId;
GO


/* MODULE: frontend\database\sql-server\admin\sample-user-management.sql */
/*
  QUẢN LÝ NGƯỜI DÙNG – ADMIN
  Chạy sau:
    1) seller/sample-restaurants.sql
    2) orders/sample-orders.sql
    3) admin/sample-admin.sql

  Nguồn dữ liệu: 30 user, 20 seller (mỗi seller gắn 1 quán),
  20 shipper và đúng 1 admin. Các giá trị đếm hoặc lý do chưa có dùng 0.
*/

IF OBJECT_ID(N'dbo.UserAccounts', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.UserAccounts (
    UserAccountId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    AccountCode NVARCHAR(40) NOT NULL UNIQUE,
    AccountRole NVARCHAR(20) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL UNIQUE,
    AccountStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_UserAccounts_Status DEFAULT N'active',
    StatusReason NVARCHAR(1000) NOT NULL CONSTRAINT DF_UserAccounts_Reason DEFAULT N'0',
    PasswordHash NVARCHAR(255) NOT NULL CONSTRAINT DF_UserAccounts_PasswordHash DEFAULT N'0',
    RegisteredAt DATETIME2 NOT NULL CONSTRAINT DF_UserAccounts_RegisteredAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_UserAccounts_Role CHECK (AccountRole IN (N'buyer', N'seller', N'shipper', N'admin')),
    CONSTRAINT CK_UserAccounts_Status CHECK (AccountStatus IN (N'pending', N'active', N'rejected', N'blocked'))
  );
END;
GO

IF OBJECT_ID(N'dbo.UserAccountStatusHistory', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.UserAccountStatusHistory (
    UserAccountStatusHistoryId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserAccountId INT NOT NULL,
    OldStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_UserAccountStatusHistory_OldStatus DEFAULT N'0',
    NewStatus NVARCHAR(20) NOT NULL,
    Reason NVARCHAR(1000) NOT NULL CONSTRAINT DF_UserAccountStatusHistory_Reason DEFAULT N'0',
    ChangedByAdminId INT NULL,
    ChangedAt DATETIME2 NOT NULL CONSTRAINT DF_UserAccountStatusHistory_ChangedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_UserAccountStatusHistory_Account FOREIGN KEY (UserAccountId) REFERENCES dbo.UserAccounts(UserAccountId),
    CONSTRAINT FK_UserAccountStatusHistory_Admin FOREIGN KEY (ChangedByAdminId) REFERENCES dbo.Administrators(AdminId)
  );
END;
GO

;WITH SampleBuyers AS (
  SELECT
    CONCAT(N'KH-', RIGHT(N'0000' + CONVERT(NVARCHAR(4), v.Number), 4)) AS AccountCode,
    CONCAT(N'Khách hàng ', RIGHT(N'00' + CONVERT(NVARCHAR(2), v.Number), 2)) AS FullName,
    CONCAT(N'user', RIGHT(N'00' + CONVERT(NVARCHAR(2), v.Number), 2), N'@example.com') AS Email,
    CONCAT(N'09010000', RIGHT(N'00' + CONVERT(NVARCHAR(2), v.Number), 2)) AS Phone
  FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),(21),(22),(23),(24),(25),(26),(27),(28),(29),(30)) v(Number)
)
INSERT INTO dbo.UserAccounts (AccountCode, AccountRole, FullName, Email, Phone, AccountStatus, StatusReason, PasswordHash)
SELECT b.AccountCode, N'buyer', b.FullName, b.Email, b.Phone, N'active', N'0', N'0'
FROM SampleBuyers b
WHERE NOT EXISTS (SELECT 1 FROM dbo.UserAccounts a WHERE a.Email = b.Email);
GO

INSERT INTO dbo.UserAccounts (AccountCode, AccountRole, FullName, Email, Phone, AccountStatus, StatusReason, PasswordHash)
SELECT s.SellerCode, N'seller', s.FullName, s.Email, s.Phone, N'active', N'0', N'0'
FROM dbo.Sellers s
WHERE NOT EXISTS (SELECT 1 FROM dbo.UserAccounts a WHERE a.Email = s.Email);
GO

INSERT INTO dbo.UserAccounts (AccountCode, AccountRole, FullName, Email, Phone, AccountStatus, StatusReason, PasswordHash)
SELECT sh.ShipperCode, N'shipper', sh.FullName, sh.Email, sh.Phone, N'active', N'0', N'0'
FROM dbo.Shippers sh
WHERE NOT EXISTS (SELECT 1 FROM dbo.UserAccounts a WHERE a.Email = sh.Email);
GO

INSERT INTO dbo.UserAccounts (AccountCode, AccountRole, FullName, Email, Phone, AccountStatus, StatusReason, PasswordHash)
SELECT a.AdminCode, N'admin', a.FullName, a.Email, a.Phone, a.AccountStatus, N'0', a.PasswordHash
FROM dbo.Administrators a
WHERE NOT EXISTS (SELECT 1 FROM dbo.UserAccounts u WHERE u.Email = a.Email);
GO

CREATE OR ALTER VIEW dbo.vAdminUserManagement
AS
SELECT
  u.AccountCode,
  u.AccountRole,
  u.FullName,
  u.Email,
  u.Phone,
  u.AccountStatus,
  u.StatusReason,
  u.RegisteredAt,
  COALESCE(r.RestaurantCode, N'0') AS RestaurantCode,
  COALESCE(r.Name, N'0') AS RestaurantName,
  COALESCE(r.Address, N'0') AS RestaurantAddress,
  COALESCE(sh.DeliveryVehicle, N'0') AS DeliveryVehicle,
  COALESCE(sh.LicensePlate, N'0') AS LicensePlate,
  CASE WHEN u.AccountRole = N'buyer' THEN COALESCE(o.OrderCount, 0) ELSE 0 END AS OrderCount
FROM dbo.UserAccounts u
LEFT JOIN dbo.Sellers s ON u.AccountRole = N'seller' AND s.SellerCode = u.AccountCode
LEFT JOIN dbo.Restaurants r ON r.SellerId = s.SellerId
LEFT JOIN dbo.Shippers sh ON u.AccountRole = N'shipper' AND sh.ShipperCode = u.AccountCode
LEFT JOIN (
  SELECT c.Phone, COUNT(*) AS OrderCount
  FROM dbo.Customers c
  LEFT JOIN dbo.Orders ord ON ord.CustomerId = c.CustomerId
  GROUP BY c.Phone
) o ON u.AccountRole = N'buyer' AND o.Phone = u.Phone;
GO

CREATE OR ALTER VIEW dbo.vAdminUserManagementCounts
AS
SELECT
  COUNT(CASE WHEN AccountRole <> N'admin' THEN 1 END) AS TotalManagedAccounts,
  COUNT(CASE WHEN AccountRole = N'buyer' THEN 1 END) AS BuyerCount,
  COUNT(CASE WHEN AccountRole = N'seller' THEN 1 END) AS SellerCount,
  COUNT(CASE WHEN AccountRole = N'shipper' THEN 1 END) AS ShipperCount,
  COUNT(CASE WHEN AccountStatus = N'pending' THEN 1 END) AS PendingCount,
  COUNT(CASE WHEN AccountStatus = N'active' THEN 1 END) AS ActiveCount,
  COUNT(CASE WHEN AccountStatus = N'rejected' THEN 1 END) AS RejectedCount,
  COUNT(CASE WHEN AccountStatus = N'blocked' THEN 1 END) AS BlockedCount
FROM dbo.UserAccounts;
GO

CREATE OR ALTER PROCEDURE dbo.uspAdminSetUserAccountStatus
  @AccountCode NVARCHAR(40),
  @NewStatus NVARCHAR(20),
  @Reason NVARCHAR(1000) = N'0',
  @AdminCode NVARCHAR(20) = N'ADM-0001'
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @UserAccountId INT, @OldStatus NVARCHAR(20), @AdminId INT;
  SELECT @UserAccountId = UserAccountId, @OldStatus = AccountStatus FROM dbo.UserAccounts WHERE AccountCode = @AccountCode;
  SELECT @AdminId = AdminId FROM dbo.Administrators WHERE AdminCode = @AdminCode;
  IF @UserAccountId IS NULL THROW 50001, N'Không tìm thấy tài khoản.', 1;
  IF @NewStatus NOT IN (N'pending', N'active', N'rejected', N'blocked') THROW 50002, N'Trạng thái không hợp lệ.', 1;

  UPDATE dbo.UserAccounts SET AccountStatus = @NewStatus, StatusReason = COALESCE(NULLIF(@Reason, N''), N'0')
  WHERE UserAccountId = @UserAccountId;
  INSERT INTO dbo.UserAccountStatusHistory (UserAccountId, OldStatus, NewStatus, Reason, ChangedByAdminId)
  VALUES (@UserAccountId, @OldStatus, @NewStatus, COALESCE(NULLIF(@Reason, N''), N'0'), @AdminId);
END;
GO


/* MODULE: frontend\database\sql-server\admin\sample-product-moderation.sql */
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


/* MODULE: frontend\database\sql-server\admin\sample-revenue-commission.sql */
/*
  DOANH THU & HOA HỒNG – ADMIN
  Chạy sau orders/sample-orders.sql, orders/sample-delivery-details.sql
  và admin/sample-admin.sql.

  Giao dịch được tạo từ đơn hàng mẫu, không dùng giao dịch mock của giao diện.
  Chưa có chính sách hoa hồng nên CommissionRatePercent và CommissionAmount = 0.
*/

IF OBJECT_ID(N'dbo.AdminCommissionTransactions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AdminCommissionTransactions (
    AdminCommissionTransactionId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TransactionCode NVARCHAR(50) NOT NULL UNIQUE,
    PartnerType NVARCHAR(20) NOT NULL,
    PartnerCode NVARCHAR(40) NOT NULL,
    OrderId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Description DEFAULT N'0',
    GrossAmount DECIMAL(18,0) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_GrossAmount DEFAULT 0,
    CommissionRatePercent DECIMAL(7,2) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Rate DEFAULT 0,
    CommissionAmount DECIMAL(18,0) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Amount DEFAULT 0,
    TransactionStatus NVARCHAR(20) NOT NULL CONSTRAINT DF_AdminCommissionTransactions_Status DEFAULT N'pending',
    TransactionDate DATETIME2 NOT NULL,
    CONSTRAINT CK_AdminCommissionTransactions_Partner CHECK (PartnerType IN (N'seller', N'shipper')),
    CONSTRAINT CK_AdminCommissionTransactions_Status CHECK (TransactionStatus IN (N'pending', N'completed', N'refunded')),
    CONSTRAINT FK_AdminCommissionTransactions_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
  );
END;
GO

INSERT INTO dbo.AdminCommissionTransactions
  (TransactionCode, PartnerType, PartnerCode, OrderId, Description, GrossAmount, CommissionRatePercent, CommissionAmount, TransactionStatus, TransactionDate)
SELECT
  CONCAT(N'SL-', o.OrderCode), N'seller', s.SellerCode, o.OrderId,
  CONCAT(N'Khấu trừ doanh thu đơn ', o.OrderCode), o.TotalAmount, 0, 0,
  CASE WHEN o.Status IN (N'completed', N'delivered', N'Hoàn thành') THEN N'completed'
       WHEN o.Status IN (N'refunded', N'cancelled', N'Hoàn tiền') THEN N'refunded'
       ELSE N'pending' END,
  o.OrderedAt
FROM dbo.Orders o
INNER JOIN dbo.Restaurants r ON r.RestaurantId = o.RestaurantId
INNER JOIN dbo.Sellers s ON s.SellerId = r.SellerId
WHERE NOT EXISTS (
  SELECT 1 FROM dbo.AdminCommissionTransactions t WHERE t.TransactionCode = CONCAT(N'SL-', o.OrderCode)
);
GO

INSERT INTO dbo.AdminCommissionTransactions
  (TransactionCode, PartnerType, PartnerCode, OrderId, Description, GrossAmount, CommissionRatePercent, CommissionAmount, TransactionStatus, TransactionDate)
SELECT
  CONCAT(N'SP-', o.OrderCode), N'shipper', sh.ShipperCode, o.OrderId,
  CONCAT(N'Khấu trừ phí giao hàng đơn ', o.OrderCode), COALESCE(o.ShippingFee, 0), 0, 0,
  CASE WHEN o.Status IN (N'completed', N'delivered', N'Hoàn thành') THEN N'completed'
       WHEN o.Status IN (N'refunded', N'cancelled', N'Hoàn tiền') THEN N'refunded'
       ELSE N'pending' END,
  o.OrderedAt
FROM dbo.Orders o
INNER JOIN dbo.Shippers sh ON sh.ShipperId = o.ShipperId
WHERE NOT EXISTS (
  SELECT 1 FROM dbo.AdminCommissionTransactions t WHERE t.TransactionCode = CONCAT(N'SP-', o.OrderCode)
);
GO

CREATE OR ALTER VIEW dbo.vAdminRevenueCommissionTransactions
AS
SELECT
  t.TransactionCode,
  t.PartnerType,
  t.PartnerCode,
  CASE WHEN t.PartnerType = N'seller' THEN s.FullName ELSE sh.FullName END AS PartnerName,
  COALESCE(r.Name, N'0') AS RestaurantName,
  t.Description,
  t.GrossAmount,
  t.CommissionRatePercent,
  t.CommissionAmount,
  t.TransactionStatus,
  t.TransactionDate
FROM dbo.AdminCommissionTransactions t
LEFT JOIN dbo.Sellers s ON t.PartnerType = N'seller' AND s.SellerCode = t.PartnerCode
LEFT JOIN dbo.Restaurants r ON r.SellerId = s.SellerId
LEFT JOIN dbo.Shippers sh ON t.PartnerType = N'shipper' AND sh.ShipperCode = t.PartnerCode;
GO

CREATE OR ALTER VIEW dbo.vAdminRevenueCommissionSummary
AS
SELECT
  COALESCE(SUM(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END), 0) AS TotalCommissionRevenue,
  COUNT(*) AS TransactionCount,
  COALESCE(AVG(CAST(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END AS DECIMAL(18,2))), 0) AS AverageCommissionPerTransaction,
  COUNT(CASE WHEN PartnerType = N'seller' THEN 1 END) AS SellerTransactionCount,
  COUNT(CASE WHEN PartnerType = N'shipper' THEN 1 END) AS ShipperTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'pending' THEN 1 END) AS PendingTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'completed' THEN 1 END) AS CompletedTransactionCount,
  COUNT(CASE WHEN TransactionStatus = N'refunded' THEN 1 END) AS RefundedTransactionCount
FROM dbo.AdminCommissionTransactions;
GO

CREATE OR ALTER VIEW dbo.vAdminDailyCommissionRevenue
AS
SELECT
  CAST(TransactionDate AS DATE) AS RevenueDate,
  COALESCE(SUM(CASE WHEN TransactionStatus = N'completed' THEN CommissionAmount ELSE 0 END), 0) AS CommissionRevenue,
  COUNT(*) AS TransactionCount
FROM dbo.AdminCommissionTransactions
GROUP BY CAST(TransactionDate AS DATE);
GO

CREATE OR ALTER PROCEDURE dbo.uspAdminSetCommissionRate
  @TransactionCode NVARCHAR(50),
  @CommissionRatePercent DECIMAL(7,2)
AS
BEGIN
  SET NOCOUNT ON;
  IF @CommissionRatePercent < 0 OR @CommissionRatePercent > 100
    THROW 50021, N'Tỷ lệ hoa hồng phải từ 0 đến 100.', 1;
  UPDATE dbo.AdminCommissionTransactions
  SET CommissionRatePercent = @CommissionRatePercent,
      CommissionAmount = ROUND(GrossAmount * @CommissionRatePercent / 100, 0)
  WHERE TransactionCode = @TransactionCode;
  IF @@ROWCOUNT = 0 THROW 50022, N'Không tìm thấy giao dịch.', 1;
END;
GO


