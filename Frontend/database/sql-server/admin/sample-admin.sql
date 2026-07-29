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
