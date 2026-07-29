export type ComplaintType = "product" | "user" | "shop";
export type ComplaintStatus = "open" | "resolved" | "dismissed";

export interface Complaint {
  id: string;
  reporter: string;
  reporterEmail: string;
  targetType: ComplaintType;
  targetName: string;
  reason: string;
  description: string;
  createdAt: string;
  status: ComplaintStatus;
  resolvedNote?: string;
}

export const mockComplaints: Complaint[] = [
  { id: "KN001", reporter: "Nguyễn Thị Thảo", reporterEmail: "thao.nguyen@gmail.com", targetType: "product", targetName: "Phở bò tái chín đặc biệt",     reason: "Món ăn có dị vật",        description: "Tôi phát hiện có sợi tóc trong bát phở bò. Yêu cầu hoàn tiền và xử lý quán.", createdAt: "2024-06-28", status: "open" },
  { id: "KN002", reporter: "Hoàng Thị Linh",  reporterEmail: "linh.hoang@gmail.com",  targetType: "shop",    targetName: "Cơm Tấm Sài Gòn",           reason: "Chuẩn bị đơn quá lâu",          description: "Quán chuẩn bị đơn hàng mất hơn 1 tiếng rưỡi, khi shipper giao đến thì đồ ăn đã nguội ngắt.", createdAt: "2024-06-27", status: "open" },
  { id: "KN003", reporter: "Đặng Thị Hoa",    reporterEmail: "hoa.dang@gmail.com",    targetType: "product", targetName: "Bún bò Huế cay đặc trưng",          reason: "Chất lượng kém, ôi thiu",              description: "Thịt bò trong bún có mùi hôi, nước dùng chua, ăn vào bị đau bụng.", createdAt: "2024-06-26", status: "resolved", resolvedNote: "Đã xác minh và hoàn tiền. Quán đã bị cảnh cáo và yêu cầu kiểm tra lại vệ sinh an toàn thực phẩm." },
  { id: "KN004", reporter: "Ngô Thị Trang",   reporterEmail: "trang.ngo@gmail.com",   targetType: "user",    targetName: "Lê Văn Tí (Shipper)",             reason: "Thái độ shipper không tốt",                          description: "Shipper giao hàng muộn còn càu nhàu, vứt đồ ăn trước cổng không đưa tận tay.", createdAt: "2024-06-25", status: "resolved", resolvedNote: "Đã trừ điểm tín nhiệm shipper và gửi lời xin lỗi đến khách hàng." },
  { id: "KN005", reporter: "Kiều Thị Hương",  reporterEmail: "huong.kieu@gmail.com",  targetType: "shop",    targetName: "Trà Sữa Long Khánh",             reason: "Giao sai món, thiếu topping",                   description: "Đặt trà sữa trân châu nhưng giao hồng trà không topping. Cửa hàng không bắt máy.", createdAt: "2024-06-24", status: "dismissed", resolvedNote: "Đã kiểm tra lại camera tại quán, quán giao đúng nhưng do tài xế giao nhầm đơn với khách khác." },
  { id: "KN006", reporter: "Đỗ Thị Thanh",    reporterEmail: "thanh.do@gmail.com",    targetType: "product", targetName: "Gà rán giòn sốt cay",    reason: "Thức ăn chưa chín",              description: "Bên ngoài gà giòn nhưng bên trong vẫn còn máu, hoàn toàn chưa chín.", createdAt: "2024-06-24", status: "open" },
  { id: "KN007", reporter: "Phan Thị Xuân",   reporterEmail: "xuan.phan@gmail.com",   targetType: "shop",    targetName: "Lẩu Thái Cô Nga",              reason: "Gian lận định lượng",      description: "Đặt phần lẩu 4 người nhưng lượng thịt và tôm chỉ bằng phần 2 người.", createdAt: "2024-06-23", status: "open" },
  { id: "KN008", reporter: "Trịnh Thị Mai",   reporterEmail: "mai.trinh@gmail.com",   targetType: "product", targetName: "Nước mía ép tươi",            reason: "Đóng gói kém, đổ tràn", description: "Ly nước mía bị vỡ nắp, đổ hết ra ngoài túi ni lông không thể uống được.", createdAt: "2024-06-22", status: "resolved", resolvedNote: "Hoàn tiền cho khách hàng, yêu cầu quán đổi sang loại ly nắp ép màng." },
  { id: "KN009", reporter: "Tô Thị Phương",   reporterEmail: "phuong.to@gmail.com",   targetType: "user",    targetName: "Trần Hữu Hùng (Shipper)",           reason: "Làm hỏng đồ ăn", description: "Shipper làm rơi hộp cơm, thức ăn đổ dồn về một góc, hộp bị móp méo nặng.", createdAt: "2024-06-21", status: "resolved", resolvedNote: "Đã hoàn tiền cho khách. Shipper phải đền bù đơn hàng này." },
  { id: "KN010", reporter: "Hồ Thị Ngọc",     reporterEmail: "ngoc.ho@gmail.com",     targetType: "shop",    targetName: "Bánh Mì Hoa Phát",            reason: "Lên giá vô lý",    description: "Giá hiển thị trên app 30k, nhưng quán tính thêm 10k phí hộp xốp không hề báo trước.", createdAt: "2024-06-20", status: "open" },
];
