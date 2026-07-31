namespace WEDBANDOAN.Models;

public sealed class ShipperOrderViewModel
{
    public string Id { get; init; } = "";
    public string Code { get; init; } = "";
    public string SenderName { get; init; } = "";
    public string SenderPhone { get; init; } = "";
    public string SenderAddress { get; init; } = "";
    public string ReceiverName { get; init; } = "";
    public string ReceiverPhone { get; init; } = "";
    public string ReceiverAddress { get; init; } = "";
    public string Items { get; init; } = "";
    public decimal Cod { get; init; }
    public decimal ShippingFee { get; init; }
    public string Status { get; init; } = "pending";
    public DateTime CreatedAt { get; init; }
    public string Note { get; init; } = "";
    public string? CancelReason { get; init; }
    public bool AssignedToMe { get; init; }
}
