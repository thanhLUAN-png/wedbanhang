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
