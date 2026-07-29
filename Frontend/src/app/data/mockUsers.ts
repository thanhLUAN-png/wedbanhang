export type UserRole = "buyer" | "seller" | "shipper";
export type UserStatus = "active" | "blocked" | "pending" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  orders?: number;
  shopName?: string;       // for seller
  shopAddress?: string;    // for seller
  vehicleType?: string;    // for shipper
  licensePlate?: string;   // for shipper
  banReason?: string;
  rejectReason?: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  // ── Người mua (tự động active khi đăng ký đủ thông tin) ──────────────────
  { id: "U001", name: "Nguyễn Thị Thảo",  email: "thao.nguyen@gmail.com",  phone: "0901234567", role: "buyer",   status: "active",  joinedAt: "2024-01-15", orders: 24 },
  { id: "U002", name: "Lê Thị Hằng",      email: "hang.le@gmail.com",      phone: "0923456789", role: "buyer",   status: "blocked", joinedAt: "2024-01-08", orders: 7,  banReason: "Đặt đơn rồi hủy liên tục gây thiệt hại cho quán" },
  { id: "U003", name: "Hoàng Thị Linh",   email: "linh.hoang@gmail.com",   phone: "0945678901", role: "buyer",   status: "active",  joinedAt: "2024-02-14", orders: 42 },
  { id: "U004", name: "Đặng Thị Hoa",     email: "hoa.dang@gmail.com",     phone: "0967890123", role: "buyer",   status: "active",  joinedAt: "2024-04-01", orders: 15 },
  { id: "U005", name: "Ngô Thị Trang",    email: "trang.ngo@gmail.com",    phone: "0989012345", role: "buyer",   status: "active",  joinedAt: "2024-03-18", orders: 8  },
  { id: "U006", name: "Trịnh Thị Mai",    email: "mai.trinh@gmail.com",    phone: "0901234568", role: "buyer",   status: "active",  joinedAt: "2024-05-06", orders: 3  },
  { id: "U007", name: "Phan Thị Xuân",    email: "xuan.phan@gmail.com",    phone: "0923456780", role: "buyer",   status: "active",  joinedAt: "2024-04-15", orders: 19 },
  { id: "U008", name: "Tô Thị Phương",    email: "phuong.to@gmail.com",    phone: "0945678902", role: "buyer",   status: "blocked", joinedAt: "2024-03-25", orders: 11, banReason: "Tài khoản sử dụng nhiều thiết bị, nghi ngờ gian lận khuyến mãi" },
  { id: "U009", name: "Hồ Thị Ngọc",      email: "ngoc.ho@gmail.com",      phone: "0967890124", role: "buyer",   status: "active",  joinedAt: "2024-06-01", orders: 6  },
  { id: "U010", name: "Chu Thị Lan",      email: "lan.chu@gmail.com",      phone: "0989012346", role: "buyer",   status: "blocked", joinedAt: "2023-10-12", orders: 2,  banReason: "Báo cáo sai thông tin, phản ánh không đúng về quán" },
  { id: "U011", name: "Kiều Thị Hương",   email: "huong.kieu@gmail.com",   phone: "0901234569", role: "buyer",   status: "active",  joinedAt: "2024-01-28", orders: 33 },
  { id: "U012", name: "Từ Thị Diễm",      email: "diem.tu@gmail.com",      phone: "0923456781", role: "buyer",   status: "active",  joinedAt: "2024-06-10", orders: 1  },
  { id: "U013", name: "Đỗ Thị Thanh",     email: "thanh.do@gmail.com",     phone: "0945678903", role: "buyer",   status: "active",  joinedAt: "2024-02-07", orders: 28 },

  // ── Quán ăn (cần admin duyệt) ─────────────────────────────────────────────
  { id: "S001", name: "Nguyễn Văn Nam",   email: "nam.nguyen@gmail.com",   phone: "0912000001", role: "seller",  status: "active",  joinedAt: "2024-01-10", shopName: "Phở Bò Gia Truyền",   shopAddress: "12 Lê Lợi, Q.1, TP.HCM" },
  { id: "S002", name: "Lê Văn Dũng",      email: "dung.le@gmail.com",      phone: "0912000002", role: "seller",  status: "active",  joinedAt: "2024-02-05", shopName: "Cơm Tấm Sài Gòn",     shopAddress: "45 Nguyễn Huệ, Q.1, TP.HCM" },
  { id: "S003", name: "Trần Thị Lan",     email: "lan.tran@gmail.com",     phone: "0912000003", role: "seller",  status: "pending", joinedAt: "2024-07-12", shopName: "Bún Bò Cô Lan",        shopAddress: "78 Trần Hưng Đạo, Q.5, TP.HCM" },
  { id: "S004", name: "Vũ Thị Thu",       email: "thu.vu@gmail.com",       phone: "0912000004", role: "seller",  status: "pending", joinedAt: "2024-07-11", shopName: "Gà Rán Thu Hương",     shopAddress: "23 Hai Bà Trưng, Q.3, TP.HCM" },
  { id: "S005", name: "Hoàng Thị Nga",    email: "nga.hoang@gmail.com",    phone: "0912000005", role: "seller",  status: "pending", joinedAt: "2024-07-10", shopName: "Lẩu Thái Cô Nga",      shopAddress: "56 Điện Biên Phủ, Q. Bình Thạnh" },
  { id: "S006", name: "Phạm Thị Hoa",     email: "hoa.pham@gmail.com",     phone: "0912000006", role: "seller",  status: "active",  joinedAt: "2024-03-18", shopName: "Bánh Mì Hoa Phát",     shopAddress: "99 CMT8, Q.3, TP.HCM" },
  { id: "S007", name: "Phạm Văn Long",    email: "long.pham@gmail.com",    phone: "0912000007", role: "seller",  status: "rejected", joinedAt: "2024-07-08", shopName: "Trà Sữa Long Khánh",  shopAddress: "34 Võ Văn Tần, Q.3, TP.HCM", rejectReason: "Giấy phép kinh doanh không hợp lệ, địa chỉ quán không tồn tại" },
  { id: "S008", name: "Đinh Văn Hùng",    email: "hung.dinh@gmail.com",    phone: "0912000008", role: "seller",  status: "blocked", joinedAt: "2024-04-01", shopName: "Cháo Lòng Hùng Phát",  shopAddress: "11 Lý Tự Trọng, Q.1, TP.HCM", banReason: "Bán đồ ăn không đảm bảo vệ sinh, bị nhiều khách khiếu nại" },
  { id: "S009", name: "Cao Thị Linh",     email: "linh.cao@gmail.com",     phone: "0912000009", role: "seller",  status: "active",  joinedAt: "2024-02-20", shopName: "Mì Quảng Cô Linh",     shopAddress: "67 Nguyễn Đình Chiểu, Q.3" },
  { id: "S010", name: "Đỗ Văn Tùng",      email: "tung.do@gmail.com",      phone: "0912000010", role: "seller",  status: "pending", joinedAt: "2024-07-13", shopName: "Nem Nướng Tùng Anh",   shopAddress: "8 Pasteur, Q.1, TP.HCM" },

  // ── Shipper (cần admin duyệt) ─────────────────────────────────────────────
  { id: "SH01", name: "Phạm Văn Đức",     email: "duc.pham@gmail.com",     phone: "0934567890", role: "shipper", status: "active",  joinedAt: "2024-03-10", vehicleType: "Xe máy",    licensePlate: "59B1-12345" },
  { id: "SH02", name: "Bùi Văn Phúc",     email: "phuc.bui@gmail.com",     phone: "0978901234", role: "shipper", status: "blocked", joinedAt: "2024-01-22", vehicleType: "Xe máy",    licensePlate: "59P2-67890", banReason: "Giao hàng trễ nhiều lần, thái độ xấu với khách" },
  { id: "SH03", name: "Lý Văn Khoa",      email: "khoa.ly@gmail.com",      phone: "0912345679", role: "shipper", status: "active",  joinedAt: "2024-02-28", vehicleType: "Xe đạp điện", licensePlate: "59V3-11111" },
  { id: "SH04", name: "Lưu Văn Tài",      email: "tai.luu@gmail.com",      phone: "0956789013", role: "shipper", status: "pending", joinedAt: "2024-07-13", vehicleType: "Xe máy",    licensePlate: "59K4-22222" },
  { id: "SH05", name: "Mạc Văn Long",     email: "long.mac@gmail.com",     phone: "0990123457", role: "shipper", status: "active",  joinedAt: "2024-05-14", vehicleType: "Xe máy",    licensePlate: "59M5-33333" },
  { id: "SH06", name: "Võ Văn Khánh",     email: "khanh.vo@gmail.com",     phone: "0934567892", role: "shipper", status: "pending", joinedAt: "2024-07-12", vehicleType: "Xe máy",    licensePlate: "59H6-44444" },
  { id: "SH07", name: "Nguyễn Văn Bình",  email: "binh.nv@gmail.com",      phone: "0901111222", role: "shipper", status: "pending", joinedAt: "2024-07-11", vehicleType: "Xe đạp điện", licensePlate: "59G7-55555" },
  { id: "SH08", name: "Trần Văn Duy",     email: "duy.tran@gmail.com",     phone: "0912333444", role: "shipper", status: "rejected", joinedAt: "2024-07-09", vehicleType: "Xe máy",    licensePlate: "59X8-66666", rejectReason: "CCCD hết hạn, bằng lái không hợp lệ" },
  { id: "SH09", name: "Lê Minh Tuấn",     email: "tuan.le@gmail.com",      phone: "0923555666", role: "shipper", status: "active",  joinedAt: "2024-04-05", vehicleType: "Xe máy",    licensePlate: "59L9-77777" },
  { id: "SH10", name: "Đinh Quang Vinh",  email: "vinh.dinh@gmail.com",    phone: "0934777888", role: "shipper", status: "active",  joinedAt: "2024-03-20", vehicleType: "Xe đạp điện", licensePlate: "59Q0-88888" },
];
