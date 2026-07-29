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
