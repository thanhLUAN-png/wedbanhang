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