namespace WEDBANDOAN.Models;

public sealed class ChatParticipantViewModel
{
    public long ConversationId { get; init; }
    public string OrderCode { get; init; } = "";
    public string ParticipantName { get; init; } = "";
    public string ParticipantType { get; init; } = "";
    public string LastMessage { get; init; } = "";
    public DateTime LastMessageAt { get; init; }
}

public sealed class ChatMessageViewModel
{
    public long Id { get; init; }
    public string Content { get; init; } = "";
    public string SenderType { get; init; } = "";
    public bool FromMe { get; init; }
    public DateTime SentAt { get; init; }
}

public sealed class SendMessageRequest
{
    public string Content { get; init; } = "";
}
