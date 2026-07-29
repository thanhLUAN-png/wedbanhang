using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("/seller-api/seller/products")]
    public async Task<IActionResult> Products([FromQuery] string sellerCode = "SL-BT-0001")
    {
        try { return Ok(await repository.GetProductsAsync(sellerCode)); }
        catch (Exception) { return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Không thể kết nối SQL Server." }); }
    }

    [HttpPost("/seller-api/seller/products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateSellerProductRequest request, [FromQuery] string sellerCode = "SL-BT-0001")
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Price <= 0) return BadRequest(new { error = "Tên và giá sản phẩm là bắt buộc." });
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
    public async Task<IActionResult> CreatePromotion([FromBody] CreateSellerPromotionRequest request,[FromQuery] string sellerCode="SL-BT-0001"){await repository.CreatePromotionAsync(sellerCode,request);return Ok();}
    [HttpPut("/seller-api/seller/promotions/{id:int}/trash")]
    public async Task<IActionResult> TrashPromotion(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetPromotionDeletedAsync(sellerCode,id,true);return Ok();}
    [HttpPut("/seller-api/seller/promotions/{id:int}/restore")]
    public async Task<IActionResult> RestorePromotion(int id,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetPromotionDeletedAsync(sellerCode,id,false);return Ok();}
    [HttpGet("/seller-api/seller/chat/participants")]
    public async Task<IActionResult> ChatParticipants([FromQuery] string type="customer",[FromQuery] string sellerCode="SL-BT-0001") => Ok(await repository.GetChatParticipantsAsync(sellerCode,type));
    [HttpGet("/seller-api/seller/auto-activity")]
    public async Task<IActionResult> AutoActivity([FromQuery] string sellerCode="SL-BT-0001") => Ok(new { enabled=await repository.GetAutoActivityAsync(sellerCode) });
    [HttpPut("/seller-api/seller/auto-activity")]
    public async Task<IActionResult> SetAutoActivity([FromBody] ActivityRequest request,[FromQuery] string sellerCode="SL-BT-0001"){await repository.SetAutoActivityAsync(sellerCode,request.IsActive);return Ok(new{enabled=request.IsActive});}
}

public sealed class ActivityRequest { public bool IsActive { get; init; } }
