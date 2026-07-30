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
                    Id = id.ToString(), OrderCode = reader.GetString(1), Status = reader.GetString(2) == "handed_over" ? "shipping" : reader.GetString(2), PaymentMethod = reader.GetString(3),
                    DeliveryAddress = reader.GetString(4), Note = reader.GetString(5) == "0" ? "" : reader.GetString(5), Total = reader.GetDecimal(6), OrderedAt = reader.GetDateTime(7),
                    CustomerName = reader.GetString(8), CustomerPhone = reader.GetString(9), ShipperName = reader.IsDBNull(10) ? null : reader.GetString(10)
                });
            }
            if (!reader.IsDBNull(11)) result[index].Items.Add(new SellerOrderLineItem { Id = reader.GetInt32(11).ToString(), ProductName = reader.GetString(12), Price = reader.GetDecimal(13), Quantity = reader.GetInt32(14) });
        }
        const string comboSql = "SELECT c.ComboId,c.Name,c.Price,COALESCE(c.Category,N'Khác'),COALESCE(c.ProductStatus,N'active'),c.ImageUrl,COALESCE(c.Description,N'') FROM dbo.Combos c JOIN dbo.Restaurants r ON r.RestaurantId=c.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode AND c.DeletedAt IS NULL";
        return result;
    }

    public async Task<bool> UpdateSellerOrderStatusAsync(string sellerCode, int orderId, string nextStatus)
    {
        var expectedStatus = nextStatus switch
        {
            "confirmed" => "pending",
            "shipping"  => "confirmed",
            "ready"     => "arrived",   // Seller bấm "Giao hàng" khi shipper đã tới (arrived -> handed_over)
            "cancelled" => "pending",
            _ => null
        };
        var actualNextStatus = nextStatus == "ready" ? "handed_over" : nextStatus;
        if (expectedStatus is null) return false;

        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            UPDATE o
            SET o.Status=@nextStatus,o.UpdatedAt=SYSDATETIME()
            FROM dbo.Orders o
            JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId
            JOIN dbo.Sellers s ON s.SellerId=r.SellerId
            WHERE o.OrderId=@orderId
              AND s.SellerCode=@sellerCode
              AND o.Status=@expectedStatus;
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@nextStatus", actualNextStatus);
        cmd.Parameters.AddWithValue("@expectedStatus", expectedStatus);
        cmd.Parameters.AddWithValue("@orderId", orderId);
        cmd.Parameters.AddWithValue("@sellerCode", sellerCode);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<List<ShipperOrderViewModel>> GetShipperOrdersAsync(string phone)
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            DECLARE @shipperId INT=(SELECT TOP 1 ShipperId FROM dbo.Shippers WHERE Phone=@phone);
            SELECT o.OrderId,o.OrderCode,r.Name,COALESCE(r.Phone,N''),COALESCE(r.Address,N''),
                   c.FullName,c.Phone,o.DeliveryAddress,
                   COALESCE((SELECT STRING_AGG(CONCAT(i.ProductNameSnapshot,N' x',i.Quantity),N', ') FROM dbo.OrderItems i WHERE i.OrderId=o.OrderId),N''),
                   o.TotalAmount,COALESCE(o.ShippingFee,0),o.Status,o.OrderedAt,
                   CASE WHEN o.CustomerNote=N'0' THEN N'' ELSE o.CustomerNote END,
                   CONVERT(bit,CASE WHEN o.ShipperId=@shipperId THEN 1 ELSE 0 END)
            FROM dbo.Orders o
            JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId
            JOIN dbo.Customers c ON c.CustomerId=o.CustomerId
            WHERE (o.Status=N'confirmed' AND o.ShipperId IS NULL)
               OR (o.ShipperId=@shipperId AND o.Status IN (N'confirmed',N'arrived',N'handed_over',N'shipping',N'completed',N'cancelled'))
            ORDER BY o.OrderedAt DESC,o.OrderId DESC;
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@phone", phone);
        await using var reader = await cmd.ExecuteReaderAsync();
        var result = new List<ShipperOrderViewModel>();
        while (await reader.ReadAsync())
            result.Add(new ShipperOrderViewModel
            {
                Id=reader.GetInt32(0).ToString(),Code=reader.GetString(1),SenderName=reader.GetString(2),
                SenderPhone=reader.GetString(3),SenderAddress=reader.GetString(4),ReceiverName=reader.GetString(5),
                ReceiverPhone=reader.GetString(6),ReceiverAddress=reader.GetString(7),Items=reader.GetString(8),
                Cod=reader.GetDecimal(9),ShippingFee=reader.GetDecimal(10),Status=reader.GetString(11),
                CreatedAt=reader.GetDateTime(12),Note=reader.GetString(13),AssignedToMe=reader.GetBoolean(14)
            });
        return result;
    }

    public async Task<bool> AcceptShipperOrderAsync(int orderId, string phone)
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            DECLARE @shipperId INT=(SELECT TOP 1 ShipperId FROM dbo.Shippers WHERE Phone=@phone);
            IF @shipperId IS NULL RETURN;
            IF EXISTS(SELECT 1 FROM dbo.Orders WHERE ShipperId=@shipperId AND Status IN(N'confirmed',N'arrived',N'shipping')) RETURN;
            UPDATE dbo.Orders
            SET ShipperId=@shipperId,
                ShipperCodeSnapshot=(SELECT ShipperCode FROM dbo.Shippers WHERE ShipperId=@shipperId),
                UpdatedAt=SYSDATETIME()
            WHERE OrderId=@orderId AND Status=N'confirmed' AND ShipperId IS NULL;
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@orderId", orderId);
        cmd.Parameters.AddWithValue("@phone", phone);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<bool> UpdateShipperOrderStatusAsync(int orderId, string phone, string nextStatus)
    {
        // Map frontend status -> DB status / expected DB status
        // arrived: shipper tới quán (confirmed -> arrived)
        // delivering: shipper đã nhận hàng, bắt đầu giao (arrived -> shipping)
        // delivered: giao thành công (shipping -> completed)
        // cancelled: huỷ (shipping -> cancelled)
        var sqlStatus = nextStatus switch
        {
            "arrived"   => "arrived",
            "delivering" => "shipping",
            "delivered"  => "completed",
            "cancelled"  => "cancelled",
            _ => null
        };
        var expected = nextStatus switch
        {
            "arrived"    => "confirmed",
            "delivering" => "handed_over",
            "delivered"  => "shipping",
            "cancelled"  => "shipping",
            _ => null
        };
        if (sqlStatus is null || expected is null) return false;
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            UPDATE o SET Status=@next,UpdatedAt=SYSDATETIME()
            FROM dbo.Orders o JOIN dbo.Shippers sh ON sh.ShipperId=o.ShipperId
            WHERE o.OrderId=@orderId AND sh.Phone=@phone AND o.Status=@expected;
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@next", sqlStatus);
        cmd.Parameters.AddWithValue("@expected", expected);
        cmd.Parameters.AddWithValue("@orderId", orderId);
        cmd.Parameters.AddWithValue("@phone", phone);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<List<SellerProductItem>> GetProductsAsync(string sellerCode = "SL-BT-0001")
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string sql = """
            SELECT m.MenuItemId,m.Name,m.Price,COALESCE(m.Category,N'Khác'),COALESCE(m.ProductStatus,N'active'),m.ImageUrl,COALESCE(m.Description,N''),COALESCE(m.ToppingsJson,N'[]')
            FROM dbo.MenuItems m JOIN dbo.Restaurants r ON r.RestaurantId=m.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId
            WHERE s.SellerCode=@sellerCode AND m.DeletedAt IS NULL ORDER BY m.MenuItemId DESC;
            """;
        await using var cmd = new SqlCommand(sql, cn); cmd.Parameters.AddWithValue("@sellerCode", sellerCode);
        await using var reader = await cmd.ExecuteReaderAsync(); var result = new List<SellerProductItem>();
        while (await reader.ReadAsync()) result.Add(new SellerProductItem { Id=reader.GetInt32(0), Name=reader.GetString(1), Price=reader.GetDecimal(2), Category=reader.GetString(3), Status=reader.GetString(4), Image=reader.IsDBNull(5)?null:reader.GetString(5), Description=reader.GetString(6), ToppingsJson=reader.GetString(7) });
        await reader.CloseAsync();
        const string comboListSql = "SELECT c.ComboId,c.Name,c.Price,COALESCE(c.Category,N'Khác'),COALESCE(c.ProductStatus,N'active'),c.ImageUrl,COALESCE(c.Description,N'') FROM dbo.Combos c JOIN dbo.Restaurants r ON r.RestaurantId=c.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@sellerCode AND c.DeletedAt IS NULL";
        await using var comboListCmd=new SqlCommand(comboListSql,cn); comboListCmd.Parameters.AddWithValue("@sellerCode",sellerCode); await using var cr=await comboListCmd.ExecuteReaderAsync(); while(await cr.ReadAsync()) result.Add(new SellerProductItem { Id=cr.GetInt32(0),Name=cr.GetString(1),Price=cr.GetDecimal(2),Category=cr.GetString(3),Status=cr.GetString(4),Type="combo",Image=cr.IsDBNull(5)?null:cr.GetString(5),Description=cr.GetString(6) });
        return result;
    }

    public async Task<PublicCatalogViewModel> GetPublicCatalogAsync()
    {
        await using var cn = new SqlConnection(_cs);
        await cn.OpenAsync();
        const string shopSql = """
            SELECT r.RestaurantId,r.RestaurantCode,r.Name,r.LogoUrl,COALESCE(r.Address,N''),
                   COALESCE(r.Rating,0),COALESCE(r.RatingCount,0),r.IsActive
            FROM dbo.Restaurants r
            WHERE r.IsActive=1
              AND EXISTS (
                SELECT 1 FROM dbo.Sellers s
                JOIN dbo.UserAccounts u ON u.AccountCode=s.SellerCode OR u.AccountCode LIKE s.SellerCode+N'-%'
                WHERE s.SellerId=r.SellerId AND u.AccountRole=N'seller'
                  AND u.AccountStatus=N'active' AND u.PasswordHash<>N'0'
              )
              AND EXISTS (
                SELECT 1 FROM dbo.MenuItems m
                WHERE m.RestaurantId=r.RestaurantId AND m.DeletedAt IS NULL
                  AND m.IsAvailable=1 AND m.ProductStatus=N'active'
              )
            ORDER BY r.Rating DESC,r.RestaurantId DESC;
            """;
        var shops = new List<PublicShopItem>();
        await using (var cmd = new SqlCommand(shopSql, cn))
        await using (var rd = await cmd.ExecuteReaderAsync())
            while (await rd.ReadAsync())
                shops.Add(new PublicShopItem {
                    Id=rd.GetInt32(0), Code=rd.GetString(1), Name=rd.GetString(2),
                    LogoUrl=rd.IsDBNull(3)?null:rd.GetString(3), Address=rd.GetString(4),
                    Rating=rd.GetDecimal(5), RatingCount=rd.GetInt32(6), IsActive=rd.GetBoolean(7)
                });

        const string productSql = """
            SELECT m.MenuItemId,m.Name,m.Price,COALESCE(m.Category,N'Khác'),
                   COALESCE(m.Description,N''),m.ImageUrl,r.RestaurantId,r.Name,r.LogoUrl,
                   COALESCE(r.Rating,0),COALESCE(m.ToppingsJson,N'[]')
            FROM dbo.MenuItems m
            JOIN dbo.Restaurants r ON r.RestaurantId=m.RestaurantId
            WHERE r.IsActive=1 AND m.DeletedAt IS NULL
              AND m.IsAvailable=1 AND m.ProductStatus=N'active'
              AND EXISTS (
                SELECT 1 FROM dbo.Sellers s
                JOIN dbo.UserAccounts u ON u.AccountCode=s.SellerCode OR u.AccountCode LIKE s.SellerCode+N'-%'
                WHERE s.SellerId=r.SellerId AND u.AccountRole=N'seller'
                  AND u.AccountStatus=N'active' AND u.PasswordHash<>N'0'
              )
            ORDER BY m.MenuItemId DESC;
            """;
        var products = new List<PublicProductItem>();
        await using (var cmd = new SqlCommand(productSql, cn))
        await using (var rd = await cmd.ExecuteReaderAsync())
            while (await rd.ReadAsync())
                products.Add(new PublicProductItem {
                    Id=rd.GetInt32(0), Name=rd.GetString(1), Price=rd.GetDecimal(2),
                    Category=rd.GetString(3), Description=rd.GetString(4),
                    ImageUrl=rd.IsDBNull(5)?null:rd.GetString(5), ShopId=rd.GetInt32(6),
                    ShopName=rd.GetString(7), ShopLogoUrl=rd.IsDBNull(8)?null:rd.GetString(8),
                    ShopRating=rd.GetDecimal(9), ToppingsJson=rd.GetString(10)
                });
        return new PublicCatalogViewModel { Shops=shops, Products=products };
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
            OUTPUT INSERTED.MenuItemId,INSERTED.Name,INSERTED.Price,INSERTED.Category,INSERTED.ProductStatus,INSERTED.ImageUrl,COALESCE(INSERTED.Description,N''),COALESCE(INSERTED.ToppingsJson,N'[]')
            VALUES (@code,@restaurantId,@name,@description,@price,@toppings,CASE WHEN @status=N'active' THEN 1 ELSE 0 END,@category,@status,0,@image);
            """;
        await using var cmd = new SqlCommand(sql, cn);
        cmd.Parameters.AddWithValue("@sellerCode", sellerCode); cmd.Parameters.AddWithValue("@name", request.Name.Trim()); cmd.Parameters.AddWithValue("@description", request.Description ?? ""); cmd.Parameters.AddWithValue("@price", request.Price); cmd.Parameters.AddWithValue("@category", string.IsNullOrWhiteSpace(request.Category) ? "Khác" : request.Category); cmd.Parameters.AddWithValue("@status", request.Status == "out_of_stock" ? "out_of_stock" : "active"); cmd.Parameters.AddWithValue("@image", (object?)request.Image ?? DBNull.Value); cmd.Parameters.AddWithValue("@toppings", request.ToppingsJson ?? "[]");
        await using var reader = await cmd.ExecuteReaderAsync(); await reader.ReadAsync();
        return new SellerProductItem { Id=reader.GetInt32(0),Name=reader.GetString(1),Price=reader.GetDecimal(2),Category=reader.GetString(3),Status=reader.GetString(4),Image=reader.IsDBNull(5)?null:reader.GetString(5),Description=reader.GetString(6),ToppingsJson=reader.GetString(7) };
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
    public async Task<List<SellerPromotionItem>> GetPromotionsAsync(string code,bool trash=false)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        await using (var cleanup=new SqlCommand("DELETE FROM dbo.Promotions WHERE IsDeleted=1 AND DeletedAt<DATEADD(day,-30,SYSDATETIME());",cn))
            await cleanup.ExecuteNonQueryAsync();
        const string sql="SELECT p.PromotionId,p.PromotionCode,p.Title,COALESCE(p.Description,N''),p.DiscountType,p.DiscountValue,p.MinimumOrderAmount,p.MaximumDiscountAmount,p.UsageLimit,p.UsageCount,p.StartAt,p.EndAt,p.IsDeleted,p.DeletedAt FROM dbo.Promotions p JOIN dbo.Restaurants r ON r.RestaurantId=p.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code AND p.IsDeleted=@trash ORDER BY p.PromotionId DESC;";
        await using var cmd=new SqlCommand(sql,cn); cmd.Parameters.AddWithValue("@code",code); cmd.Parameters.AddWithValue("@trash",trash);
        await using var rd=await cmd.ExecuteReaderAsync(); var list=new List<SellerPromotionItem>();
        while(await rd.ReadAsync()) list.Add(new SellerPromotionItem{Id=rd.GetInt32(0),Code=rd.GetString(1),Title=rd.GetString(2),Description=rd.GetString(3),DiscountType=rd.GetString(4)=="amount"?"fixed":rd.GetString(4),Discount=rd.GetDecimal(5),MinOrder=rd.GetDecimal(6),MaxDiscount=rd.GetDecimal(7),UsageLimit=rd.GetInt32(8),UsedCount=rd.GetInt32(9),StartAt=rd.IsDBNull(10)?DateTime.Today:rd.GetDateTime(10),EndAt=rd.IsDBNull(11)?DateTime.Today:rd.GetDateTime(11),IsDeleted=rd.GetBoolean(12),DeletedAt=rd.IsDBNull(13)?null:rd.GetDateTime(13)});
        return list;
    }
    public async Task CreatePromotionAsync(string code,CreateSellerPromotionRequest r)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        const string sql="DECLARE @id INT;SELECT TOP 1 @id=x.RestaurantId FROM dbo.Restaurants x JOIN dbo.Sellers s ON s.SellerId=x.SellerId WHERE s.SellerCode=@seller; IF @id IS NULL THROW 50001,N'Không tìm thấy quán.',1; INSERT dbo.Promotions(PromotionCode,RestaurantId,Title,Description,DiscountType,DiscountValue,MinimumOrderAmount,MaximumDiscountAmount,UsageLimit,UsageCount,StartAt,EndAt,PromotionStatus,AppliesTo,IsDeleted,CreatedAt) VALUES(@code,@id,@title,@desc,@type,@discount,0,0,@limit,0,@start,@end,N'active',N'all_menu',0,SYSDATETIME());";
        await using var cmd=new SqlCommand(sql,cn); AddPromotionParameters(cmd,code,r); await cmd.ExecuteNonQueryAsync();
    }
    public async Task UpdatePromotionAsync(string code,int id,CreateSellerPromotionRequest r)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        const string sql="UPDATE p SET PromotionCode=@code,Title=@title,Description=@desc,DiscountType=@type,DiscountValue=@discount,MinimumOrderAmount=0,MaximumDiscountAmount=0,UsageLimit=@limit,StartAt=@start,EndAt=@end,PromotionStatus=CASE WHEN @start>SYSDATETIME() THEN N'upcoming' WHEN @end<SYSDATETIME() THEN N'expired' ELSE N'active' END FROM dbo.Promotions p JOIN dbo.Restaurants x ON x.RestaurantId=p.RestaurantId JOIN dbo.Sellers s ON s.SellerId=x.SellerId WHERE p.PromotionId=@id AND s.SellerCode=@seller AND p.IsDeleted=0;";
        await using var cmd=new SqlCommand(sql,cn); AddPromotionParameters(cmd,code,r); cmd.Parameters.AddWithValue("@id",id); await cmd.ExecuteNonQueryAsync();
    }
    private static void AddPromotionParameters(SqlCommand cmd,string seller,CreateSellerPromotionRequest r)
    {
        cmd.Parameters.AddWithValue("@seller",seller); cmd.Parameters.AddWithValue("@code",r.Code.Trim().ToUpperInvariant());
        cmd.Parameters.AddWithValue("@title",string.IsNullOrWhiteSpace(r.Title)?r.Code.Trim().ToUpperInvariant():r.Title);
        cmd.Parameters.AddWithValue("@desc",r.Description??""); cmd.Parameters.AddWithValue("@type",r.DiscountType=="fixed"?"amount":r.DiscountType);
        cmd.Parameters.AddWithValue("@discount",r.Discount); cmd.Parameters.AddWithValue("@limit",r.UsageLimit);
        cmd.Parameters.AddWithValue("@start",r.StartAt); cmd.Parameters.AddWithValue("@end",r.EndAt);
    }
    public async Task SetPromotionDeletedAsync(string seller,int id,bool deleted){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE p SET IsDeleted=@deleted,DeletedAt=CASE WHEN @deleted=1 THEN SYSDATETIME() ELSE NULL END FROM dbo.Promotions p JOIN dbo.Restaurants r ON r.RestaurantId=p.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@seller AND p.PromotionId=@id";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@id",id);cmd.Parameters.AddWithValue("@deleted",deleted);await cmd.ExecuteNonQueryAsync();}
    public async Task<PublicPromotionItem?> FindActivePromotionAsync(string code)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        const string sql="SELECT TOP 1 p.PromotionId,p.PromotionCode,p.DiscountType,p.DiscountValue,r.RestaurantId,r.Name FROM dbo.Promotions p JOIN dbo.Restaurants r ON r.RestaurantId=p.RestaurantId WHERE p.PromotionCode=@code AND p.IsDeleted=0 AND p.StartAt<=SYSDATETIME() AND p.EndAt>=SYSDATETIME() AND p.UsageCount<p.UsageLimit AND r.IsActive=1;";
        await using var cmd=new SqlCommand(sql,cn); cmd.Parameters.AddWithValue("@code",code.Trim().ToUpperInvariant());
        await using var rd=await cmd.ExecuteReaderAsync(); if(!await rd.ReadAsync()) return null;
        return new PublicPromotionItem{Id=rd.GetInt32(0),Code=rd.GetString(1),DiscountType=rd.GetString(2)=="amount"?"fixed":rd.GetString(2),Discount=rd.GetDecimal(3),RestaurantId=rd.GetInt32(4),RestaurantName=rd.GetString(5)};
    }
    public async Task<List<SellerChatParticipant>> GetChatParticipantsAsync(string sellerCode,string type){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();var sql=type=="shipper"?"SELECT DISTINCT CONCAT(N's-',sh.ShipperId),sh.FullName,o.OrderCode,COALESCE((SELECT TOP 1 m.Content FROM dbo.ShipperConversations c JOIN dbo.ShipperMessages m ON m.ShipperConversationId=c.ShipperConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),N''),COALESCE((SELECT TOP 1 m.SentAt FROM dbo.ShipperConversations c JOIN dbo.ShipperMessages m ON m.ShipperConversationId=c.ShipperConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),o.OrderedAt) FROM dbo.Orders o JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId JOIN dbo.Shippers sh ON sh.ShipperId=o.ShipperId WHERE s.SellerCode=@code AND o.ShipperId IS NOT NULL":"SELECT DISTINCT CONCAT(N'c-',cu.CustomerId),cu.FullName,o.OrderCode,COALESCE((SELECT TOP 1 m.Content FROM dbo.Conversations c JOIN dbo.Messages m ON m.ConversationId=c.ConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),N''),COALESCE((SELECT TOP 1 m.SentAt FROM dbo.Conversations c JOIN dbo.Messages m ON m.ConversationId=c.ConversationId WHERE c.OrderId=o.OrderId ORDER BY m.SentAt DESC),o.OrderedAt) FROM dbo.Orders o JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId JOIN dbo.Customers cu ON cu.CustomerId=o.CustomerId WHERE s.SellerCode=@code";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",sellerCode);await using var rd=await cmd.ExecuteReaderAsync();var list=new List<SellerChatParticipant>();while(await rd.ReadAsync())list.Add(new SellerChatParticipant{Id=rd.GetString(0),Name=rd.GetString(1),Type=type,OrderCode=rd.GetString(2),LastMessage=rd.GetString(3),LastMessageAt=rd.GetDateTime(4)});return list;}
    public async Task<bool> GetAutoActivityAsync(string sellerCode){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("SELECT TOP 1 AutoActivityByHours FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);return Convert.ToBoolean(await cmd.ExecuteScalarAsync()??false);}
    public async Task SetAutoActivityAsync(string sellerCode,bool value){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();await using var cmd=new SqlCommand("UPDATE r SET AutoActivityByHours=@value FROM dbo.Restaurants r JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@code",cn);cmd.Parameters.AddWithValue("@code",sellerCode);cmd.Parameters.AddWithValue("@value",value);await cmd.ExecuteNonQueryAsync();}
    public async Task<List<SellerCategoryItem>> GetCategoriesAsync(string seller){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="SELECT c.CategoryId,c.Name FROM dbo.SellerProductCategories c JOIN dbo.Sellers s ON s.SellerId=c.SellerId WHERE s.SellerCode=@seller AND c.DeletedAt IS NULL ORDER BY c.Name";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);await using var rd=await cmd.ExecuteReaderAsync();var r=new List<SellerCategoryItem>();while(await rd.ReadAsync())r.Add(new SellerCategoryItem{Id=rd.GetInt32(0),Name=rd.GetString(1)});return r;}
    public async Task AddCategoryAsync(string seller,string name){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="INSERT dbo.SellerProductCategories(SellerId,Name) SELECT SellerId,@name FROM dbo.Sellers WHERE SellerCode=@seller";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@name",name.Trim());await cmd.ExecuteNonQueryAsync();}
    public async Task SetCategoryDeletedAsync(string seller,int id,bool deleted){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE c SET DeletedAt=CASE WHEN @deleted=1 THEN SYSDATETIME() ELSE NULL END FROM dbo.SellerProductCategories c JOIN dbo.Sellers s ON s.SellerId=c.SellerId WHERE s.SellerCode=@seller AND c.CategoryId=@id";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@id",id);cmd.Parameters.AddWithValue("@deleted",deleted);await cmd.ExecuteNonQueryAsync();}
    public async Task SetCategoryDeletedByNameAsync(string seller,string name){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE c SET DeletedAt=SYSDATETIME() FROM dbo.SellerProductCategories c JOIN dbo.Sellers s ON s.SellerId=c.SellerId WHERE s.SellerCode=@seller AND c.Name=@name";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@name",name);await cmd.ExecuteNonQueryAsync();}
    public async Task UpdateProductAsync(string seller,int id,CreateSellerProductRequest r){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE m SET Name=@name,Description=@description,Price=@price,Category=@category,ProductStatus=@status,IsAvailable=CASE WHEN @status=N'active' THEN 1 ELSE 0 END,ImageUrl=@image,ToppingsJson=@toppings FROM dbo.MenuItems m JOIN dbo.Restaurants x ON x.RestaurantId=m.RestaurantId JOIN dbo.Sellers s ON s.SellerId=x.SellerId WHERE s.SellerCode=@seller AND m.MenuItemId=@id";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@id",id);cmd.Parameters.AddWithValue("@name",r.Name);cmd.Parameters.AddWithValue("@description",r.Description??"");cmd.Parameters.AddWithValue("@price",r.Price);cmd.Parameters.AddWithValue("@category",r.Category);cmd.Parameters.AddWithValue("@status",r.Status);cmd.Parameters.AddWithValue("@image",(object?)r.Image??DBNull.Value);cmd.Parameters.AddWithValue("@toppings",r.ToppingsJson??"[]");await cmd.ExecuteNonQueryAsync();}
    public async Task SetProductDeletedAsync(string seller,int id,bool deleted){await using var cn=new SqlConnection(_cs);await cn.OpenAsync();const string sql="UPDATE m SET DeletedAt=CASE WHEN @deleted=1 THEN SYSDATETIME() ELSE NULL END FROM dbo.MenuItems m JOIN dbo.Restaurants r ON r.RestaurantId=m.RestaurantId JOIN dbo.Sellers s ON s.SellerId=r.SellerId WHERE s.SellerCode=@seller AND m.MenuItemId=@id";await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@seller",seller);cmd.Parameters.AddWithValue("@id",id);cmd.Parameters.AddWithValue("@deleted",deleted);await cmd.ExecuteNonQueryAsync();}
    public async Task<List<string>> CreateCustomerOrdersAsync(CreateCustomerOrderRequest request)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        await using var tx=await cn.BeginTransactionAsync();
        try
        {
            const string customerSql="IF EXISTS(SELECT 1 FROM dbo.Customers WHERE Phone=@phone) UPDATE dbo.Customers SET FullName=@name WHERE Phone=@phone; ELSE INSERT dbo.Customers(FullName,Phone) VALUES(@name,@phone); SELECT CustomerId FROM dbo.Customers WHERE Phone=@phone;";
            await using var customerCmd=new SqlCommand(customerSql,cn,(SqlTransaction)tx);
            customerCmd.Parameters.AddWithValue("@name",request.CustomerName.Trim()); customerCmd.Parameters.AddWithValue("@phone",request.Phone.Trim());
            var customerId=Convert.ToInt32(await customerCmd.ExecuteScalarAsync());
            var codes=new List<string>(); var groups=request.Items.GroupBy(i=>i.RestaurantId).ToList();
            for(var groupIndex=0;groupIndex<groups.Count;groupIndex++)
            {
                var group=groups[groupIndex]; var subtotal=group.Sum(i=>i.Price*i.Quantity);
                var shipping=groupIndex==0?request.ShippingFee:0;
                var discount=request.PromotionRestaurantId==group.Key?request.Discount:0;
                var total=Math.Max(0,subtotal+shipping-discount);
                var code=$"DH-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..5].ToUpperInvariant()}";
                const string orderSql="INSERT dbo.Orders(OrderCode,RestaurantId,CustomerId,Status,PaymentMethod,DeliveryAddress,CustomerNote,TotalAmount,ShippingFee,DiscountAmount,OrderedAt,UpdatedAt) VALUES(@code,@restaurant,@customer,N'pending',@payment,@address,@note,@total,@shipping,@discount,SYSDATETIME(),SYSDATETIME()); SELECT CONVERT(INT,SCOPE_IDENTITY());";
                await using var orderCmd=new SqlCommand(orderSql,cn,(SqlTransaction)tx);
                orderCmd.Parameters.AddWithValue("@code",code);orderCmd.Parameters.AddWithValue("@restaurant",group.Key);orderCmd.Parameters.AddWithValue("@customer",customerId);orderCmd.Parameters.AddWithValue("@payment",request.PaymentMethod);orderCmd.Parameters.AddWithValue("@address",request.DeliveryAddress);orderCmd.Parameters.AddWithValue("@note",request.Note??"");orderCmd.Parameters.AddWithValue("@total",total);orderCmd.Parameters.AddWithValue("@shipping",shipping);orderCmd.Parameters.AddWithValue("@discount",discount);
                var orderId=Convert.ToInt32(await orderCmd.ExecuteScalarAsync());
                foreach(var item in group)
                {
                    const string itemSql="INSERT dbo.OrderItems(OrderId,ProductNameSnapshot,UnitPrice,Quantity,ProductRef,ImageUrl,Variant) VALUES(@order,@name,@price,@quantity,@product,@image,@variant);";
                    await using var itemCmd=new SqlCommand(itemSql,cn,(SqlTransaction)tx);
                    itemCmd.Parameters.AddWithValue("@order",orderId);itemCmd.Parameters.AddWithValue("@name",item.ProductName);itemCmd.Parameters.AddWithValue("@price",item.Price);itemCmd.Parameters.AddWithValue("@quantity",item.Quantity);itemCmd.Parameters.AddWithValue("@product",item.ProductId);itemCmd.Parameters.AddWithValue("@image",(object?)item.ProductImage??DBNull.Value);itemCmd.Parameters.AddWithValue("@variant",(object?)item.Variant??DBNull.Value);
                    await itemCmd.ExecuteNonQueryAsync();
                }
                codes.Add(code);
            }
            await tx.CommitAsync(); return codes;
        }
        catch { await tx.RollbackAsync(); throw; }
    }
    public async Task<List<CustomerOrderViewModel>> GetCustomerOrdersAsync(string phone)
    {
        await using var cn=new SqlConnection(_cs); await cn.OpenAsync();
        const string sql="SELECT o.OrderId,o.OrderCode,o.Status,o.PaymentMethod,o.DeliveryAddress,COALESCE(o.CustomerNote,N''),o.TotalAmount,COALESCE(o.ShippingFee,0),COALESCE(o.DiscountAmount,0),o.OrderedAt,COALESCE(o.UpdatedAt,o.OrderedAt),c.FullName,c.Phone,r.Name FROM dbo.Orders o JOIN dbo.Customers c ON c.CustomerId=o.CustomerId JOIN dbo.Restaurants r ON r.RestaurantId=o.RestaurantId WHERE c.Phone=@phone ORDER BY o.OrderedAt DESC;";
        await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@phone",phone);
        await using var rd=await cmd.ExecuteReaderAsync();var rows=new List<(int DbId,CustomerOrderViewModel Order,string Shop)>();
        while(await rd.ReadAsync())
        {
            var total=rd.GetDecimal(6);var shipping=rd.GetDecimal(7);var discount=rd.GetDecimal(8);
            rows.Add((rd.GetInt32(0),new CustomerOrderViewModel{Id=rd.GetString(1),Status=rd.GetString(2),PaymentMethod=rd.GetString(3),DeliveryAddress=rd.GetString(4),Note=rd.GetString(5),Total=total,ShippingFee=shipping,Discount=discount,Subtotal=total-shipping+discount,CreatedAt=rd.GetDateTime(9),UpdatedAt=rd.GetDateTime(10),CustomerName=rd.GetString(11),Phone=rd.GetString(12)},rd.GetString(13)));
        }
        await rd.CloseAsync();
        foreach(var row in rows)
        {
            const string itemSql="SELECT OrderItemId,COALESCE(ProductRef,N''),ProductNameSnapshot,COALESCE(ImageUrl,N''),UnitPrice,Quantity,Variant FROM dbo.OrderItems WHERE OrderId=@id ORDER BY OrderItemId;";
            await using var itemCmd=new SqlCommand(itemSql,cn);itemCmd.Parameters.AddWithValue("@id",row.DbId);await using var ir=await itemCmd.ExecuteReaderAsync();
            while(await ir.ReadAsync()) row.Order.Items.Add(new CustomerOrderItemViewModel{Id=ir.GetInt32(0),ProductId=ir.GetString(1),ProductName=ir.GetString(2),ProductImage=ir.GetString(3),ShopName=row.Shop,Price=ir.GetDecimal(4),Quantity=ir.GetInt32(5),Variant=ir.IsDBNull(6)?null:ir.GetString(6)});
        }
        return rows.Select(r=>r.Order).ToList();
    }
    public async Task<bool> CancelCustomerOrderAsync(string code,string phone)
    {
        await using var cn=new SqlConnection(_cs);await cn.OpenAsync();
        const string sql="UPDATE o SET Status=N'cancelled',UpdatedAt=SYSDATETIME() FROM dbo.Orders o JOIN dbo.Customers c ON c.CustomerId=o.CustomerId WHERE o.OrderCode=@code AND c.Phone=@phone AND o.Status=N'pending';";
        await using var cmd=new SqlCommand(sql,cn);cmd.Parameters.AddWithValue("@code",code);cmd.Parameters.AddWithValue("@phone",phone);return await cmd.ExecuteNonQueryAsync()>0;
    }
    private static List<SellerRevenuePoint> EmptyHours() => Enumerable.Range(0, 24).Select(hour => new SellerRevenuePoint { Time = $"{hour:00}:00", Revenue = 0 }).ToList();
}
