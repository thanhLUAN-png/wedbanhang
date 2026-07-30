using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WEDBANDOAN.Models;
using WEDBANDOAN.Services;

namespace WEDBANDOAN.Controllers;

[ApiController]
[Route("seller-api/seller/dashboard")]
public sealed class SellerDashboardController(SellerRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string sellerCode = "SL-BT-0001")
    {
        try
        {
            return Ok(await repository.GetDashboardAsync(sellerCode));
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể kết nối SQL Server." });
        }
    }

    [HttpGet("/seller-api/seller/orders")]
    public async Task<IActionResult> Orders([FromQuery] string sellerCode = "SL-BT-0001")
    {
        try { return Ok(await repository.GetOrdersAsync(sellerCode)); }
        catch (Exception) { return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể kết nối SQL Server." }); }
    }

    [HttpPut("/seller-api/seller/orders/{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] SellerOrderStatusRequest request, [FromQuery] string sellerCode = "SL-BT-0001")
    {
        var updated = await repository.UpdateSellerOrderStatusAsync(sellerCode, id, request.Status);
        return updated
            ? Ok(new { status = request.Status })
            : BadRequest(new { error = "Trạng thái đơn hàng đã thay đổi hoặc thao tác không hợp lệ." });
    }

    [HttpGet("/seller-api/seller/products")]
    public async Task<IActionResult> Products([FromQuery] string sellerCode = "SL-BT-0001")
    {
        try { return Ok(await repository.GetProductsAsync(sellerCode)); }
        catch (Exception) { return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể kết nối SQL Server." }); }
    }

    [HttpGet("/seller-api/shipper/orders")]
    public async Task<IActionResult> ShipperOrders([FromQuery] string phone)
        => string.IsNullOrWhiteSpace(phone) ? BadRequest() : Ok(await repository.GetShipperOrdersAsync(phone));

    [HttpPut("/seller-api/shipper/orders/{id:int}/accept")]
    public async Task<IActionResult> AcceptShipperOrder(int id,[FromQuery] string phone)
        => await repository.AcceptShipperOrderAsync(id,phone) ? Ok() : BadRequest(new{error="Đơn đã có shipper nhận hoặc bạn đang giao đơn khác."});

    [HttpPut("/seller-api/shipper/orders/{id:int}/status")]
    public async Task<IActionResult> UpdateShipperOrderStatus(int id,[FromBody] SellerOrderStatusRequest request,[FromQuery] string phone)
        => await repository.UpdateShipperOrderStatusAsync(id,phone,request.Status) ? Ok() : BadRequest(new{error="Không thể cập nhật trạng thái đơn."});

    [HttpGet("/seller-api/public/catalog")]
    public async Task<IActionResult> PublicCatalog()
    {
        try { return Ok(await repository.GetPublicCatalogAsync()); }
        catch (Exception) { return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể tải quán và món ăn từ SQL Server." }); }
    }

    [HttpGet("/seller-api/public/promotions/validate")]
    public async Task<IActionResult> ValidatePublicPromotion([FromQuery] string code)
    {
        if(string.IsNullOrWhiteSpace(code)) return BadRequest(new{error="Vui lòng nhập mã giảm giá."});
        var promotion=await repository.FindActivePromotionAsync(code);
        return promotion is null ? NotFound(new{error="Mã không tồn tại, đã hết hạn hoặc hết lượt sử dụng."}) : Ok(promotion);
    }

    [HttpPost("/seller-api/seller/products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateSellerProductRequest request, [FromQuery] string sellerCode = "SL-BT-0001")
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Price <= 0) return BadRequest(new { error = "Tên và giá sản phẩm là bắt buộc." });
        if (!HasValidToppings(request.ToppingsJson, out var toppingError)) return BadRequest(new { error = toppingError });
        try { return Ok(request.Type == "combo" ? await repository.CreateComboAsync(sellerCode, request) : await repository.CreateProductAsync(sellerCode, request)); }
        catch (Exception) { return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể lưu sản phẩm vào SQL Server." }); }
    }

    [HttpGet("/seller-api/seller/shop")]
    public async Task<IActionResult> Shop([FromQuery] string sellerCode = "SL-BT-0001") => Ok(await repository.GetShopInfoAsync(sellerCode));

    [HttpPut("/seller-api/seller/shop")]
    public async Task<IActionResult> UpdateShop([FromBody] UpdateSellerShopRequest request, [FromQuery] string sellerCode = "SL-BT-0001")
    { await repository.UpdateShopInfoAsync(sellerCode, request); return Ok(await repository.GetShopInfoAsync(sellerCode)); }

    [HttpGet("/seller-api/seller/activity")]
    public async Task<IActionResult> Activity([FromQuery] string sellerCode = "SL-BT-0001") => Ok(new { isActive = await repository.GetRestaurantActiveAsync(sellerCode) });
    [HttpPut("/seller-api/seller/activity")]
    public async Task<IActionResult> SetActivity([FromBody] ActivityRequest request, [FromQuery] string sellerCode = "SL-BT-0001") { await repository.SetRestaurantActiveAsync(sellerCode, request.IsActive); return Ok(new { isActive = request.IsActive }); }

    [HttpGet("/seller-api/seller/promotions")]
    public async Task<IActionResult> Promotions([FromQuery] bool trash=false,[FromQuery] string sellerCode="SL-BT-0001") => Ok(await repository.GetPromotionsAsync(sellerCode,trash));
    [HttpPost("/seller-api/seller/promotions")]
    public async Task<IActionResult> CreatePromotion([FromBody] CreateSellerPromotionRequest request,[FromQuery] string sellerCode="SL-BT-0001")
    {
        if(!ValidPromotion(request,out var error)) return BadRequest(new{error});
        try { await repository.CreatePromotionAsync(sellerCode,request); return Ok(); }
        catch(Exception ex) { return BadRequest(new{error=ex.Message.Contains("UNIQUE")?"Mã giảm giá đã tồn tại.":"Không thể lưu mã giảm giá vào SQL Server."}); }
    }
    [HttpPut("/seller-api/seller/promotions/{id:int}")]
    public async Task<IActionResult> UpdatePromotion(int id,[FromBody] CreateSellerPromotionRequest request,[FromQuery] string sellerCode="SL-BT-0001")
    {
        if(!ValidPromotion(request,out var error)) return BadRequest(new{error});
        try { await repository.UpdatePromotionAsync(sellerCode,id,request); return Ok(); }
        catch(Exception ex) { return BadRequest(new{error=ex.Message.Contains("UNIQUE")?"Mã giảm giá đã tồn tại.":"Không thể cập nhật mã giảm giá."}); }
    }
    [HttpPut("/seller-api/seller/promotions/{id:int}/trash")]
    public async Task<IActionResult> TrashPromotion(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetPromotionDeletedAsync(sellerCode,id,true);return Ok();}
    [HttpPut("/seller-api/seller/promotions/{id:int}/restore")]
    public async Task<IActionResult> RestorePromotion(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetPromotionDeletedAsync(sellerCode,id,false);return Ok();}
    private static bool ValidPromotion(CreateSellerPromotionRequest request,out string error)
    {
        if(string.IsNullOrWhiteSpace(request.Code)){error="Vui lòng nhập mã giảm giá.";return false;}
        if(request.Discount<=0){error="Giá trị giảm phải lớn hơn 0.";return false;}
        if(request.DiscountType=="percent"&&request.Discount>100){error="Phần trăm giảm không được vượt quá 100%.";return false;}
        if(request.StartAt==default||request.EndAt==default||request.EndAt<request.StartAt){error="Ngày bắt đầu và kết thúc không hợp lệ.";return false;}
        if(request.UsageLimit<=0){error="Giới hạn lượt sử dụng phải lớn hơn 0.";return false;}
        error="";return true;
    }
    [HttpGet("/seller-api/seller/chat/participants")]
    public async Task<IActionResult> ChatParticipants([FromQuery] string type="customer",[FromQuery] string sellerCode="SL-BT-0001") => Ok(await repository.GetChatParticipantsAsync(sellerCode,type));
    [HttpGet("/seller-api/seller/auto-activity")]
    public async Task<IActionResult> AutoActivity([FromQuery] string sellerCode="SL-BT-0001") => Ok(new { enabled=await repository.GetAutoActivityAsync(sellerCode) });
    [HttpPut("/seller-api/seller/auto-activity")]
    public async Task<IActionResult> SetAutoActivity([FromBody] ActivityRequest request,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetAutoActivityAsync(sellerCode,request.IsActive);return Ok(new{enabled=request.IsActive});}
    [HttpGet("/seller-api/seller/product-categories")]
    public async Task<IActionResult> Categories([FromQuery] string sellerCode="SL-BT-0001")=>Ok(await repository.GetCategoriesAsync(sellerCode));
    [HttpPost("/seller-api/seller/product-categories")]
    public async Task<IActionResult> AddCategory([FromBody] SellerCategoryRequest request,[FromQuery] string sellerCode="SL-BT-0001"){if(string.IsNullOrWhiteSpace(request.Name))return BadRequest();await repository.AddCategoryAsync(sellerCode,request.Name);return Ok();}
    [HttpPut("/seller-api/seller/product-categories/{id:int}/trash")]
    public async Task<IActionResult> TrashCategory(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetCategoryDeletedAsync(sellerCode,id,true);return Ok();}
    [HttpPut("/seller-api/seller/product-categories/trash-by-name")]
    public async Task<IActionResult> TrashCategoryByName([FromBody] SellerCategoryRequest request,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetCategoryDeletedByNameAsync(sellerCode,request.Name);return Ok();}
    [HttpPut("/seller-api/seller/products/{id:int}/trash")]
    public async Task<IActionResult> TrashProduct(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetProductDeletedAsync(sellerCode,id,true);return Ok();}
    [HttpPut("/seller-api/seller/products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id,[FromBody] CreateSellerProductRequest request,[FromQuery] string sellerCode="SL-BT-0001")
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Price <= 0) return BadRequest(new { error = "Tên và giá sản phẩm là bắt buộc." });
        if (!HasValidToppings(request.ToppingsJson, out var toppingError)) return BadRequest(new { error = toppingError });
        await repository.UpdateProductAsync(sellerCode,id,request); return Ok();
    }
    [HttpPut("/seller-api/seller/products/{id:int}/restore")]
    public async Task<IActionResult> RestoreProduct(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetProductDeletedAsync(sellerCode,id,false);return Ok();}

    [HttpPost("/seller-api/customer/orders")]
    public async Task<IActionResult> CreateCustomerOrder([FromBody] CreateCustomerOrderRequest request)
    {
        if(string.IsNullOrWhiteSpace(request.CustomerName)||string.IsNullOrWhiteSpace(request.Phone)||string.IsNullOrWhiteSpace(request.DeliveryAddress)||request.Items.Count==0||request.Items.Any(i=>i.RestaurantId<=0||i.Price<=0||i.Quantity<=0)) return BadRequest(new{error="Thông tin đơn hàng chưa đầy đủ."});
        try{return Ok(new{orderCodes=await repository.CreateCustomerOrdersAsync(request)});}catch{return StatusCode(503,new{error="Không thể lưu đơn hàng vào SQL Server."});}
    }
    [HttpGet("/seller-api/customer/orders")]
    public async Task<IActionResult> CustomerOrders([FromQuery] string phone)
    {
        if(string.IsNullOrWhiteSpace(phone))return BadRequest(new{error="Thiếu số điện thoại khách hàng."});
        return Ok(await repository.GetCustomerOrdersAsync(phone));
    }
    [HttpPut("/seller-api/customer/orders/{code}/cancel")]
    public async Task<IActionResult> CancelCustomerOrder(string code,[FromQuery] string phone)
        => await repository.CancelCustomerOrderAsync(code,phone)?Ok():BadRequest(new{error="Chỉ có thể hủy đơn đang chờ xác nhận."});

    private static bool HasValidToppings(string? toppingsJson, out string error)
    {
        error = "";
        if (string.IsNullOrWhiteSpace(toppingsJson)) return true;
        try
        {
            using var document = JsonDocument.Parse(toppingsJson);
            if (document.RootElement.ValueKind != JsonValueKind.Array) { error = "Dữ liệu topping không hợp lệ."; return false; }
            var index = 0;
            foreach (var topping in document.RootElement.EnumerateArray())
            {
                index++;
                if (topping.ValueKind != JsonValueKind.Object) { error = $"Topping dòng {index} không hợp lệ."; return false; }
                var hasName = topping.TryGetProperty("name", out var name) && !string.IsNullOrWhiteSpace(name.GetString());
                var hasPrice = topping.TryGetProperty("price", out var price) && price.ValueKind == JsonValueKind.Number && price.TryGetDecimal(out var value) && value > 0;
                // The UI keeps one empty optional row by default. It is safe to ignore it.
                if (!hasName && !hasPrice) continue;
                if (!hasName || !hasPrice)
                { error = $"Topping dòng {index} chưa đủ tên hoặc giá. Hãy điền đủ hoặc xoá dòng đó."; return false; }
            }
            return true;
        }
        catch (JsonException) { error = "Dữ liệu topping không hợp lệ."; return false; }
    }
}

public sealed class ActivityRequest { public bool IsActive { get; init; } }
public sealed class SellerOrderStatusRequest { public string Status { get; init; } = ""; }
