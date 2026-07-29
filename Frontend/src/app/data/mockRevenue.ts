export interface Transaction {
  id: string;
  seller: string;
  shopName: string;
  product: string;
  orderValue: number;
  commission: number;
  date: string;
  status: "completed" | "pending" | "refunded";
}

export const mockTransactions: Transaction[] = [
  // Shop transactions
  { id: "GD001", seller: "Nguyễn Văn Nam",    shopName: "Phở Bò Gia Truyền",   product: "Phở bò viên thịt bắp (x2)",      orderValue: 130000,  commission: 3250, date: "2026-07-14", status: "completed" },
  { id: "SH001", seller: "Trần Văn Giao",     shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD001)",      orderValue: 25000,   commission: 5000, date: "2026-07-14", status: "completed" },
  { id: "GD002", seller: "Lê Văn Dũng", shopName: "Cơm Tấm Sài Gòn",   product: "Cơm tấm sườn nướng bì chả (x3)",  orderValue: 165000,   commission: 4125,  date: "2026-07-14", status: "completed" },
  { id: "SH002", seller: "Lê Hữu Đạt",        shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD002)",      orderValue: 30000,   commission: 6000, date: "2026-07-14", status: "completed" },
  { id: "GD003", seller: "Trần Thị Lan",  shopName: "Bún Bò Cô Lan",  product: "Bún bò Huế cay đặc trưng", orderValue: 65000,   commission: 1625,   date: "2026-07-13", status: "completed" },
  { id: "GD004", seller: "Vũ Thị Thu",    shopName: "Gà Rán Thu Hương",   product: "Combo gà 2 miếng + khoai tây",orderValue: 150000,   commission: 3750,  date: "2026-07-13", status: "pending" },
  { id: "SH004", seller: "Trần Văn Giao",     shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD004)",      orderValue: 20000,   commission: 4000, date: "2026-07-13", status: "pending" },
  { id: "GD005", seller: "Hoàng Thị Nga",  shopName: "Lẩu Thái Cô Nga", product: "Lẩu thái hải sản 4 người",     orderValue: 380000,  commission: 9500,  date: "2026-07-12", status: "completed" },
  { id: "GD006", seller: "Phạm Thị Hoa",    shopName: "Bánh Mì Hoa Phát",   product: "Bánh mì thịt nguội pate (x5)",    orderValue: 150000,   commission: 3750,   date: "2026-07-12", status: "completed" },
  { id: "SH006", seller: "Phạm Tấn Tài",      shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD006)",      orderValue: 15000,   commission: 3000, date: "2026-07-12", status: "completed" },
  { id: "GD007", seller: "Phạm Văn Long", shopName: "Trà Sữa Long Khánh", product: "Trà sữa trân châu đường đen (x4)",     orderValue: 180000,   commission: 4500,   date: "2026-07-11", status: "completed" },
  { id: "GD008", seller: "Hoàng Thị Nga",    shopName: "Lẩu Thái Cô Nga",   product: "Lẩu thái hải sản 4 người (x2)",      orderValue: 760000,  commission: 19000, date: "2026-07-11", status: "completed" },
  { id: "SH008", seller: "Lê Hữu Đạt",        shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD008)",      orderValue: 35000,   commission: 7000, date: "2026-07-11", status: "completed" },
  { id: "GD009", seller: "Trần Thị Lan",  shopName: "Bún Bò Cô Lan",  product: "Bún bò Huế cay đặc trưng (x2)",        orderValue: 130000,   commission: 3250,  date: "2026-07-10", status: "refunded" },
  { id: "GD010", seller: "Vũ Thị Thu", shopName: "Gà Rán Thu Hương",   product: "Gà rán giòn sốt cay (x4)",  orderValue: 340000,   commission: 8500,   date: "2026-07-10", status: "completed" },
  { id: "GD011", seller: "Lê Văn Dũng",  shopName: "Cơm Tấm Sài Gòn", product: "Cơm tấm combo sườn + chả (x2)",      orderValue: 140000,  commission: 3500,  date: "2026-07-09", status: "completed" },
  { id: "GD012", seller: "Hoàng Thị Nga",  shopName: "Lẩu Thái Cô Nga",  product: "Lẩu thái bò 2 người",    orderValue: 320000, commission: 8000, date: "2026-07-09", status: "completed" },
  { id: "SH012", seller: "Phạm Tấn Tài",      shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD012)",      orderValue: 25000,   commission: 5000, date: "2026-07-09", status: "completed" },
  { id: "GD013", seller: "Phạm Thị Hoa",    shopName: "Bánh Mì Hoa Phát",   product: "Bánh mì trứng ốp la (x3)",   orderValue: 105000,   commission: 2625,  date: "2026-07-08", status: "completed" },
  { id: "GD014", seller: "Nguyễn Văn Nam",    shopName: "Phở Bò Gia Truyền",   product: "Nước sâm lạnh (x10)",     orderValue: 200000,   commission: 5000,   date: "2026-07-08", status: "pending" },
  { id: "GD015", seller: "Phạm Văn Long", shopName: "Trà Sữa Long Khánh", product: "Kem cheese trà sữa (x2)",  orderValue: 100000,   commission: 2500,  date: "2026-07-07", status: "completed" },
  { id: "SH015", seller: "Trần Văn Giao",     shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD015)",      orderValue: 15000,   commission: 3000, date: "2026-07-07", status: "completed" },
  { id: "GD016", seller: "Vũ Thị Thu",    shopName: "Gà Rán Thu Hương",   product: "Combo gà 2 miếng + khoai tây",    orderValue: 150000,  commission: 3750,  date: "2026-07-07", status: "completed" },
  { id: "GD017", seller: "Lê Văn Dũng", shopName: "Cơm Tấm Sài Gòn",   product: "Cơm tấm sườn bì trứng (x4)",  orderValue: 260000,  commission: 6500,  date: "2026-07-06", status: "refunded" },
  { id: "GD018", seller: "Phạm Thị Hoa",  shopName: "Bánh Mì Hoa Phát",  product: "Bánh mì bò sốt tiêu đen (x5)",   orderValue: 225000,   commission: 5625,  date: "2026-07-06", status: "completed" },
  { id: "SH018", seller: "Lê Hữu Đạt",        shopName: "Shipper Đối Tác",     product: "Phí giao hàng (Đơn GD018)",      orderValue: 20000,   commission: 4000, date: "2026-07-06", status: "completed" },
  { id: "GD019", seller: "Trần Thị Lan",  shopName: "Bún Bò Cô Lan", product: "Bún bò không cay (x2)",orderValue: 110000,   commission: 2750,  date: "2026-07-05", status: "completed" },
  { id: "GD020", seller: "Hoàng Thị Nga",  shopName: "Lẩu Thái Cô Nga",  product: "Lẩu thái hải sản 4 người",orderValue: 380000, commission: 9500, date: "2026-07-05", status: "completed" },
];

export const revenueAreaData = [
  { date: "6/7",  commission: 1250000 },
  { date: "7/7",  commission: 980000  },
  { date: "8/7",  commission: 1450000 },
  { date: "9/7",  commission: 2100000 },
  { date: "10/7", commission: 1680000 },
  { date: "11/7", commission: 1920000 },
  { date: "12/7", commission: 2340000 },
  { date: "13/7", commission: 1870000 },
  { date: "14/7", commission: 2560000 },
];

// Hourly data for 1-day view (14/7/2026)
export const revenueHourlyData = [
  { date: "00:00", commission: 0       },
  { date: "02:00", commission: 0       },
  { date: "04:00", commission: 0       },
  { date: "06:00", commission: 85000   },
  { date: "08:00", commission: 320000  },
  { date: "10:00", commission: 580000  },
  { date: "12:00", commission: 490000  },
  { date: "14:00", commission: 410000  },
  { date: "16:00", commission: 350000  },
  { date: "18:00", commission: 620000  },
  { date: "20:00", commission: 180000  },
  { date: "22:00", commission: 95000   },
  { date: "24:00", commission: 0       },
];
