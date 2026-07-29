export type ProductStatus = "pending" | "approved" | "rejected";

export interface Product {
  id: string;
  name: string;
  seller: string;
  shopName: string;
  shopId: string;
  shopAvatar: string;
  category: string;
  price: number;
  submittedAt: string;
  status: ProductStatus;
  rejectionReason?: string;
  image: string;
  description?: string;
}

export const mockProducts: Product[] = [
  // ─── Phở Bò Gia Truyền ───────────────────────────────────────────────────
  { id: "SP001", shopId: "SHOP01", shopName: "Phở Bò Gia Truyền",    shopAvatar: "https://picsum.photos/seed/shop1/48/48", seller: "Nguyễn Văn Nam",   category: "Món nước",  price: 75000,  submittedAt: "2024-07-10", status: "pending",  name: "Phở bò tái chín đặc biệt",      image: "https://picsum.photos/seed/pho1/64/64",  description: "Phở bò nước trong, thịt tái chín thơm ngon" },
  { id: "SP002", shopId: "SHOP01", shopName: "Phở Bò Gia Truyền",    shopAvatar: "https://picsum.photos/seed/shop1/48/48", seller: "Nguyễn Văn Nam",   category: "Món nước",  price: 65000,  submittedAt: "2024-07-10", status: "approved", name: "Phở bò viên thịt bắp",          image: "https://picsum.photos/seed/pho2/64/64",  description: "Phở bò viên, bắp bò mềm" },
  { id: "SP003", shopId: "SHOP01", shopName: "Phở Bò Gia Truyền",    shopAvatar: "https://picsum.photos/seed/shop1/48/48", seller: "Nguyễn Văn Nam",   category: "Đồ uống",   price: 20000,  submittedAt: "2024-07-10", status: "pending",  name: "Nước sâm lạnh",                  image: "https://picsum.photos/seed/pho3/64/64",  description: "Nước sâm mát lạnh giải nhiệt" },
  { id: "SP004", shopId: "SHOP01", shopName: "Phở Bò Gia Truyền",    shopAvatar: "https://picsum.photos/seed/shop1/48/48", seller: "Nguyễn Văn Nam",   category: "Món nước",  price: 85000,  submittedAt: "2024-07-09", status: "rejected", rejectionReason: "Ảnh sản phẩm quá tối, không thể hiện màu nước dùng. Vui lòng chụp lại.", name: "Phở bò gân sách đặc biệt",      image: "https://picsum.photos/seed/pho4/64/64",  description: "Phở bò gân sách đặc biệt" },

  // ─── Cơm Tấm Sài Gòn ────────────────────────────────────────────────────
  { id: "SP005", shopId: "SHOP02", shopName: "Cơm Tấm Sài Gòn",      shopAvatar: "https://picsum.photos/seed/shop2/48/48", seller: "Lê Văn Dũng",      category: "Cơm",       price: 55000,  submittedAt: "2024-07-08", status: "approved", name: "Cơm tấm sườn nướng bì chả",     image: "https://picsum.photos/seed/com1/64/64",  description: "Cơm tấm sườn nướng, bì, chả, trứng ốp la" },
  { id: "SP006", shopId: "SHOP02", shopName: "Cơm Tấm Sài Gòn",      shopAvatar: "https://picsum.photos/seed/shop2/48/48", seller: "Lê Văn Dũng",      category: "Cơm",       price: 65000,  submittedAt: "2024-07-08", status: "pending",  name: "Cơm tấm sườn bì trứng",         image: "https://picsum.photos/seed/com2/64/64",  description: "Sườn nướng, bì, trứng kho" },
  { id: "SP007", shopId: "SHOP02", shopName: "Cơm Tấm Sài Gòn",      shopAvatar: "https://picsum.photos/seed/shop2/48/48", seller: "Lê Văn Dũng",      category: "Cơm",       price: 70000,  submittedAt: "2024-07-07", status: "approved", name: "Cơm tấm combo sườn + chả",      image: "https://picsum.photos/seed/com3/64/64",  description: "Combo sườn nướng và chả trứng" },
  { id: "SP008", shopId: "SHOP02", shopName: "Cơm Tấm Sài Gòn",      shopAvatar: "https://picsum.photos/seed/shop2/48/48", seller: "Lê Văn Dũng",      category: "Đồ uống",   price: 25000,  submittedAt: "2024-07-07", status: "rejected", rejectionReason: "Mô tả quá ngắn, cần ghi rõ thành phần nước sốt và tên đồ uống chính xác.", name: "Nước ngọt chai",                 image: "https://picsum.photos/seed/com4/64/64",  description: "Nước ngọt theo mùa" },
  { id: "SP009", shopId: "SHOP02", shopName: "Cơm Tấm Sài Gòn",      shopAvatar: "https://picsum.photos/seed/shop2/48/48", seller: "Lê Văn Dũng",      category: "Cơm",       price: 80000,  submittedAt: "2024-07-06", status: "pending",  name: "Cơm sườn bò nướng sa tế",       image: "https://picsum.photos/seed/com5/64/64",  description: "Sườn bò nướng sa tế đặc biệt" },

  // ─── Bún Bò Cô Lan ──────────────────────────────────────────────────────
  { id: "SP010", shopId: "SHOP03", shopName: "Bún Bò Cô Lan",         shopAvatar: "https://picsum.photos/seed/shop3/48/48", seller: "Trần Thị Lan",     category: "Món nước",  price: 65000,  submittedAt: "2024-07-09", status: "approved", name: "Bún bò Huế cay đặc trưng",      image: "https://picsum.photos/seed/bun1/64/64",  description: "Bún bò nước cay đậm, bò viên giò heo" },
  { id: "SP011", shopId: "SHOP03", shopName: "Bún Bò Cô Lan",         shopAvatar: "https://picsum.photos/seed/shop3/48/48", seller: "Trần Thị Lan",     category: "Món nước",  price: 75000,  submittedAt: "2024-07-09", status: "pending",  name: "Bún bò đặc biệt thập cẩm",     image: "https://picsum.photos/seed/bun2/64/64",  description: "Bò tái, giò heo, huyết, bò viên" },
  { id: "SP012", shopId: "SHOP03", shopName: "Bún Bò Cô Lan",         shopAvatar: "https://picsum.photos/seed/shop3/48/48", seller: "Trần Thị Lan",     category: "Món nước",  price: 55000,  submittedAt: "2024-07-08", status: "approved", name: "Bún bò không cay",              image: "https://picsum.photos/seed/bun3/64/64",  description: "Phiên bản không cay cho người không ăn được cay" },
  { id: "SP013", shopId: "SHOP03", shopName: "Bún Bò Cô Lan",         shopAvatar: "https://picsum.photos/seed/shop3/48/48", seller: "Trần Thị Lan",     category: "Đồ uống",   price: 30000,  submittedAt: "2024-07-08", status: "pending",  name: "Nước mía ép tươi",              image: "https://picsum.photos/seed/bun4/64/64",  description: "Nước mía ép tươi lạnh nguyên chất" },
  { id: "SP014", shopId: "SHOP03", shopName: "Bún Bò Cô Lan",         shopAvatar: "https://picsum.photos/seed/shop3/48/48", seller: "Trần Thị Lan",     category: "Món nước",  price: 60000,  submittedAt: "2024-07-07", status: "rejected", rejectionReason: "Giá không khớp với thực đơn đã đăng ký. Cần cập nhật lại giá hoặc liên hệ admin.", name: "Bún bò giò heo",                image: "https://picsum.photos/seed/bun5/64/64",  description: "Bún bò với giò heo hầm mềm" },

  // ─── Gà Rán Thu Hương ────────────────────────────────────────────────────
  { id: "SP015", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Đồ chiên",  price: 85000,  submittedAt: "2024-07-10", status: "pending",  name: "Gà rán giòn sốt cay",           image: "https://picsum.photos/seed/ga1/64/64",   description: "Gà rán giòn tẩm bột, sốt cay đặc biệt" },
  { id: "SP016", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Đồ chiên",  price: 75000,  submittedAt: "2024-07-10", status: "pending",  name: "Gà rán truyền thống",           image: "https://picsum.photos/seed/ga2/64/64",   description: "Gà rán giòn theo công thức truyền thống" },
  { id: "SP017", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Combo",     price: 150000, submittedAt: "2024-07-09", status: "approved", name: "Combo gà 2 miếng + khoai tây",  image: "https://picsum.photos/seed/ga3/64/64",   description: "2 miếng gà rán + khoai tây chiên + nước" },
  { id: "SP018", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Đồ chiên",  price: 45000,  submittedAt: "2024-07-09", status: "approved", name: "Khoai tây chiên giòn",          image: "https://picsum.photos/seed/ga4/64/64",   description: "Khoai tây chiên giòn rắc muối hương thảo" },
  { id: "SP019", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Đồ uống",   price: 35000,  submittedAt: "2024-07-08", status: "rejected", rejectionReason: "Đồ uống không ghi rõ là trà sữa hay sinh tố. Thiếu thông tin mô tả món uống.", name: "Đồ uống đặc biệt",              image: "https://picsum.photos/seed/ga5/64/64",   description: "Đồ uống theo mùa" },
  { id: "SP020", shopId: "SHOP04", shopName: "Gà Rán Thu Hương",      shopAvatar: "https://picsum.photos/seed/shop4/48/48", seller: "Vũ Thị Thu",       category: "Combo",     price: 200000, submittedAt: "2024-07-08", status: "pending",  name: "Combo gia đình 4 miếng gà",    image: "https://picsum.photos/seed/ga6/64/64",   description: "4 miếng gà, 2 phần khoai, 2 nước" },

  // ─── Lẩu Thái Cô Nga ─────────────────────────────────────────────────────
  { id: "SP021", shopId: "SHOP05", shopName: "Lẩu Thái Cô Nga",       shopAvatar: "https://picsum.photos/seed/shop5/48/48", seller: "Hoàng Thị Nga",    category: "Lẩu",       price: 280000, submittedAt: "2024-07-10", status: "pending",  name: "Lẩu thái hải sản 2 người",     image: "https://picsum.photos/seed/lau1/64/64",  description: "Tôm, mực, cá, nấm, rau đi kèm" },
  { id: "SP022", shopId: "SHOP05", shopName: "Lẩu Thái Cô Nga",       shopAvatar: "https://picsum.photos/seed/shop5/48/48", seller: "Hoàng Thị Nga",    category: "Lẩu",       price: 380000, submittedAt: "2024-07-10", status: "pending",  name: "Lẩu thái hải sản 4 người",     image: "https://picsum.photos/seed/lau2/64/64",  description: "Phần lớn cho 4 người ăn" },
  { id: "SP023", shopId: "SHOP05", shopName: "Lẩu Thái Cô Nga",       shopAvatar: "https://picsum.photos/seed/shop5/48/48", seller: "Hoàng Thị Nga",    category: "Lẩu",       price: 320000, submittedAt: "2024-07-09", status: "approved", name: "Lẩu thái bò 2 người",          image: "https://picsum.photos/seed/lau3/64/64",  description: "Lẩu thái với bò tái, bò viên" },
  { id: "SP024", shopId: "SHOP05", shopName: "Lẩu Thái Cô Nga",       shopAvatar: "https://picsum.photos/seed/shop5/48/48", seller: "Hoàng Thị Nga",    category: "Thêm",      price: 50000,  submittedAt: "2024-07-09", status: "approved", name: "Phụ gia thêm: Tôm sú tươi",    image: "https://picsum.photos/seed/lau4/64/64",  description: "Thêm tôm sú tươi vào lẩu" },
  { id: "SP025", shopId: "SHOP05", shopName: "Lẩu Thái Cô Nga",       shopAvatar: "https://picsum.photos/seed/shop5/48/48", seller: "Hoàng Thị Nga",    category: "Thêm",      price: 30000,  submittedAt: "2024-07-08", status: "rejected", rejectionReason: "Mặt hàng 'rau tổng hợp' cần liệt kê cụ thể từng loại rau để khách hàng nắm rõ.", name: "Rau tổng hợp ăn lẩu",          image: "https://picsum.photos/seed/lau5/64/64",  description: "Rau ăn lẩu các loại" },

  // ─── Bánh Mì Hoa Phát ────────────────────────────────────────────────────
  { id: "SP026", shopId: "SHOP06", shopName: "Bánh Mì Hoa Phát",      shopAvatar: "https://picsum.photos/seed/shop6/48/48", seller: "Phạm Thị Hoa",     category: "Bánh mì",   price: 30000,  submittedAt: "2024-07-10", status: "approved", name: "Bánh mì thịt nguội pate",       image: "https://picsum.photos/seed/bm1/64/64",   description: "Bánh mì giòn nhân thịt nguội, pate, dưa leo" },
  { id: "SP027", shopId: "SHOP06", shopName: "Bánh Mì Hoa Phát",      shopAvatar: "https://picsum.photos/seed/shop6/48/48", seller: "Phạm Thị Hoa",     category: "Bánh mì",   price: 35000,  submittedAt: "2024-07-10", status: "approved", name: "Bánh mì trứng ốp la",           image: "https://picsum.photos/seed/bm2/64/64",   description: "Bánh mì trứng ốp la, xíu mại" },
  { id: "SP028", shopId: "SHOP06", shopName: "Bánh Mì Hoa Phát",      shopAvatar: "https://picsum.photos/seed/shop6/48/48", seller: "Phạm Thị Hoa",     category: "Bánh mì",   price: 40000,  submittedAt: "2024-07-09", status: "pending",  name: "Bánh mì gà xé sốt mayo",       image: "https://picsum.photos/seed/bm3/64/64",   description: "Gà xé phay, sốt mayo béo ngậy" },
  { id: "SP029", shopId: "SHOP06", shopName: "Bánh Mì Hoa Phát",      shopAvatar: "https://picsum.photos/seed/shop6/48/48", seller: "Phạm Thị Hoa",     category: "Bánh mì",   price: 45000,  submittedAt: "2024-07-09", status: "pending",  name: "Bánh mì bò sốt tiêu đen",      image: "https://picsum.photos/seed/bm4/64/64",   description: "Bò sốt tiêu đen thơm lừng" },
  { id: "SP030", shopId: "SHOP06", shopName: "Bánh Mì Hoa Phát",      shopAvatar: "https://picsum.photos/seed/shop6/48/48", seller: "Phạm Thị Hoa",     category: "Đồ uống",   price: 20000,  submittedAt: "2024-07-08", status: "rejected", rejectionReason: "Cà phê sữa đá cần ghi rõ là cà phê phin hay cà phê pha sẵn để tránh nhầm lẫn.", name: "Cà phê sữa đá",                 image: "https://picsum.photos/seed/bm5/64/64",   description: "Cà phê sữa đá đậm đà" },

  // ─── Trà Sữa Long Khánh ──────────────────────────────────────────────────
  { id: "SP031", shopId: "SHOP07", shopName: "Trà Sữa Long Khánh",    shopAvatar: "https://picsum.photos/seed/shop7/48/48", seller: "Phạm Văn Long",    category: "Đồ uống",   price: 45000,  submittedAt: "2024-07-09", status: "approved", name: "Trà sữa trân châu đường đen",   image: "https://picsum.photos/seed/ts1/64/64",   description: "Trà sữa trân châu đường đen thơm béo" },
  { id: "SP032", shopId: "SHOP07", shopName: "Trà Sữa Long Khánh",    shopAvatar: "https://picsum.photos/seed/shop7/48/48", seller: "Phạm Văn Long",    category: "Đồ uống",   price: 40000,  submittedAt: "2024-07-09", status: "approved", name: "Matcha sữa đá",                 image: "https://picsum.photos/seed/ts2/64/64",   description: "Matcha Nhật Bản pha sữa tươi" },
  { id: "SP033", shopId: "SHOP07", shopName: "Trà Sữa Long Khánh",    shopAvatar: "https://picsum.photos/seed/shop7/48/48", seller: "Phạm Văn Long",    category: "Đồ uống",   price: 50000,  submittedAt: "2024-07-08", status: "pending",  name: "Kem cheese trà sữa",            image: "https://picsum.photos/seed/ts3/64/64",   description: "Trà sữa topped kem cheese béo mặn" },
  { id: "SP034", shopId: "SHOP07", shopName: "Trà Sữa Long Khánh",    shopAvatar: "https://picsum.photos/seed/shop7/48/48", seller: "Phạm Văn Long",    category: "Đồ uống",   price: 35000,  submittedAt: "2024-07-08", status: "pending",  name: "Hồng trà sữa truyền thống",    image: "https://picsum.photos/seed/ts4/64/64",   description: "Hồng trà pha sữa tươi nhẹ nhàng" },
  { id: "SP035", shopId: "SHOP07", shopName: "Trà Sữa Long Khánh",    shopAvatar: "https://picsum.photos/seed/shop7/48/48", seller: "Phạm Văn Long",    category: "Đồ uống",   price: 55000,  submittedAt: "2024-07-07", status: "rejected", rejectionReason: "Ảnh sản phẩm bị lộn với sản phẩm khác trong menu. Vui lòng tải ảnh đúng món.", name: "Smoothie xoài sữa chua",        image: "https://picsum.photos/seed/ts5/64/64",   description: "Xoài tươi xay nhuyễn với sữa chua" },
];

// Helper: group products by shopId
export interface ShopGroup {
  shopId: string;
  shopName: string;
  shopAvatar: string;
  seller: string;
  products: Product[];
}

export function groupProductsByShop(products: Product[]): ShopGroup[] {
  const map = new Map<string, ShopGroup>();
  for (const p of products) {
    if (!map.has(p.shopId)) {
      map.set(p.shopId, {
        shopId: p.shopId,
        shopName: p.shopName,
        shopAvatar: p.shopAvatar,
        seller: p.seller,
        products: [],
      });
    }
    map.get(p.shopId)!.products.push(p);
  }
  return Array.from(map.values());
}
