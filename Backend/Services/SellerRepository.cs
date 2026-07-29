using Microsoft.Data.SqlClient;
using WEDBANDOAN.Models;
namespace WEDBANDOAN.Services;
public sealed class SellerRepository(IConfiguration configuration)
{
    private readonly string _cs = configuration.GetConnectionString("WEDBANDOAN") ?? throw new InvalidOperationException("Thiếu kết nối SQL.");
    public async Task<SellerPortalViewModel> GetSellerAsync(string sellerCode = "SL-BT-0001")
    {
        await using var cn = new SqlConnection(_cs); await cn.OpenAsync();
        const string shopSql = "SELECT TOP 1 s.SellerCode,s.FullName,r.RestaurantCode,r.Name,COALESCE(c.CategoryName,N'0'),COALESCE(r.Phone,N'0'),COALESCE(r.Email,N'0'),COALESCE(r.Address,N'0'),COALESCE(r.Description,N'0'),(SELECT COUNT(*) FROM dbo.MenuItems m WHERE m.RestaurantId=r.RestaurantId),(SELECT COUNT(*) FROM dbo.Orders o WHERE o.RestaurantId=r.RestaurantId),CAST(0 AS DECIMAL(18,2)),CAST(0 AS DECIMAL(3,2)) FROM dbo.Sellers s JOIN dbo.Restaurants r ON r.SellerId=s.SellerId LEFT JOIN dbo.RestaurantCategories c ON c.RestaurantCategoryId=r.PrimaryRestaurantCategoryId WHERE s.SellerCode=@code";
        SellerPortalViewModel vm;
        await using (var cmd = new SqlCommand(shopSql, cn)) { cmd.Parameters.AddWithValue("@code", sellerCode); await using var rd = await cmd.ExecuteReaderAsync(); if (!await rd.ReadAsync()) return new SellerPortalViewModel(); vm = new SellerPortalViewModel { SellerCode=rd.GetString(0), SellerName=rd.GetString(1), RestaurantCode=rd.GetString(2), RestaurantName=rd.GetString(3), CategoryName=rd.GetString(4), Phone=rd.GetString(5), Email=rd.GetString(6), Address=rd.GetString(7), Description=rd.GetString(8), ProductCount=rd.GetInt32(9), OrderCount=rd.GetInt32(10), Revenue=rd.GetDecimal(11), Rating=rd.GetDecimal(12) }; }
        const string productSql = "SELECT m.MenuItemCode,m.Name,COALESCE(m.Category,N'0'),m.Price,COALESCE(m.StockQuantity,0),COALESCE(m.ProductStatus,N'0'),COALESCE(m.ToppingsJson,N'0') FROM dbo.MenuItems m JOIN dbo.Restaurants r ON r.RestaurantId=m.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code ORDER BY m.MenuItemCode";
        var items = new List<SellerProductViewModel>(); await using var productCmd = new SqlCommand(productSql, cn); productCmd.Parameters.AddWithValue("@code", sellerCode); await using var pr = await productCmd.ExecuteReaderAsync(); while (await pr.ReadAsync()) items.Add(new SellerProductViewModel { Code=pr.GetString(0), Name=pr.GetString(1), Category=pr.GetString(2), Price=pr.GetDecimal(3), StockQuantity=pr.GetInt32(4), Status=pr.GetString(5), Toppings=pr.GetString(6) });
        return new SellerPortalViewModel { SellerCode=vm.SellerCode,SellerName=vm.SellerName,RestaurantCode=vm.RestaurantCode,RestaurantName=vm.RestaurantName,CategoryName=vm.CategoryName,Phone=vm.Phone,Email=vm.Email,Address=vm.Address,Description=vm.Description,ProductCount=vm.ProductCount,OrderCount=vm.OrderCount,Revenue=vm.Revenue,Rating=vm.Rating,Products=items };
    }

    public async Task<SellerDashboardViewModel> GetDashboardAsync(string sellerCode = "SL-BT-0001")
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();

