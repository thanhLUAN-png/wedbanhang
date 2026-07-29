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
