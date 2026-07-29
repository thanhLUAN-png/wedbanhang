namespace WEDBANDOAN.Models;

public sealed class SellerShopInfoViewModel
{
    public string RestaurantCode { get; init; } = "";
    public string Name { get; init; } = "";
    public string Description { get; init; } = "";
    public string Phone { get; init; } = "";
    public string Email { get; init; } = "";
    public string Address { get; init; } = "";
    public string OpeningHours { get; init; } = "";
    public string? LogoUrl { get; init; }
    public decimal Rating { get; init; }
    public int RatingCount { get; init; }
    public int TotalOrders { get; init; }
    public decimal CompletionRate { get; init; }
}

public sealed class UpdateSellerShopRequest { public string Name { get; init; } = ""; public string? Description { get; init; } public string? Phone { get; init; } public string? Email { get; init; } public string? Address { get; init; } public string? OpeningHours { get; init; } public string? LogoUrl { get; init; } }