        const string restaurantSql = "SELECT TOP 1 r.RestaurantId FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code";
        await using var restaurantCmd = new SqlCommand(restaurantSql, cn);
        restaurantCmd.Parameters.AddWithValue("@code", sellerCode);
        var restaurantValue = await restaurantCmd.ExecuteScalarAsync();
        if (restaurantValue is null) return new SellerDashboardViewModel { RevenueByHour = EmptyHours() };
        var restaurantId = Convert.ToInt32(restaurantValue);

        const string summarySql = """
            SELECT
              COALESCE(SUM(CASE WHEN o.Status=N'completed' AND CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date) THEN o.TotalAmount ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date) THEN 1 ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN o.Status=N'pending' THEN 1 ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN o.Status=N'shipping' THEN 1 ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN o.Status=N'completed' AND CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date) THEN 1 ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN o.Status=N'returned' AND CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date) THEN 1 ELSE 0 END),0),
              COALESCE(SUM(CASE WHEN o.Status=N'cancelled' AND CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date) THEN 1 ELSE 0 END),0)
            FROM dbo.Orders o WHERE o.RestaurantId=@restaurantId;
            """;
        decimal revenue; int orders; int pending; int shipping; int completed; int returned; int cancelled;
        await using (var summaryCmd = new SqlCommand(summarySql, cn))
        {
            summaryCmd.Parameters.AddWithValue("@restaurantId", restaurantId);
            await using var reader = await summaryCmd.ExecuteReaderAsync();
            await reader.ReadAsync();
            revenue = reader.GetDecimal(0); orders = reader.GetInt32(1); pending = reader.GetInt32(2); shipping = reader.GetInt32(3); completed=reader.GetInt32(4); returned=reader.GetInt32(5); cancelled=reader.GetInt32(6);
        }

