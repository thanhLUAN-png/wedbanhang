export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  category: string;
  categoryId: string;
  shopId: string;
  shopName: string;
  shopAvatar: string;
  shopRating: number;
  shopFollowers: number;
  description: string;
  specifications: { label: string; value: string }[];
  tags: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Shop {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  rating: number;
  followers: number;
  totalProducts: number;
  responseRate: string;
  location: string;
  joinedAt: string;
}

export const categories: Category[] = [
  { id: "com", name: "Cơm", icon: "🍛", count: 1240 },
  { id: "pho_bun", name: "Phở / Bún", icon: "🍜", count: 890 },
  { id: "do_uong", name: "Đồ Uống", icon: "🥤", count: 2100 },
  { id: "an_vat", name: "Ăn Vặt", icon: "🍟", count: 3560 },
  { id: "ga_ran", name: "Gà Rán", icon: "🍗", count: 670 },
  { id: "pizza", name: "Pizza", icon: "🍕", count: 450 },
  { id: "healthy", name: "Đồ Ăn Healthy", icon: "🥗", count: 320 },
  { id: "banh_mi", name: "Bánh Mì", icon: "🥖", count: 780 },
  { id: "trang_mieng", name: "Tráng Miệng", icon: "🍰", count: 560 },
  { id: "hai_san", name: "Hải Sản", icon: "🦞", count: 430 },
];

export const shops: Shop[] = [
  { id: "shop1", name: "Cơm Tấm Cô Ba", avatar: "https://picsum.photos/seed/shopfood1/80/80", banner: "https://picsum.photos/seed/shopbanner1/800/200", rating: 4.8, followers: 12500, totalProducts: 32, responseRate: "98%", location: "TP. Hồ Chí Minh", joinedAt: "2020-01-15" },
  { id: "shop2", name: "Phở Bát Đàn", avatar: "https://picsum.photos/seed/shopfood2/80/80", banner: "https://picsum.photos/seed/shopbanner2/800/200", rating: 4.7, followers: 8900, totalProducts: 15, responseRate: "95%", location: "Hà Nội", joinedAt: "2019-06-20" },
  { id: "shop3", name: "Trà Sữa Boba", avatar: "https://picsum.photos/seed/shopfood3/80/80", banner: "https://picsum.photos/seed/shopbanner3/800/200", rating: 4.9, followers: 21000, totalProducts: 45, responseRate: "99%", location: "Đà Nẵng", joinedAt: "2018-03-10" },
  { id: "shop4", name: "Gà Rán Crunchy", avatar: "https://picsum.photos/seed/shopfood4/80/80", banner: "https://picsum.photos/seed/shopbanner4/800/200", rating: 4.6, followers: 4500, totalProducts: 23, responseRate: "92%", location: "Hải Phòng", joinedAt: "2021-02-28" },
  { id: "shop5", name: "Bánh Mì Huynh Hoa", avatar: "https://picsum.photos/seed/shopfood5/80/80", banner: "https://picsum.photos/seed/shopbanner5/800/200", rating: 4.9, followers: 52000, totalProducts: 8, responseRate: "99%", location: "TP. Hồ Chí Minh", joinedAt: "2015-10-10" },
];

