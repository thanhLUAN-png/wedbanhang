using Microsoft.AspNetCore.Mvc;
using WEDBANDOAN.Services;
namespace WEDBANDOAN.Controllers;
public sealed class SellerController(SellerRepository repository) : Controller
{
    public async Task<IActionResult> Index()
    {
        ViewData["Range"] = "today";
        return View(await repository.GetSellerAsync());
    }
    public async Task<IActionResult> Products() => View(await repository.GetSellerAsync());
    public async Task<IActionResult> Shop() => View(await repository.GetSellerAsync());
    public async Task<IActionResult> Orders() => View("Section", await repository.GetSellerAsync());
    public async Task<IActionResult> Analytics() => View("Section", await repository.GetSellerAsync());
    public async Task<IActionResult> Finance() => View("Section", await repository.GetSellerAsync());
    public async Task<IActionResult> Promotions() => View("Section", await repository.GetSellerAsync());
    public async Task<IActionResult> Messages() => View("Section", await repository.GetSellerAsync());
    public async Task<IActionResult> Settings() => View("Section", await repository.GetSellerAsync());
}
