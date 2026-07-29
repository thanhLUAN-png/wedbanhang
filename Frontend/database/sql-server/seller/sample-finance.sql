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
