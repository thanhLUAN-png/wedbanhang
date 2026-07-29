export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface ShopInCategory {
  shopId: string;
  shopName: string;
  owner: string;
  items: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string | null;
  itemCount: number;
  children?: Category[];
  shops?: ShopInCategory[];
}

export const mockCategories: Category[] = [
  {
    id: "C001", name: "Cơm", slug: "com", icon: "🍚", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S001", shopName: "Cơm Tấm Sài Gòn", owner: "Lê Văn Dũng",
        items: [
          { id: "M001", name: "Cơm tấm sườn nướng bì chả", price: 55000 },
          { id: "M002", name: "Cơm tấm sườn bì trứng", price: 60000 },
          { id: "M003", name: "Cơm tấm combo đặc biệt", price: 75000 },
          { id: "M004", name: "Cơm tấm chả cá", price: 50000 },
        ],
      },
      {
        shopId: "S002", shopName: "Cơm Niêu Bà Năm", owner: "Nguyễn Thị Năm",
        items: [
          { id: "M005", name: "Cơm niêu cá kho tộ", price: 65000 },
          { id: "M006", name: "Cơm niêu gà kho gừng", price: 70000 },
          { id: "M007", name: "Cơm niêu thịt kho trứng", price: 60000 },
        ],
      },
    ],
  },
  {
    id: "C002", name: "Phở / Bún", slug: "pho-bun", icon: "🍜", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S003", shopName: "Phở Bò Gia Truyền", owner: "Nguyễn Văn Nam",
        items: [
          { id: "M008", name: "Phở bò tái", price: 65000 },
          { id: "M009", name: "Phở bò chín viên thịt bắp", price: 70000 },
          { id: "M010", name: "Phở gà", price: 60000 },
          { id: "M011", name: "Nước sâm lạnh", price: 20000 },
        ],
      },
      {
        shopId: "S004", shopName: "Bún Bò Cô Lan", owner: "Trần Thị Lan",
        items: [
          { id: "M012", name: "Bún bò Huế cay đặc trưng", price: 65000 },
          { id: "M013", name: "Bún bò không cay", price: 65000 },
          { id: "M014", name: "Bún bò đặc biệt (thêm bò viên)", price: 75000 },
        ],
      },
    ],
  },
  {
    id: "C003", name: "Đồ Uống", slug: "do-uong", icon: "🧋", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S005", shopName: "Trà Sữa Long Khánh", owner: "Phạm Văn Long",
        items: [
          { id: "M015", name: "Trà sữa trân châu đường đen", price: 45000 },
          { id: "M016", name: "Trà sữa matcha kem cheese", price: 50000 },
          { id: "M017", name: "Kem cheese trà sữa", price: 50000 },
          { id: "M018", name: "Hồng trà sữa tươi", price: 45000 },
        ],
      },
      {
        shopId: "S006", shopName: "Cà Phê Rang Xay Minh", owner: "Trần Văn Minh",
        items: [
          { id: "M019", name: "Cà phê đen đá", price: 25000 },
          { id: "M020", name: "Bạc xỉu", price: 30000 },
          { id: "M021", name: "Americano đá", price: 35000 },
        ],
      },
    ],
  },
  {
    id: "C004", name: "Ăn Vặt", slug: "an-vat", icon: "🍢", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S007", shopName: "Đồ Ăn Vặt Linh", owner: "Nguyễn Thị Linh",
        items: [
          { id: "M022", name: "Bánh tráng trộn", price: 25000 },
          { id: "M023", name: "Gỏi khô bò", price: 35000 },
          { id: "M024", name: "Cá viên chiên sốt cay", price: 20000 },
          { id: "M025", name: "Bò viên nướng tương", price: 30000 },
        ],
      },
    ],
  },
  {
    id: "C005", name: "Gà Rán", slug: "ga-ran", icon: "🍗", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S008", shopName: "Gà Rán Thu Hương", owner: "Vũ Thị Thu",
        items: [
          { id: "M026", name: "Combo gà 2 miếng + khoai tây", price: 75000 },
          { id: "M027", name: "Gà rán giòn sốt cay", price: 85000 },
          { id: "M028", name: "Gà popcorn size L", price: 55000 },
          { id: "M029", name: "Sandwich gà giòn", price: 45000 },
        ],
      },
    ],
  },
  {
    id: "C006", name: "Pizza", slug: "pizza", icon: "🍕", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S009", shopName: "Pizza Home Hà Nội", owner: "Đỗ Văn Hà",
        items: [
          { id: "M030", name: "Pizza hải sản size M", price: 150000 },
          { id: "M031", name: "Pizza bò phô mai size L", price: 199000 },
          { id: "M032", name: "Pizza BBQ gà size M", price: 145000 },
          { id: "M033", name: "Combo pizza đôi", price: 280000 },
        ],
      },
    ],
  },
  {
    id: "C007", name: "Đồ Ăn Healthy", slug: "healthy", icon: "🥗", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S010", shopName: "Green Bowl Healthy", owner: "Lê Thị Mai",
        items: [
          { id: "M034", name: "Salad gà nướng", price: 65000 },
          { id: "M035", name: "Salad cá ngừ", price: 70000 },
          { id: "M036", name: "Nước detox dưa leo bạc hà", price: 35000 },
          { id: "M037", name: "Bowl yến mạch trái cây", price: 55000 },
        ],
      },
    ],
  },
  {
    id: "C008", name: "Bánh Mì", slug: "banh-mi", icon: "🥖", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S011", shopName: "Bánh Mì Hoa Phát", owner: "Phạm Thị Hoa",
        items: [
          { id: "M038", name: "Bánh mì thịt nguội pate", price: 30000 },
          { id: "M039", name: "Bánh mì bò sốt tiêu đen", price: 45000 },
          { id: "M040", name: "Bánh mì trứng ốp la", price: 35000 },
          { id: "M041", name: "Bánh mì chả lụa", price: 25000 },
        ],
      },
    ],
  },
  {
    id: "C009", name: "Tráng Miệng", slug: "trang-mieng", icon: "🍮", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S012", shopName: "Chè & Tráng Miệng Ánh", owner: "Trần Thị Ánh",
        items: [
          { id: "M042", name: "Chè khúc bạch", price: 35000 },
          { id: "M043", name: "Kem xôi xoài", price: 40000 },
          { id: "M044", name: "Bánh flan caramel", price: 25000 },
          { id: "M045", name: "Chè bưởi nước dừa", price: 30000 },
        ],
      },
    ],
  },
  {
    id: "C010", name: "Hải Sản", slug: "hai-san", icon: "🦞", parentId: null, itemCount: 0,
    shops: [
      {
        shopId: "S013", shopName: "Lẩu Thái Cô Nga", owner: "Hoàng Thị Nga",
        items: [
          { id: "M046", name: "Lẩu thái hải sản 4 người", price: 380000 },
          { id: "M047", name: "Lẩu thái bò 2 người", price: 320000 },
          { id: "M048", name: "Tôm hấp bia", price: 180000 },
          { id: "M049", name: "Mực nướng sa tế", price: 150000 },
        ],
      },
      {
        shopId: "S014", shopName: "Hải Sản Tươi Sống Biển Đông", owner: "Lý Văn Biển",
        items: [
          { id: "M050", name: "Cua rang muối", price: 250000 },
          { id: "M051", name: "Ghẹ hấp sả", price: 200000 },
          { id: "M052", name: "Ngao hấp gừng", price: 120000 },
        ],
      },
    ],
  },
];
