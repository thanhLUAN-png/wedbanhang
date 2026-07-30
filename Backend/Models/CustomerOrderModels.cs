namespace WEDBANDOAN.Models;

public sealed class CreateCustomerOrderRequest
{
    public string CustomerName { get; init; } = "";
    public string Phone { get; init; } = "";
    public string DeliveryAddress { get; init; } = "";
    public string PaymentMethod { get; init; } = "cod";
    public string? Note { get; init; }
    public decimal ShippingFee { get; init; }
    public decimal Discount { get; init; }
    public int? PromotionRestaurantId { get; init; }
    public List<CreateCustomerOrderItem> Items { get; init; } = [];
}

public sealed class CreateCustomerOrderItem
{
    public int RestaurantId { get; init; }
    public string ProductId { get; init; } = "";
    public string ProductName { get; init; } = "";
    public string? ProductImage { get; init; }
    public string? Variant { get; init; }
    public decimal Price { get; init; }
    public int Quantity { get; init; }
}

public sealed class CustomerOrderItemViewModel
{
    public int Id { get; init; }
    public string ProductId { get; init; } = "";
    public string ProductName { get; init; } = "";
    public string ProductImage { get; init; } = "";
    public string ShopName { get; init; } = "";
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public string? Variant { get; init; }
}

public sealed class CustomerOrderViewModel
{
    public string Id { get; init; } = "";
    public string Status { get; init; } = "pending";
    public List<CustomerOrderItemViewModel> Items { get; init; } = [];
    public decimal Subtotal { get; init; }
    public decimal ShippingFee { get; init; }
    public decimal Discount { get; init; }
    public decimal Total { get; init; }
    public string CustomerName { get; init; } = "";
    public string Phone { get; init; } = "";
    public string DeliveryAddress { get; init; } = "";
    public string PaymentMethod { get; init; } = "cod";
    public string Note { get; init; } = "";
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