        var revenueByHour = EmptyHours();
        const string hourlySql = """
            SELECT DATEPART(HOUR, OrderedAt), COALESCE(SUM(TotalAmount),0)
            FROM dbo.Orders
            WHERE RestaurantId=@restaurantId AND Status=N'completed' AND CAST(OrderedAt AS date)=CAST(GETDATE() AS date)
            GROUP BY DATEPART(HOUR, OrderedAt);
            """;
        await using (var hourlyCmd = new SqlCommand(hourlySql, cn))
        {
            hourlyCmd.Parameters.AddWithValue("@restaurantId", restaurantId);
            await using var reader = await hourlyCmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) revenueByHour[reader.GetInt32(0)] = new SellerRevenuePoint { Time = $"{reader.GetInt32(0):00}:00", Revenue = reader.GetDecimal(1) };
        }

        var ordersByHour = EmptyHours();
        const string ordersHourlySql = "SELECT DATEPART(HOUR, OrderedAt),COUNT(*) FROM dbo.Orders WHERE RestaurantId=@restaurantId AND CAST(OrderedAt AS date)=CAST(GETDATE() AS date) GROUP BY DATEPART(HOUR, OrderedAt);";
        await using (var ordersHourlyCmd = new SqlCommand(ordersHourlySql, cn)) { ordersHourlyCmd.Parameters.AddWithValue("@restaurantId", restaurantId); await using var reader = await ordersHourlyCmd.ExecuteReaderAsync(); while (await reader.ReadAsync()) ordersByHour[reader.GetInt32(0)] = new SellerRevenuePoint { Time = $"{reader.GetInt32(0):00}:00", Revenue = reader.GetInt32(1) }; }
        var topProducts = new List<SellerTopProduct>();
        const string topProductsSql = """
            SELECT TOP 5 i.ProductNameSnapshot, SUM(i.Quantity) AS Quantity
            FROM dbo.OrderItems i JOIN dbo.Orders o ON o.OrderId=i.OrderId
            WHERE o.RestaurantId=@restaurantId AND o.Status=N'completed' AND CAST(o.OrderedAt AS date)=CAST(GETDATE() AS date)
            GROUP BY i.ProductNameSnapshot ORDER BY Quantity DESC, i.ProductNameSnapshot;
            """;
        await using (var productsCmd = new SqlCommand(topProductsSql, cn))
        {
            productsCmd.Parameters.AddWithValue("@restaurantId", restaurantId);
            await using var reader = await productsCmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) topProducts.Add(new SellerTopProduct { Name = reader.GetString(0), Quantity = reader.GetInt32(1) });
        }

        var recentOrders = new List<SellerRecentOrder>();
        const string recentOrdersSql = """
            SELECT TOP 4 o.OrderCode,c.FullName,o.TotalAmount,o.Status,o.OrderedAt,COUNT(i.OrderItemId)
            FROM dbo.Orders o JOIN dbo.Customers c ON c.CustomerId=o.CustomerId
            LEFT JOIN dbo.OrderItems i ON i.OrderId=o.OrderId
            WHERE o.RestaurantId=@restaurantId
            GROUP BY o.OrderCode,c.FullName,o.TotalAmount,o.Status,o.OrderedAt
            ORDER BY o.OrderedAt DESC;
            """;
        await using (var recentCmd = new SqlCommand(recentOrdersSql, cn))
        {
            recentCmd.Parameters.AddWithValue("@restaurantId", restaurantId);
            await using var reader = await recentCmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) recentOrders.Add(new SellerRecentOrder { OrderCode = reader.GetString(0), CustomerName = reader.GetString(1), Total = reader.GetDecimal(2), Status = reader.GetString(3), OrderedAt = reader.GetDateTime(4), ItemCount = reader.GetInt32(5) });
        }

        return new SellerDashboardViewModel { RevenueToday = revenue, OrdersToday = orders, PendingOrders = pending, ShippingOrders = shipping, CompletedOrders=completed, ReturnedOrders=returned, CancelledOrders=cancelled, RevenueByHour = revenueByHour, OrdersByHour = ordersByHour, TopProducts = topProducts, RecentOrders = recentOrders };
    }

    public async Task<List<SellerOrderListItem>> GetOrdersAsync(string sellerCode = "SL-BT-0001")
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            SELECT o.OrderId,o.OrderCode,o.Status,o.PaymentMethod,o.DeliveryAddress,o.CustomerNote,o.TotalAmount,o.OrderedAt,
                   c.FullName,c.Phone,sh.FullName,
                   i.OrderItemId,i.ProductNameSnapshot,i.UnitPrice,i.Quantity
            FROM dbo.Orders o
            JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId
            JOIN dbo.Sellers s ON s.SellerId=r.SellerId
            JOIN dbo.Customers c ON c.CustomerId=o.CustomerId
            LEFT JOIN dbo.Shippers sh ON sh.ShipperId=o.ShipperId
            LEFT JOIN dbo.OrderItems i ON i.OrderId=o.OrderId
            WHERE s.SellerCode=@sellerCode
            ORDER BY o.OrderedAt DESC,o.OrderId DESC,i.OrderItemId;
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@sellerCode", sellerCode);
        await using var reader = await cmd.ExecuteReaderAsync();
        var result = new List<SellerOrderListItem>();
        var byId = new Dictionary<int, int>();
        while (await reader.ReadAsync())
        {
            var id = reader.GetInt32(0);
            if (!byId.TryGetValue(id, out var index))
            {
                index = result.Count;
                byId[id] = index;
                result.Add(new SellerOrderListItem
                {
                    Id = id.ToString(), OrderCode = reader.GetString(1), Status = reader.GetString(2), PaymentMethod = reader.GetString(3),
                    DeliveryAddress = reader.GetString(4), Note = reader.GetString(5) == "0" ? "" : reader.GetString(5), Total = reader.GetDecimal(6), OrderedAt = reader.GetDateTime(7),
                    CustomerName = reader.GetString(8), CustomerPhone = reader.GetString(9), ShipperName = reader.IsDBNull(10) ? null : reader.GetString(10)
                });
            }
            if (!reader.IsDBNull(11)) result[index].Items.Add(new SellerOrderLineItem { Id = reader.GetInt32(11).ToString(), ProductName = reader.GetString(12), Price = reader.GetDecimal(13), Quantity = reader.GetInt32(14) });
        }
        const string comboSql = "SELECT c.ComboId,c.Name,c.Price,COALESCE(c.Category,N'Khác'),COALESCE(c.ProductStatus,N'active'),c.ImageUrl,COALESCE(c.Description,N'') FROM dbo.Combos c JOIN dbo.Restaurants r ON r.RestaurantId=c.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode AND c.DeletedAt IS NULL";
        return result;
    }

    public async Task<List<SellerProductItem>> GetProductsAsync(string sellerCode = "SL-BT-0001")
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            SELECT m.MenuItemId,m.Name,m.Price,COALESCE(m.Category,N'Khác'),COALESCE(m.ProductStatus,N'active'),m.ImageUrl,COALESCE(m.Description,N'')
            FROM dbo.MenuItems m JOIN dbo.Restaurants r ON r.RestaurantId=m.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId
            WHERE s.SellerCode=@sellerCode AND m.DeletedAt IS NULL ORDER BY m.MenuItemId DESC;
            """;
        await using var cmd = new SqlCommand(sql, cn); cmd.Parameters.AddWithValue("@sellerCode", sellerCode);
        await using var reader = await cmd.ExecuteReaderAsync(); var result = new List<SellerProductItem>();
        while (await reader.ReadAsync()) result.Add(new SellerProductItem { Id=reader.GetInt32(0), Name=reader.GetString(1), Price=reader.GetDecimal(2), Category=reader.GetString(3), Status=reader.GetString(4), Image=reader.IsDBNull(5)?null:reader.GetString(5), Description=reader.GetString(6) });
        await reader.CloseAsync();
        const string comboListSql = "SELECT c.ComboId,c.Name,c.Price,COALESCE(c.Category,N'Khác'),COALESCE(c.ProductStatus,N'active'),c.ImageUrl,COALESCE(c.Description,N'') FROM dbo.Combos c JOIN dbo.Restaurants r ON r.RestaurantId=c.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode AND c.DeletedAt IS NULL";
        await using var comboListCmd=new SqlCommand(comboListSql,cn); comboListCmd.Parameters.AddWithValue("@sellerCode",sellerCode); await using var cr=await comboListCmd.ExecuteReaderAsync(); while(await cr.ReadAsync()) result.Add(new SellerProductItem { Id=cr.GetInt32(0),Name=cr.GetString(1),Price=cr.GetDecimal(2),Category=cr.GetString(3),Status=cr.GetString(4),Type="combo",Image=cr.IsDBNull(5)?null:cr.GetString(5),Description=cr.GetString(6) });
        return result;
    }

    public async Task<SellerProductItem> CreateProductAsync(string sellerCode, CreateSellerProductRequest request)
    {
        await using var cn = new SqlConnection(_cs); await cn.OpenAsync();
        const string sql = """
            DECLARE @restaurantId INT, @restaurantCode NVARCHAR(40);
            SELECT TOP 1 @restaurantId=r.RestaurantId,@restaurantCode=r.RestaurantCode FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode;
            IF @restaurantId IS NULL THROW 50001, 'Không tìm thấy nhà hàng của seller.', 1;
            DECLARE @code NVARCHAR(60)=CONCAT(@restaurantCode,N'-M',RIGHT(REPLACE(CONVERT(NVARCHAR(36),NEWID()),N'-',N''),10));
            INSERT INTO dbo.MenuItems (MenuItemCode,RestaurantId,Name,Description,Price,ToppingsJson,IsAvailable,Category,ProductStatus,StockQuantity,ImageUrl)
            OUTPUT INSERTED.MenuItemId,INSERTED.Name,INSERTED.Price,INSERTED.Category,INSERTED.ProductStatus,INSERTED.ImageUrl,COALESCE(INSERTED.Description,N'')
            VALUES (@code,@restaurantId,@name,@description,@price,N'[]',CASE WHEN @status=N'active' THEN 1 ELSE 0 END,@category,@status,0,@image);
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@sellerCode", sellerCode); cmd.Parameters.AddWithValue("@name", request.Name.Trim()); cmd.Parameters.AddWithValue("@description", request.Description ?? ""); cmd.Parameters.AddWithValue("@price", request.Price); cmd.Parameters.AddWithValue("@category", string.IsNullOrWhiteSpace(request.Category) ? "Khác" : request.Category); cmd.Parameters.AddWithValue("@status", request.Status == "out_of_stock" ? "out_of_stock" : "active"); cmd.Parameters.AddWithValue("@image", (object?)request.Image ?? DBNull.Value);
        await using var reader = await cmd.ExecuteReaderAsync(); await reader.ReadAsync();
        return new SellerProductItem { Id=reader.GetInt32(0),Name=reader.GetString(1),Price=reader.GetDecimal(2),Category=reader.GetString(3),Status=reader.GetString(4),Image=reader.IsDBNull(5)?null:reader.GetString(5),Description=reader.GetString(6) };
    }

    public async Task<SellerProductItem> CreateComboAsync(string sellerCode, CreateSellerProductRequest request)
    {
        await using var cn = new SqlConnection(_cs); await cn.OpenAsync();
        const string sql = "DECLARE @restaurantId INT,@restaurantCode NVARCHAR(40); SELECT TOP 1 @restaurantId=r.RestaurantId,@restaurantCode=r.RestaurantCode FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode; IF @restaurantId IS NULL THROW 50001,'Seller not found',1; INSERT INTO dbo.Combos (ComboCode,RestaurantId,Name,Description,Price,Category,ProductStatus,StockQuantity,ImageUrl) OUTPUT INSERTED.ComboId,INSERTED.Name,INSERTED.Price,INSERTED.Category,INSERTED.ProductStatus,INSERTED.ImageUrl,COALESCE(INSERTED.Description,N'') VALUES (CONCAT(@restaurantCode,N'-C',RIGHT(REPLACE(CONVERT(NVARCHAR(36),NEWID()),N'-',N''),10)),@restaurantId,@name,@description,@price,@category,@status,0,@image);";
        await using var cmd = new SqlCommand(sql,cn); cmd.Parameters.AddWithValue("@sellerCode",sellerCode); cmd.Parameters.AddWithValue("@name",request.Name.Trim()); cmd.Parameters.AddWithValue("@description",request.Description??""); cmd.Parameters.AddWithValue("@price",request.Price); cmd.Parameters.AddWithValue("@category",request.Category); cmd.Parameters.AddWithValue("@status",request.Status=="out_of_stock"?"out_of_stock":"active"); cmd.Parameters.AddWithValue("@image",(object?)request.Image??DBNull.Value);
        await using var reader=await cmd.ExecuteReaderAsync(); await reader.ReadAsync(); return new SellerProductItem { Id=reader.GetInt32(0),Name=reader.GetString(1),Price=reader.GetDecimal(2),Category=reader.GetString(3),Status=reader.GetString(4),Type="combo",Image=reader.IsDBNull(5)?null:reader.GetString(5),Description=reader.GetString(6) };
    }

    public async Task<SellerShopInfoViewModel?> GetShopInfoAsync(string sellerCode)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        const string sql="SELECT TOP 1 r.Name,COALESCE(r.Description,N''),COALESCE(r.Phone,N''),COALESCE(r.Email,N''),COALESCE(r.Address,N''),COALESCE(r.OpeningHours,N''),r.LogoUrl,COALESCE(r.Rating,0),COALESCE(r.RatingCount,0),COUNT(o.OrderId),COALESCE(CAST(100.0*SUM(CASE WHEN o.Status IN (N'completed',N'delivered') THEN 1 ELSE 0 END)/NULLIF(COUNT(o.OrderId),0) AS decimal(5,2)),0) FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId LEFT JOIN dbo.Orders o ON o.RestaurantId=r.RestaurantId WHERE s.SellerCode=@code GROUP BY r.Name,r.Description,r.Phone,r.Email,r.Address,r.OpeningHours,r.LogoUrl,r.Rating,r.RatingCount";
        await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",sellerCode);await using var rd=await cmd.ExecuteReaderAsync();if(!await rd.ReadAsync())return null;return new SellerShopInfoViewModel{Name=rd.GetString(0),Description=rd.GetString(1),Phone=rd.GetString(2),Email=rd.GetString(3),Address=rd.GetString(4),OpeningHours=rd.GetString(5),LogoUrl=rd.IsDBNull(6)?null:rd.GetString(6),Rating=rd.GetDecimal(7),RatingCount=rd.GetInt32(8),TotalOrders=rd.GetInt32(9),CompletionRate=rd.GetDecimal(10)};
    }
    public async Task UpdateShopInfoAsync(string sellerCode,UpdateSellerShopRequest r){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE x SET Name=@name,Description=@description,Phone=@phone,Email=@email,Address=@address,OpeningHours=@hours,LogoUrl=@logo FROM dbo.Restaurants x JOIN dbo.Sellers s ON s.SellerId=x.SellerId WHERE s.SellerCode=@code; UPDATE dbo.Sellers SET Email=@email,Phone=@phone WHERE SellerCode=@code;";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",sellerCode);cmd.Parameters.AddWithValue("@name",r.Name);cmd.Parameters.AddWithValue("@description",r.Description??"");cmd.Parameters.AddWithValue("@phone",r.Phone??"");cmd.Parameters.AddWithValue("@email",r.Email??"");cmd.Parameters.AddWithValue("@address",r.Address??"");cmd.Parameters.AddWithValue("@hours",r.OpeningHours??"");cmd.Parameters.AddWithValue("@logo",(object?)r.LogoUrl??DBNull.Value);await cmd.ExecuteNonQueryAsync();}
    public async Task<bool> GetRestaurantActiveAsync(string sellerCode){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("SELECT TOP 1 IsActive,AutoActivityByHours,COALESCE(OpeningHours,N'') FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);await using var rd=await cmd.ExecuteReaderAsync();if(!await rd.ReadAsync())return false;var active=rd.GetBoolean(0);if(!rd.GetBoolean(1))return active;var parts=rd.GetString(2).Split('-',StringSplitOptions.TrimEntries);if(parts.Length!=2||!TimeOnly.TryParse(parts[0],out var start)||!TimeOnly.TryParse(parts[1],out var end))return active;var now=TimeOnly.FromDateTime(DateTime.Now);var shouldBeActive=start<=end?now>=start&&now<=end:now>=start||now<=end;await rd.CloseAsync();await using var update=new SqlCommand("UPDATE r SET IsActive=@active FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);update.Parameters.AddWithValue("@active",shouldBeActive);update.Parameters.AddWithValue("@code",sellerCode);await update.ExecuteNonQueryAsync();return shouldBeActive;}
    public async Task SetRestaurantActiveAsync(string sellerCode,bool active){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("UPDATE r SET IsActive=@active FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);cmd.Parameters.AddWithValue("@active",active);await cmd.ExecuteNonQueryAsync();}
    public async Task<List<SellerPromotionItem>> GetPromotionsAsync(string code,bool trash=false){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();var sql="DELETE FROM dbo.Promotions WHERE IsDeleted=1 AND DeletedAt<DATEADD(day,-30,GETDATE()); SELECT p.PromotionId,p.PromotionCode,p.Title,COALESCE(p.Description,N''),p.DiscountType,p.DiscountValue,p.MinimumOrderAmount,p.MaximumDiscountAmount,p.UsageLimit,p.UsageCount,p.StartAt,p.EndAt,p.IsDeleted,p.DeletedAt FROM dbo.Promotions p JOIN dbo.Restaurants r ON r.RestaurantId=p.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code AND p.IsDeleted=@trash ORDER BY p.PromotionId DESC;";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",code);cmd.Parameters.AddWithValue("@trash",trash);await using var rd=await cmd.ExecuteReaderAsync();while(await rd.NextResultAsync()){}var list=new List<SellerPromotionItem>();while(await rd.ReadAsync())list.Add(new SellerPromotionItem{Id=rd.GetInt32(0),Code=rd.GetString(1),Title=rd.GetString(2),Description=rd.GetString(3),DiscountType=rd.GetString(4),Discount=rd.GetDecimal(5),MinOrder=rd.GetDecimal(6),MaxDiscount=rd.GetDecimal(7),UsageLimit=rd.GetInt32(8),UsedCount=rd.GetInt32(9),StartAt=rd.GetDateTime(10),EndAt=rd.GetDateTime(11),IsDeleted=rd.GetBoolean(12),DeletedAt=rd.IsDBNull(13)?null:rd.GetDateTime(13)});return list;}
    public async Task CreatePromotionAsync(string code,CreateSellerPromotionRequest r){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="DECLARE @id INT;SELECT TOP 1 @id=x.RestaurantId FROM dbo.Restaurants x JOIN dbo.Sellers s ON s.SellerId=x.SellerId WHERE s.SellerCode=@seller; INSERT dbo.Promotions(PromotionCode,RestaurantId,Title,Description,DiscountType,DiscountValue,MinimumOrderAmount,MaximumDiscountAmount,UsageLimit,UsageCount,StartAt,EndAt,PromotionStatus,AppliesTo,IsDeleted,CreatedAt) VALUES(@code,@id,@title,@desc,@type,@discount,@min,@max,@limit,0,@start,@end,N'active',N'all',0,SYSDATETIME());";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",code);cmd.Parameters.AddWithValue("@code",r.Code.ToUpper());cmd.Parameters.AddWithValue("@title",r.Title??r.Code);cmd.Parameters.AddWithValue("@desc",r.Description??"");cmd.Parameters.AddWithValue("@type",r.DiscountType);cmd.Parameters.AddWithValue("@discount",r.Discount);cmd.Parameters.AddWithValue("@min",r.MinOrder);cmd.Parameters.AddWithValue("@max",r.MaxDiscount);cmd.Parameters.AddWithValue("@limit",r.UsageLimit);cmd.Parameters.AddWithValue("@start",r.StartAt);cmd.Parameters.AddWithValue("@end",r.EndAt);await cmd.ExecuteNonQueryAsync();}
    public async Task SetPromotionDeletedAsync(string seller,int id,bool deleted){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE p SET IsDeleted=@deleted,DeletedAt=CASE WHEN @deleted=1 THEN SYSDATETIME() ELSE NULL END FROM dbo.Promotions p JOIN dbo.Restaurants r ON r.RestaurantId=p.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@seller AND p.PromotionId=@id";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@id",id);cmd.Parameters.AddWithValue("@deleted",deleted);await cmd.ExecuteNonQueryAsync();}
    public async Task<List<SellerChatParticipant>> GetChatParticipantsAsync(string sellerCode,string type){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();var sql=type=="shipper"?"SELECT DISTINCT CONCAT(N's-',sh.ShipperId),sh.FullName,o.OrderCode,COALESCE((SELECT TOP 1 m.Content FROM dbo.ShipperConversations c JOIN dbo.ShipperMessages m ON m.ShipperConversationId=c.ShipperConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),N''),COALESCE((SELECT TOP 1 m.SentAt FROM dbo.ShipperConversations c JOIN dbo.ShipperMessages m ON m.ShipperConversationId=c.ShipperConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),o.OrderedAt) FROM dbo.Orders o JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId JOIN dbo.Shippers sh ON sh.ShipperId=o.ShipperId WHERE s.SellerCode=@code AND o.ShipperId IS NOT NULL":"SELECT DISTINCT CONCAT(N'c-',cu.CustomerId),cu.FullName,o.OrderCode,COALESCE((SELECT TOP 1 m.Content FROM dbo.Conversations c JOIN dbo.Messages m ON m.ConversationId=c.ConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),N''),COALESCE((SELECT TOP 1 m.SentAt FROM dbo.Conversations c JOIN dbo.Messages m ON m.ConversationId=c.ConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),o.OrderedAt) FROM dbo.Orders o JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId JOIN dbo.Customers cu ON cu.CustomerId=o.CustomerId WHERE s.SellerCode=@code";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",sellerCode);await using var rd=await cmd.ExecuteReaderAsync();var list=new List<SellerChatParticipant>();while(await rd.ReadAsync())list.Add(new SellerChatParticipant{Id=rd.GetString(0),Name=rd.GetString(1),Type=type,OrderCode=rd.GetString(2),LastMessage=rd.GetString(3),LastMessageAt=rd.GetDateTime(4)});return list;}
    public async Task<bool> GetAutoActivityAsync(string sellerCode){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("SELECT TOP 1 AutoActivityByHours FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);return Convert.ToBoolean(await cmd.ExecuteScalarAsync()??false);}
    public async Task SetAutoActivityAsync(string sellerCode,bool value){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("UPDATE r SET AutoActivityByHours=@value FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);cmd.Parameters.AddWithValue("@value",value);await cmd.ExecuteNonQueryAsync();}
    private static List<SellerRevenuePoint> EmptyHours() => Enumerable.Range(0, 24).Select(hour => new SellerRevenuePoint { Time = $"{hour:00}:00", Revenue = 0 }).ToList();
}
