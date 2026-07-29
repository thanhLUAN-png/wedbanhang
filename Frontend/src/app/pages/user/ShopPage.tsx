import { useState } from "react";
import { useParams, Link } from "react-router";
import { Star, Users, Package, MessageCircle, MapPin } from "lucide-react";
import { shops, mockShopProducts } from "../../data/mockShopProducts";
import { ProductCard } from "../../components/user/ProductCard";

export default function ShopPage() {
  const { id } = useParams();
  const shop = shops.find(s => s.id === id) || shops[0];
  const products = mockShopProducts.filter(p => p.shopId === shop.id);
  const [tab, setTab] = useState<"all" | string>("all");

  const categories = [...new Set(products.map(p => p.category))];
  const filtered = tab === "all" ? products : products.filter(p => p.category === tab);

  return (
    <div>
      {/* Shop Banner */}
      <div className="relative h-40 md:h-56 bg-gradient-to-r from-orange-400 to-red-400">
        <img src={shop.banner} alt="" className="w-full h-full object-cover opacity-60" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Shop Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-10 relative z-10 p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img src={shop.avatar} alt={shop.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/f97316/fff?text=S"; }} />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{shop.rating} đánh giá</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-gray-400" />{shop.followers.toLocaleString("vi-VN")} theo dõi</span>
                <span className="flex items-center gap-1"><Package className="h-4 w-4 text-gray-400" />{shop.totalProducts} sản phẩm</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-400" />{shop.location}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/chat" className="flex items-center gap-2 px-4 py-2.5 border border-orange-200 bg-orange-50 text-orange-500 rounded-xl text-sm hover:bg-orange-100 transition-colors font-medium">
                <MessageCircle className="h-4 w-4" />Chat
              </Link>
              <button className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-colors font-medium">+ Theo dõi</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { label: "Tỷ lệ phản hồi", value: shop.responseRate },
              { label: "Đánh giá", value: `${shop.rating} / 5` },
              { label: "Tổng sản phẩm", value: shop.totalProducts },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-bold text-orange-500">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex gap-2 overflow-x-auto">
              <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${tab === "all" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-200"}`}>Tất cả ({products.length})</button>
              {categories.map(c => (
                <button key={c} onClick={() => setTab(c)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${tab === c ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-200"}`}>{c}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Không có sản phẩm nào</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-8">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
