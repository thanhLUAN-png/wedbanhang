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
