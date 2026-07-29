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
