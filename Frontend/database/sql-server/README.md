# SQL Server – dữ liệu mẫu

Chạy theo thứ tự:

1. `seller/sample-restaurants.sql`: tạo Seller, Restaurant, MenuItem và Combo.
2. `seller/sample-shop-info.sql`: thêm thông tin shop Seller, số liệu mặc định `0` và view thông tin shop.
3. `seller/sample-restaurant-categories.sql`: tạo danh mục chuyên môn chính cho từng quán trong Cài đặt Seller; mỗi quán có một danh mục, còn danh mục món nằm ở script quản lý sản phẩm.
4. `seller/sample-product-management.sql`: thêm danh mục, trạng thái, tồn kho, topping và view quản lý sản phẩm.
5. `orders/sample-orders.sql`: tạo Shipper, Customer, Order và OrderItem.
6. `orders/sample-delivery-details.sql`: thêm phí ship, COD, khoảng cách và khối lượng.
7. `shipp/sample-order-pickup.sql`: tạo trạng thái trực tuyến shipper, danh sách đơn chờ nhận từ Orders và thủ tục nhận đơn.
8. `shipp/sample-delivery-history.sql`: tạo lịch sử giao theo đơn đã hoàn tất/hoàn/hủy, số liệu thành công và thủ tục hoàn tất hoặc báo giao không được.
9. `shipp/sample-messages.sql`: tạo chat shipper với khách/quán, tin chưa đọc và thủ tục gửi/đọc tin; chưa có hội thoại mẫu nên trả `0`.
10. `shipp/sample-wallet.sql`: tạo ví từ phí ship/COD của đơn hoàn thành, tổng số dư và yêu cầu rút tiền; không có giao dịch mock.
11. `shipp/sample-activity-report.sql`: tổng hợp đơn, phí ship, tỷ lệ thành công và ca hoạt động; đánh giá/giờ chưa phát sinh trả `0`.
12. `shipp/sample-sent-ratings.sql`: tạo đánh giá Shipper gửi khách/quán theo đơn hoàn thành, cho sửa trong 30 phút; chưa có đánh giá mẫu nên trả `0`.
13. `shipp/sample-profile.sql`: tạo hồ sơ shipper, cài đặt thông báo/bảo mật và thủ tục cập nhật; thông tin chưa có trả `0`.
14. `seller/sample-order-analytics.sql`: tạo view thống kê đơn hàng và món bán chạy, dữ liệu thiếu trả `0`.
15. `seller/sample-finance.sql`: tạo giao dịch, báo cáo doanh thu/chi phí/lợi nhuận; dữ liệu thiếu trả `0`.
16. `seller/sample-promotions.sql`: tạo khuyến mãi, phạm vi áp dụng và view tổng hợp; dữ liệu thiếu trả `0`.
17. `seller/sample-messages.sql`: tạo hội thoại/tin nhắn và view tổng hợp; dữ liệu thiếu trả `0`.
18. `seller/sample-settings.sql`: tạo cài đặt quán, thông báo Seller và view cấu hình; dữ liệu thiếu trả `0`.
19. `admin/sample-admin.sql`: tạo đúng một tài khoản Admin (`ADM-0001`), dữ liệu tổng quan và nhật ký quản trị; số liệu thiếu trả `0`.
20. `admin/sample-user-management.sql`: tạo tài khoản quản lý Admin từ 30 user, 20 seller, 20 shipper và 1 admin; có view lọc/trạng thái và thủ tục duyệt, từ chối, ban hoặc mở ban.
21. `admin/sample-product-moderation.sql`: đưa 240 món và 24 combo mẫu vào hàng chờ kiểm duyệt; có view tổng hợp và thủ tục duyệt, từ chối hoặc hoàn về chờ duyệt.
22. `admin/sample-revenue-commission.sql`: tạo giao dịch doanh thu/hoa hồng từ đơn mẫu, tách seller và shipper; tỷ lệ hoa hồng chưa có để `0`.

Các mã liên kết:

- Seller: `SL-MÃ_VÙNG-ID`, ví dụ `SL-BT-0001`.
- Quán: `MÃ_VÙNG-TỌA_ĐỘ-ID`, ví dụ `BT-74101118-0001`.
- Shipper: `SP-MÃ_VÙNG-ID`, ví dụ `SP-Q1-0001`.
- Admin: `ADM-ID`, ví dụ `ADM-0001`.

Quy ước dữ liệu mẫu: giá trị số thiếu dữ liệu dùng `0`; đơn chưa được phân shipper hiển thị `ShipperCodeSnapshot = '0'`, còn `ShipperId` để `NULL` nhằm không tạo liên kết giả.
