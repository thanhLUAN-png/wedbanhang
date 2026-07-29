import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, Heart, ShoppingCart, ChevronRight, Store, MessageCircle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { mockShopProducts } from "../../data/mockShopProducts";
import { ProductCard } from "../../components/user/ProductCard";
import { useCart } from "../../context/CartContext";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const product = mockShopProducts.find((p) => p.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startAutoSlide(images: string[]) {
    if (images.length <= 1) return;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % images.length);
    }, 5000);
  }

  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    startAutoSlide(product.images);
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  function handleSelectImg(i: number, images: string[]) {
    setActiveImg(i);
    startAutoSlide(images);
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">Về trang chủ</Link>
      </div>
    );
  }

  const related = mockShopProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5);
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  function handleAddToCart() {
    addItem(product, qty);
    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
  }

  function handleBuyNow() {
    addItem(product, qty);
    navigate("/cart");
  }

  const mockReviews = [
    { id: 1, user: "Nguyễn Văn B", rating: 5, comment: "Sản phẩm tốt, đúng mô tả, giao hàng nhanh. Rất hài lòng!", date: "10/07/2026", variant: "Size M - Màu đen" },
    { id: 2, user: "Trần Thị C", rating: 4, comment: "Chất lượng ổn, giá hợp lý. Shop đóng gói cẩn thận.", date: "08/07/2026", variant: "" },
    { id: 3, user: "Lê Minh D", rating: 5, comment: "Mua lần 2 rồi, lần nào cũng ưng. Sẽ tiếp tục ủng hộ shop!", date: "05/07/2026", variant: "" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
        <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/search?category=${product.categoryId}`} className="hover:text-orange-500">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-3 aspect-square">
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/f1f5f9/94a3b8?text=SP"; }} />
              {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">-{discount}%</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => handleSelectImg(i, product.images)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? "border-orange-500" : "border-gray-200"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/f1f5f9/94a3b8?text=SP"; }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.reviewCount.toLocaleString("vi-VN")} đánh giá</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">Đã bán {product.sold.toLocaleString("vi-VN")}</span>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-orange-500">{formatVND(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">{formatVND(product.originalPrice)}</span>
                )}
                {discount > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">-{discount}%</span>}
              </div>
            </div>

            {/* Qty */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Số lượng</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium border-x border-gray-200 min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-400">{product.stock} sản phẩm có sẵn</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-medium text-sm hover:bg-orange-50 transition-colors">
                <ShoppingCart className="h-5 w-5" />Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium text-sm transition-colors">
                Mua ngay
              </button>
              <button onClick={() => { toggleWishlist(product.id); toast.success(wishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"); }} className={`p-3 rounded-xl border-2 transition-colors ${wishlisted ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-red-200"}`}>
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Shop info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={product.shopAvatar} alt={product.shopName} className="w-12 h-12 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=S"; }} />
          <div>
            <div className="font-semibold text-gray-900">{product.shopName}</div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{product.shopRating}</span>
              <span>{product.shopFollowers.toLocaleString("vi-VN")} theo dõi</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/shop/${product.shopId}`} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Store className="h-4 w-4" />Xem shop
          </Link>
          <Link to="/chat" className="flex items-center gap-1.5 px-4 py-2 border border-orange-200 bg-orange-50 text-orange-500 rounded-xl text-sm hover:bg-orange-100 transition-colors">
            <MessageCircle className="h-4 w-4" />Chat
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex border-b border-gray-100 mb-5">
          {[{ id: "specs", label: "Mô tả sản phẩm" }, { id: "reviews", label: `Đánh giá (${mockReviews.length})` }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === t.id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-gray-100 rounded-xl overflow-hidden">
            {product.specifications.map((s, i) => (
              <div key={i} className={`flex items-start gap-0 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b border-gray-100 last:border-0`}>
                <div className="px-4 py-3 text-sm text-gray-500 w-40 shrink-0">{s.label}</div>
                <div className="px-4 py-3 text-sm text-gray-800 font-medium border-l border-gray-100">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5">
            <div className="flex items-center gap-6 p-5 bg-orange-50 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">{product.rating}</div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{product.reviewCount.toLocaleString("vi-VN")} đánh giá</div>
              </div>
            </div>
            <div className="space-y-4">
              {mockReviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-medium text-orange-600">
                      {r.user.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{r.user}</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{r.date}</span>
                  </div>
                  {r.variant && <div className="text-xs text-gray-400 mb-1">Phân loại: {r.variant}</div>}
                  <p className="text-sm text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
