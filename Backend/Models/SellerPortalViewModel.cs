namespace WEDBANDOAN.Models;

public sealed class SellerPortalViewModel
{
    public string SellerCode { get; init; } = "0";
    public string SellerName { get; init; } = "0";
    public string RestaurantCode { get; init; } = "0";
    public string RestaurantName { get; init; } = "0";
    public string CategoryName { get; init; } = "0";
    public string Phone { get; init; } = "0";
    public string Email { get; init; } = "0";
    public string Address { get; init; } = "0";
    public string Description { get; init; } = "0";
    public int ProductCount { get; init; }
    public int OrderCount { get; init; }
    public decimal Revenue { get; init; }
    public decimal Rating { get; init; }
    public List<SellerProductViewModel> Products { get; init; } = [];
}

public sealed class SellerProductViewModel { public string Code { get; init; } = "0"; public string Name { get; init; } = "0"; public string Category { get; init; } = "0"; public decimal Price { get; init; } public int StockQuantity { get; init; } public string Status { get; init; } = "0"; public string Toppings { get; init; } = "0"; }