export const mockShopProducts: ShopProduct[] = [
  {
    id: "f001", name: "Cơm Tấm Sườn Bì Chả Trứng", slug: "com-tam-suon-bi-cha-trung",
    price: 45000, originalPrice: 60000,
    image: "https://picsum.photos/seed/food1/400/400",
    images: ["https://picsum.photos/seed/food1/400/400", "https://picsum.photos/seed/food1b/400/400"],
    rating: 4.8, reviewCount: 2340, sold: 15600, stock: 50,
    category: "Cơm", categoryId: "com",
    shopId: "shop1", shopName: "Cơm Tấm Cô Ba", shopAvatar: "https://picsum.photos/seed/shopfood1/80/80", shopRating: 4.8, shopFollowers: 12500,
    description: "Cơm tấm sườn nướng than hoa thơm lừng, kèm bì dai ngon, chả trứng béo ngậy và mỡ hành tóp mỡ.",
    specifications: [{ label: "Định lượng", value: "1 phần người lớn" }, { label: "Topping", value: "Sườn, Bì, Chả, Trứng" }, { label: "Giao kèm", value: "Nước mắm chua ngọt, canh, đồ chua" }],
    tags: ["cơm tấm", "sườn nướng", "ăn trưa"], isFeatured: true
  },
  {
    id: "f002", name: "Trà Sữa Trân Châu Đường Đen Size L", slug: "tra-sua-tran-chau-duong-den",
    price: 35000, originalPrice: 55000,
    image: "https://picsum.photos/seed/food2/400/400",
    images: ["https://picsum.photos/seed/food2/400/400"],
    rating: 4.9, reviewCount: 1280, sold: 5430, stock: 100,
    category: "Đồ Uống", categoryId: "do_uong",
    shopId: "shop3", shopName: "Trà Sữa Boba", shopAvatar: "https://picsum.photos/seed/shopfood3/80/80", shopRating: 4.9, shopFollowers: 21000,
    description: "Trà sữa đậm vị hồng trà, trân châu nấu với đường đen Okinawa dẻo mềm, thơm mùi caramel.",
    specifications: [{ label: "Size", value: "L (700ml)" }, { label: "Đá", value: "50% Đá" }, { label: "Đường", value: "70% Đường" }],
    tags: ["trà sữa", "đường đen", "trân châu"]
  },
  {
    id: "f003", name: "Phở Bò Tái Nạm Nước Trong", slug: "pho-bo-tai-nam",
    price: 55000, originalPrice: 65000,
    image: "https://picsum.photos/seed/food3/400/400",
    images: ["https://picsum.photos/seed/food3/400/400", "https://picsum.photos/seed/food3b/400/400"],
    rating: 4.7, reviewCount: 890, sold: 12300, stock: 100,
    category: "Phở / Bún", categoryId: "pho_bun",
    shopId: "shop2", shopName: "Phở Bát Đàn", shopAvatar: "https://picsum.photos/seed/shopfood2/80/80", shopRating: 4.7, shopFollowers: 8900,
    description: "Phở bò nước dùng ngọt thanh từ xương ống hầm 12 tiếng, thịt bò tái tươi mềm và nạm giòn ngon.",
    specifications: [{ label: "Thành phần chính", value: "Thịt tái bò, Nạm bò, Bánh phở" }, { label: "Rau ăn kèm", value: "Ngò gai, Quế, Giá, Chanh ớt" }],
    tags: ["phở bò", "ăn sáng", "truyền thống"], isFeatured: true
  },
  {
    id: "f004", name: "Gà Rán Giòn Cay (3 Miếng)", slug: "ga-ran-gion-cay-3-mieng",
    price: 89000, originalPrice: 110000,
    image: "https://picsum.photos/seed/food4/400/400",
    images: ["https://picsum.photos/seed/food4/400/400", "https://picsum.photos/seed/food4b/400/400"],
    rating: 4.6, reviewCount: 450, sold: 3200, stock: 120,
    category: "Gà Rán", categoryId: "ga_ran",
    shopId: "shop4", shopName: "Gà Rán Crunchy", shopAvatar: "https://picsum.photos/seed/shopfood4/80/80", shopRating: 4.6, shopFollowers: 4500,
    description: "Combo 3 miếng gà rán giòn rụm tẩm vị cay đặc trưng, thịt gà mọng nước không bị khô.",
    specifications: [{ label: "Khẩu phần", value: "3 Miếng lớn" }, { label: "Loại thịt", value: "Đùi & Lườn" }, { label: "Gia vị", value: "Cay nồng" }],
    tags: ["gà rán", "combo", "đồ ăn nhanh"]
  },
  {
    id: "f005", name: "Cơm Thêm", slug: "com-them",
    price: 10000,
    image: "https://picsum.photos/seed/food5/400/400",
    images: ["https://picsum.photos/seed/food5/400/400"],
    rating: 4.5, reviewCount: 210, sold: 8900, stock: 300,
    category: "Cơm", categoryId: "com",
    shopId: "shop1", shopName: "Cơm Tấm Cô Ba", shopAvatar: "https://picsum.photos/seed/shopfood1/80/80", shopRating: 4.8, shopFollowers: 12500,
    description: "Cơm tấm nấu thêm dành cho người ăn nhiều.",
    specifications: [{ label: "Định lượng", value: "1 chén đầy" }],
    tags: ["cơm thêm"]
  },
  {
    id: "f006", name: "Sinh Tố Bơ Dừa Xay Nhuyễn", slug: "sinh-to-bo-dua",
    price: 40000, originalPrice: 50000,
    image: "https://picsum.photos/seed/food6/400/400",
    images: ["https://picsum.photos/seed/food6/400/400"],
    rating: 4.8, reviewCount: 1560, sold: 9800, stock: 150,
    category: "Đồ Uống", categoryId: "do_uong",
    shopId: "shop3", shopName: "Trà Sữa Boba", shopAvatar: "https://picsum.photos/seed/shopfood3/80/80", shopRating: 4.9, shopFollowers: 21000,
    description: "Sinh tố bơ Đắk Lắk béo ngậy xay cùng cốt dừa tươi, mát lạnh giải nhiệt mùa hè.",
    specifications: [{ label: "Size", value: "M (500ml)" }, { label: "Độ ngọt", value: "Vừa phải" }],
    tags: ["sinh tố", "bơ", "giải nhiệt"], isFeatured: true
  },
  {
    id: "f007", name: "Bún Bò Huế Đặc Biệt", slug: "bun-bo-hue-dac-biet",
    price: 60000, originalPrice: 75000,
    image: "https://picsum.photos/seed/food7/400/400",
    images: ["https://picsum.photos/seed/food7/400/400", "https://picsum.photos/seed/food7b/400/400"],
    rating: 4.6, reviewCount: 320, sold: 1200, stock: 60,
    category: "Phở / Bún", categoryId: "pho_bun",
    shopId: "shop2", shopName: "Phở Bát Đàn", shopAvatar: "https://picsum.photos/seed/shopfood2/80/80", shopRating: 4.7, shopFollowers: 8900,
    description: "Bún bò Huế chuẩn vị, ngập tràn topping: Chả cua, bò gân, móng giò và thịt bò tái mềm.",
    specifications: [{ label: "Topping", value: "Móng, Chả cua, Bò gân, Bò tái" }, { label: "Nước dùng", value: "Đậm vị mắm ruốc sả" }],
    tags: ["bún bò", "huế", "đặc biệt"]
  },
  {
    id: "f008", name: "Hamburger Bò Phô Mai", slug: "hamburger-bo-pho-mai",
    price: 55000, originalPrice: 65000,
    image: "https://picsum.photos/seed/food8/400/400",
    images: ["https://picsum.photos/seed/food8/400/400", "https://picsum.photos/seed/food8b/400/400"],
    rating: 4.7, reviewCount: 680, sold: 3400, stock: 40,
    category: "Gà Rán", categoryId: "ga_ran",
    shopId: "shop4", shopName: "Gà Rán Crunchy", shopAvatar: "https://picsum.photos/seed/shopfood4/80/80", shopRating: 4.6, shopFollowers: 4500,
    description: "Hamburger bò băm nướng lửa hồng, kèm phô mai chảy béo ngậy, rau xà lách và sốt mayonnaise đặc biệt.",
    specifications: [{ label: "Loại bánh", value: "Bánh mì mềm vừng" }, { label: "Thịt", value: "Bò 150g" }, { label: "Rau", value: "Xà lách, cà chua" }],
    tags: ["burger", "bò", "fastfood"]
  },
  {
    id: "f009", name: "Sườn Bì Chả Đặc Biệt + Canh Khổ Qua", slug: "suon-bi-cha-canh-kho-qua",
    price: 75000, originalPrice: 100000,
    image: "https://picsum.photos/seed/food9/400/400",
    images: ["https://picsum.photos/seed/food9/400/400", "https://picsum.photos/seed/food9b/400/400"],
    rating: 4.9, reviewCount: 890, sold: 2100, stock: 30,
    category: "Cơm", categoryId: "com",
    shopId: "shop1", shopName: "Cơm Tấm Cô Ba", shopAvatar: "https://picsum.photos/seed/shopfood1/80/80", shopRating: 4.8, shopFollowers: 12500,
    description: "Combo bữa trưa hoàn hảo với Cơm tấm thập cẩm dĩa lớn và bát canh khổ qua nhồi thịt thanh mát.",
    specifications: [{ label: "Món chính", value: "Sườn, Bì, Chả, Ốp La" }, { label: "Món canh", value: "Canh khổ qua nhồi thịt" }],
    tags: ["combo", "cơm trưa", "canh"], isFeatured: true
  },
  {
    id: "f010", name: "Trà Đào Cam Sả Tươi", slug: "tra-dao-cam-sa",
    price: 30000, originalPrice: 40000,
    image: "https://picsum.photos/seed/food10/400/400",
    images: ["https://picsum.photos/seed/food10/400/400"],
    rating: 4.8, reviewCount: 2100, sold: 8900, stock: 100,
    category: "Đồ Uống", categoryId: "do_uong",
    shopId: "shop3", shopName: "Trà Sữa Boba", shopAvatar: "https://picsum.photos/seed/shopfood3/80/80", shopRating: 4.9, shopFollowers: 21000,
    description: "Trà đào thơm lừng kết hợp với nước ép cam tươi và sả đập dập, món uống cực kỳ tươi mát.",
    specifications: [{ label: "Size", value: "L (700ml)" }, { label: "Topping", value: "3 miếng đào ngâm" }],
    tags: ["trà trái cây", "đào", "cam sả"]
  },
  {
    id: "f011", name: "Khoai Tây Chiên Mắm Tỏi", slug: "khoai-tay-chien-mam-toi",
    price: 25000, originalPrice: 35000,
    image: "https://picsum.photos/seed/food11/400/400",
    images: ["https://picsum.photos/seed/food11/400/400", "https://picsum.photos/seed/food11b/400/400"],
    rating: 4.8, reviewCount: 4320, sold: 34500, stock: 200,
    category: "Ăn Vặt", categoryId: "an_vat",
    shopId: "shop4", shopName: "Gà Rán Crunchy", shopAvatar: "https://picsum.photos/seed/shopfood4/80/80", shopRating: 4.6, shopFollowers: 4500,
    description: "Khoai tây chiên vàng giòn xóc cùng mắm tỏi ớt, đậm đà ăn cực cuốn.",
    specifications: [{ label: "Khẩu phần", value: "1 người ăn" }, { label: "Độ cay", value: "Cay nhẹ" }],
    tags: ["khoai tây", "ăn vặt", "mắm tỏi"]
  },
  {
    id: "f012", name: "Phở Gà Ta Lọc Đùi", slug: "pho-ga-ta-loc-dui",
    price: 65000, originalPrice: 80000,
    image: "https://picsum.photos/seed/food12/400/400",
    images: ["https://picsum.photos/seed/food12/400/400", "https://picsum.photos/seed/food12b/400/400"],
    rating: 4.7, reviewCount: 1120, sold: 6700, stock: 90,
    category: "Phở / Bún", categoryId: "pho_bun",
    shopId: "shop2", shopName: "Phở Bát Đàn", shopAvatar: "https://picsum.photos/seed/shopfood2/80/80", shopRating: 4.7, shopFollowers: 8900,
    description: "Phở gà nước dùng trong vắt, thịt đùi gà ta dai giòn, thêm lá chanh xắt nhỏ cực kỳ thơm ngon.",
    specifications: [{ label: "Thịt gà", value: "Đùi gà ta 100%" }, { label: "Nước dùng", value: "Ninh từ xương gà nguyên chất" }],
    tags: ["phở gà", "gà ta", "nước trong"]
  },
  {
    id: "f013", name: "Bánh Mì Thịt Nướng Đặc Biệt", slug: "banh-mi-thit-nuong",
    price: 35000, originalPrice: 45000,
    image: "https://picsum.photos/seed/food13/400/400",
    images: ["https://picsum.photos/seed/food13/400/400"],
    rating: 4.9, reviewCount: 1540, sold: 12500, stock: 80,
    category: "Bánh Mì", categoryId: "banh_mi",
    shopId: "shop5", shopName: "Bánh Mì Huynh Hoa", shopAvatar: "https://picsum.photos/seed/shopfood5/80/80", shopRating: 4.9, shopFollowers: 52000,
    description: "Ổ bánh mì siêu to khổng lồ ngập tràn thịt nướng than hoa, pate béo ngậy và chà bông mặn mặn.",
    specifications: [{ label: "Kích thước", value: "Dài 20cm" }, { label: "Topping", value: "Thịt nướng, Pate, Chả lụa" }],
    tags: ["bánh mì", "thịt nướng", "ăn vặt"], isFeatured: true
  },
];

export const allDiscountedProducts = mockShopProducts
  .filter((p) => p.originalPrice && p.originalPrice > p.price)
  .sort((a, b) => {
    const dA = Math.round((1 - a.price / a.originalPrice!) * 100);
    const dB = Math.round((1 - b.price / b.originalPrice!) * 100);
    return dB - dA;
  });

const shopFlashSaleMap = new Map<string, ShopProduct>();
allDiscountedProducts.forEach((p) => {
  if (!shopFlashSaleMap.has(p.shopId)) {
    shopFlashSaleMap.set(p.shopId, p);
  }
});

export const flashSaleProducts = Array.from(shopFlashSaleMap.values());
export const featuredProducts = mockShopProducts.filter((p) => p.isFeatured);
