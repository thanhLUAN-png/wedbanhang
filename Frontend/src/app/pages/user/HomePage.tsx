import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  MapPin,
  Search,
  Star,
  TicketPercent,
  X,
} from "lucide-react";
import { ProductCard } from "../../components/user/ProductCard";
import {
  categories,
  mockShopProducts,
} from "../../data/mockShopProducts";
import type { Shop, ShopProduct } from "../../data/mockShopProducts";
import { getPromoNotifications, savePromoNotifications, type Notification } from "../../data/mockNotifications";

const uniqueFoodAssets = import.meta.glob("../../../assets/food-unique/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function uniqueFoodImage(slug: string) {
  return uniqueFoodAssets[`../../../assets/food-unique/${slug}.png`];
}

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href = "/search",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">{eyebrow}</p>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <Link to={href} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-slate-700 hover:text-orange-600 sm:flex">
        Xem tất cả <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Hero() {
  const [luckyDeal, setLuckyDeal] = useState<null | {
    product: (typeof mockShopProducts)[number];
    displayName: string;
    image: string;
    code: string;
    discount: number;
    distance: number;
  }>(null);

  const foodItems = [
    { slug: "pho-bo", displayName: "Phở bò tái", productId: "f003" },
    { slug: "com-suon", displayName: "Cơm sườn trứng", productId: "f001" },
    { slug: "com-gao-lut", displayName: "Cơm gạo lứt", productId: "f009" },
    { slug: "mi-xao-bo", displayName: "Mì xào bò", productId: "f007" },
    { slug: "mi-xao-rau", displayName: "Mì xào rau", productId: "f007" },
    { slug: "ca-nuong", displayName: "Cá nướng rau củ", productId: "f009" },
    { slug: "ca-phe-sua", displayName: "Cà phê sữa đá", productId: "f010" },
    { slug: "cha-gio", displayName: "Chả giò giòn", productId: "f011" },
    { slug: "goi-cuon", displayName: "Gỏi cuốn tôm thịt", productId: "f011" },
    { slug: "tra-sua", displayName: "Trà sữa trân châu", productId: "f002" },
    { slug: "thit-xien", displayName: "Thịt xiên nướng", productId: "f004" },
    { slug: "banh-xeo", displayName: "Bánh xèo miền Tây", productId: "f013" },
    { slug: "ca-ri-dau-hu", displayName: "Cà ri đậu hũ", productId: "f009" },
    { slug: "banh-mi", displayName: "Bánh mì thịt nướng", productId: "f013" },
    { slug: "lau-ca", displayName: "Lẩu cá rau củ", productId: "f012" },
    { slug: "banh-bao", displayName: "Bánh bao hấp", productId: "f005" },
    { slug: "sushi", displayName: "Sushi cuộn", productId: "f008" },
    { slug: "ca-ri-ga", displayName: "Cà ri gà", productId: "f009" },
    { slug: "dim-sum", displayName: "Dimsum hấp", productId: "f005" },
    { slug: "rau-xao", displayName: "Rau củ xào", productId: "f006" },
  ].map(item => ({
    ...item,
    image: uniqueFoodImage(item.slug),
    product: mockShopProducts.find(product => product.id === item.productId)!,
  }));

  const foodLanes = [
    { path: "M 185 -45 C 170 92 94 145 -45 175", reverse: false, duration: 17, size: 62, count: 2 },
    { path: "M 355 -45 C 330 132 235 270 -45 322", reverse: true, duration: 20, size: 64, count: 3 },
    { path: "M 535 -45 C 510 175 405 360 -45 470", reverse: false, duration: 22, size: 66, count: 4 },
    { path: "M 700 -45 C 688 208 595 402 115 505", reverse: true, duration: 24, size: 68, count: 5 },
    { path: "M 835 -45 C 872 205 825 407 610 505", reverse: false, duration: 19, size: 70, count: 6 },
  ];

  function luckyClaimStorageKey() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userKey = user?.id || user?.email || user?.phone || "guest";
      return `shopfoodvn_lucky_claims_${encodeURIComponent(String(userKey))}`;
    } catch {
      return "shopfoodvn_lucky_claims_guest";
    }
  }

  function revealLuckyDish(food: (typeof foodItems)[number]) {
    const { product, displayName, image } = food;
    const discountOptions = [15, 20, 25, 30, 35];
    const discount = discountOptions[Math.floor(Math.random() * discountOptions.length)];
    const distance = Number((0.6 + Math.random() * 8.3).toFixed(1));
    const code = `MONNGON${discount}`;

    setLuckyDeal({
      product,
      displayName,
      image,
      discount,
      distance,
      code,
    });

    const notification: Notification = {
      id: `lucky-${Date.now()}`,
      type: "promo",
      title: `Bạn vừa nhận mã giảm ${discount}%`,
      message: `${code} dành cho ${displayName} tại ${product.shopName} · cách bạn ${distance} km.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      link: `/product/${product.id}`,
      image,
    };
    savePromoNotifications([notification, ...getPromoNotifications()].slice(0, 20));
  }

  function claimLuckyDish() {
    const storageKey = luckyClaimStorageKey();
    const claimedCount = Number(localStorage.getItem(storageKey) || "0");

    if (claimedCount >= 2) {
      toast.info("Bạn đã nhận đủ 2 mã giảm giá dành cho tài khoản này");
      return;
    }

    const food = foodItems[Math.floor(Math.random() * foodItems.length)];
    localStorage.setItem(storageKey, String(claimedCount + 1));
    revealLuckyDish(food);
    toast.success(`Đã nhận mã giảm giá ${claimedCount + 1}/2`);
  }

  function handleHeroClick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a, button, [data-ignore-lucky]") !== null) return;
    claimLuckyDish();
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.55fr_0.75fr]">
      <div
        className="relative min-h-[380px] cursor-pointer overflow-hidden rounded-[28px] bg-[#24150e] md:min-h-[430px]"
        onClick={handleHeroClick}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            claimLuckyDish();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Bấm vào banner để nhận mã giảm giá, tối đa hai mã mỗi tài khoản"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,#7c351e_0%,#3a1d13_32%,#24150e_70%)]" />
        <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -left-4 -top-8 h-44 w-44 rounded-full border border-white/5" />

        <div className="pointer-events-none absolute inset-0 z-30 hidden overflow-hidden lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 820 430" preserveAspectRatio="none" aria-hidden="true">
            {foodLanes.map((lane, index) => (
              <path key={index} d={lane.path} fill="none" stroke="rgba(251,146,60,0.22)" strokeWidth="1.4" />
            ))}
          </svg>
          {foodLanes.flatMap((lane, laneIndex) =>
            Array.from({ length: lane.count }, (_, itemIndex) => {
              const firstFoodIndex = foodLanes.slice(0, laneIndex).reduce((total, currentLane) => total + currentLane.count, 0);
              const food = foodItems[firstFoodIndex + itemIndex];
              const delay = -(itemIndex * lane.duration / lane.count) - laneIndex * 0.7;
              return (
                <div
                  key={`${laneIndex}-${itemIndex}`}
                  className="absolute left-0 top-0 rounded-full"
                  style={{
                    width: `${lane.size}px`,
                    offsetPath: `path('${lane.path}')`,
                    offsetRotate: "0deg",
                    animation: `${lane.reverse ? "foodStreamReverse" : "foodStreamForward"} ${lane.duration}s linear ${delay}s infinite`,
                  }}
                >
                  <img
                    src={food.image}
                    alt={food.displayName}
                    className="w-full select-none object-contain drop-shadow-[0_12px_10px_rgba(0,0,0,0.42)]"
                  />
                </div>
              );
            })
          )}
        </div>

        <div className="relative z-40 flex h-full max-w-full flex-col justify-end p-7 text-white md:p-11 lg:max-w-[58%]">
          <div className="mb-auto" />
          <p className="mb-3 text-sm font-semibold text-orange-300">Bữa ngon quanh bạn</p>
          <h1 className="max-w-lg text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] md:text-5xl">
            Hôm nay ăn gì, để ShopFoodVN lo.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75 md:text-base">
            Món Việt nóng hổi từ những quán được yêu thích, giao đến tận cửa khi bạn còn đang chọn phim.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 hover:bg-orange-400">
              <Search className="h-4 w-4" /> Tìm món ngay
            </Link>
          </div>
        </div>

        <div className="absolute right-2 top-4 z-10 grid w-[48%] grid-cols-2 gap-1 lg:hidden">
          {foodItems.slice(0, 4).map((food, index) => (
            <div key={food.slug}>
              <img src={food.image} alt={food.displayName} className="w-full object-contain drop-shadow-lg [animation:foodFloat_3s_ease-in-out_infinite]" style={{ animationDelay: `${index * -0.6}s` }} />
            </div>
          ))}
        </div>

        {luckyDeal && (
          <div data-ignore-lucky className="absolute bottom-5 right-5 z-50 w-[min(330px,calc(100%-40px))] rounded-2xl border border-orange-100 bg-white p-4 text-slate-900 shadow-2xl shadow-black/25 [animation:dealDrop_.55s_cubic-bezier(.2,.9,.3,1.2)]">
            <button onClick={() => setLuckyDeal(null)} className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng">
              <X className="h-4 w-4" />
            </button>
            <div className="flex gap-3 pr-5">
              <img src={luckyDeal.image} alt={luckyDeal.displayName} className="h-16 w-16 rounded-xl object-contain" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Món may mắn của bạn</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5">{luckyDeal.displayName}</h3>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2">
              <div>
                <p className="text-[10px] text-slate-500">Mã giảm {luckyDeal.discount}%</p>
                <p className="font-mono text-sm font-extrabold text-orange-600">{luckyDeal.code}</p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700"><MapPin className="h-3.5 w-3.5 text-orange-500" /> {luckyDeal.distance} km</p>
                <p className={`mt-0.5 text-[10px] font-semibold ${luckyDeal.distance <= 3 ? "text-emerald-600" : "text-amber-600"}`}>
                  {luckyDeal.distance <= 3 ? "Hên quá, quán ở gần!" : "Hơi xa một chút nha"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="truncate text-xs text-slate-500">{luckyDeal.product.shopName}</p>
              <Link to={`/product/${luckyDeal.product.id}`} className="shrink-0 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500">
                Xem món
              </Link>
            </div>
          </div>
        )}

        <style>{`
          @keyframes foodStreamForward { from { offset-distance: 0%; } to { offset-distance: 100%; } }
          @keyframes foodStreamReverse { from { offset-distance: 100%; } to { offset-distance: 0%; } }
          @keyframes foodFloat { 0%, 100% { transform: translateY(-6px); } 50% { transform: translateY(8px); } }
          @keyframes dealDrop { 0% { opacity: 0; transform: translateY(-70px) scale(.85) rotate(-3deg); } 70% { opacity: 1; transform: translateY(8px) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
        `}</style>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="relative overflow-hidden rounded-[28px] bg-[#fff1df] p-6">
          <div className="relative z-10 max-w-[70%]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
              <TicketPercent className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Deal bữa trưa</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900">Giảm 30% món Việt</h3>
            <p className="mt-2 text-sm leading-5 text-slate-600">Nhập mã <strong>NGON30</strong>, áp dụng từ 10:30–13:30.</p>
          </div>
          <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-orange-300/40" />
          <div className="absolute bottom-5 right-5 text-6xl drop-shadow-sm">🍱</div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Giao đến</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Nhà của bạn</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">Chọn địa chỉ để xem đúng quán đang mở và thời gian giao thực tế.</p>
          <Link to="/search" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-orange-600">
            Khám phá gần đây <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [sqlShops, setSqlShops] = useState<Shop[]>([]);
  const [sqlProducts, setSqlProducts] = useState<ShopProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    fetch("/seller-api/public/catalog")
      .then(response => {
        if (!response.ok) throw new Error("Không thể tải thực đơn");
        return response.json();
      })
      .then(data => {
        const loadedShops: Shop[] = (data.shops || []).map((shop: any) => ({
          id: `sql-shop-${shop.id}`,
          name: shop.name,
          avatar: shop.logoUrl || "https://placehold.co/160x160/fff7ed/f97316?text=QUAN",
          banner: shop.logoUrl || "https://placehold.co/900x360/fff7ed/f97316?text=QUAN+AN",
          rating: Number(shop.rating || 0),
          followers: Number(shop.ratingCount || 0),
          totalProducts: (data.products || []).filter((product: any) => product.shopId === shop.id).length,
          responseRate: "0%",
          location: shop.address || "Chưa cập nhật địa chỉ",
          joinedAt: "",
        }));
        const loadedProducts: ShopProduct[] = (data.products || []).map((product: any) => ({
          id: `sql-product-${product.id}`,
          name: product.name,
          slug: `sql-product-${product.id}`,
          price: Number(product.price),
          image: product.imageUrl || "https://placehold.co/500x500/f8fafc/f97316?text=MON+AN",
          images: [product.imageUrl || "https://placehold.co/500x500/f8fafc/f97316?text=MON+AN"],
          rating: Number(product.shopRating || 0),
          reviewCount: 0,
          sold: 0,
          stock: 999,
          category: product.category || "Khác",
          categoryId: String(product.category || "khac").toLowerCase(),
          shopId: `sql-shop-${product.shopId}`,
          shopName: product.shopName,
          shopAvatar: product.shopLogoUrl || "https://placehold.co/160x160/fff7ed/f97316?text=QUAN",
          shopRating: Number(product.shopRating || 0),
          shopFollowers: 0,
          restaurantId: Number(product.shopId),
          toppings: (() => { try { const value=JSON.parse(product.toppingsJson||"[]"); return Array.isArray(value)?value:[]; } catch { return []; } })(),
          description: product.description || "",
          specifications: [],
          tags: [],
        }));
        setSqlShops(loadedShops);
        setSqlProducts(loadedProducts);
      })
      .catch(() => {
        setSqlShops([]);
        setSqlProducts([]);
      })
      .finally(() => setCatalogLoading(false));
  }, []);

  const quickDeals = sqlProducts.slice(0, 3);

  return (
    <div className="bg-[#faf9f7]">
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-6 md:py-8">
        <Hero />

        <section>
          <SectionHeading eyebrow="Chọn nhanh" title="Bạn đang thèm món gì?" description="Gợi ý theo đúng kiểu bữa ăn của bạn" />
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/search?category=${category.id}`}
                className="group min-w-[116px] rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:shadow-md"
              >
                <span className="block text-3xl transition-transform group-hover:scale-110">{category.icon}</span>
                <span className="mt-4 block text-sm font-bold text-slate-800">{category.name}</span>
                <span className="mt-1 block text-[11px] text-slate-400">{category.count.toLocaleString("vi-VN")} lựa chọn</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Đang mở cửa" title="Quán ngon gần bạn" description="Được khách quanh khu vực đặt nhiều trong hôm nay" />
          <div className="grid gap-4 md:grid-cols-3">
            {sqlShops.slice(0, 3).map((shop, index) => (
              <Link key={shop.id} to={`/shop/${shop.id}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-950/5">
                <div className="relative h-36 overflow-hidden">
                  <img src={shop.banner} alt={shop.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-emerald-600">Mở cửa</span>
                  {index === 0 && <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">Được yêu thích</span>}
                </div>
                <div className="flex gap-3 p-4">
                  <img src={shop.avatar} alt="" className="h-12 w-12 rounded-2xl border-2 border-white object-cover shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-slate-900">{shop.name}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{shop.rating}</span>
                      <span>20–30 phút</span>
                      <span>1,2 km</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!catalogLoading && sqlShops.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                Hiện chưa có quán nào đang hoạt động.
              </p>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-[#17201b] p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Chỉ trong hôm nay</p>
              <h2 className="mt-2 text-2xl font-extrabold">Món ngon, giá dễ chịu</h2>
            </div>
            <p className="text-sm text-white/55">Kết thúc lúc 22:00 · số lượng có hạn</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quickDeals.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex gap-3 rounded-2xl bg-white/8 p-3 transition-colors hover:bg-white/14">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="min-w-0 py-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">{product.name}</p>
                  <p className="mt-2 font-bold text-orange-400">{formatVND(product.price)}</p>
                  <p className="text-xs text-white/40 line-through">{product.originalPrice ? formatVND(product.originalPrice) : ""}</p>
                </div>
              </Link>
            ))}
            {!catalogLoading && quickDeals.length === 0 && <p className="text-sm text-white/60">Chưa có món đang bán.</p>}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Khách đặt nhiều" title="Món nổi bật hôm nay" description="Những lựa chọn khó sai cho bữa ăn đầu tiên" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sqlProducts.slice(0, 5).map(product => <ProductCard key={product.id} product={product} />)}
            {!catalogLoading && sqlProducts.length === 0 && <p className="col-span-full text-sm text-slate-500">Chưa có món từ quán đang hoạt động.</p>}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Gợi ý riêng" title="Đổi món một chút nhé" description="Thêm vài lựa chọn khác từ các quán đang phục vụ" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sqlProducts.slice(5, 10).map(product => <ProductCard key={product.id} product={product} />)}
            {!catalogLoading && sqlProducts.length <= 5 && <p className="col-span-full text-sm text-slate-500">Chưa có thêm món gợi ý.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
