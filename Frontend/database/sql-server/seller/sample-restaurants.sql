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