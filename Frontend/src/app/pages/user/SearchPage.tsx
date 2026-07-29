import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, ChevronDown, X, Star } from "lucide-react";
import { ProductCard } from "../../components/user/ProductCard";
import { mockShopProducts, categories } from "../../data/mockShopProducts";

type SortOption = "relevance" | "newest" | "price_asc" | "price_desc" | "rating" | "sold";

const sortLabels: Record<SortOption, string> = {
  relevance: "Liên quan",
  newest:    "Mới nhất",
  price_asc: "Giá thấp nhất",
  price_desc:"Giá cao nhất",
  rating:    "Đánh giá cao",
  sold:      "Bán chạy nhất",
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const isFlashSale = searchParams.get("sale") === "flash";

  const [sort, setSort] = useState<SortOption>("relevance");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = mockShopProducts;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }

    if (selectedCategory) {
      results = results.filter(p => p.categoryId === selectedCategory);
    }

    if (isFlashSale) {
      results = results.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    if (priceMin) results = results.filter(p => p.price >= Number(priceMin) * 1000);
    if (priceMax) results = results.filter(p => p.price <= Number(priceMax) * 1000);
    if (minRating > 0) results = results.filter(p => p.rating >= minRating);

    switch (sort) {
      case "price_asc":  return [...results].sort((a, b) => a.price - b.price);
      case "price_desc": return [...results].sort((a, b) => b.price - a.price);
      case "rating":     return [...results].sort((a, b) => b.rating - a.rating);
      case "sold":       return [...results].sort((a, b) => b.sold - a.sold);
      default:           return results;
    }
  }, [query, selectedCategory, priceMin, priceMax, minRating, sort, isFlashSale]);

  function clearFilters() {
    setSelectedCategory("");
    setPriceMin("");
    setPriceMax("");
    setMinRating(0);
  }

  const hasFilters = selectedCategory || priceMin || priceMax || minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      {query && (
        <div className="mb-4">
          <h1 className="text-base text-gray-600">
            Kết quả tìm kiếm cho <span className="font-semibold text-gray-900">"{query}"</span> — {filtered.length} sản phẩm
          </h1>
        </div>
      )}
      {isFlashSale && !query && (
        <div className="mb-4">
          <h1 className="text-base text-gray-600">
            Tất cả sản phẩm <span className="font-semibold text-orange-500">Flash Sale</span> — {filtered.length} sản phẩm
          </h1>
        </div>
      )}

      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700">
          <SlidersHorizontal className="h-4 w-4" />Bộ lọc {hasFilters && <span className="w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">!</span>}
        </button>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
          {Object.entries(sortLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="flex gap-5">
        {/* Sidebar filters */}
        <aside className={`w-56 shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <SlidersHorizontal className="h-4 w-4 text-orange-500" />Bộ lọc
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-0.5">
                  <X className="h-3 w-3" />Xóa lọc
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="mb-5">
              <div className="text-sm font-medium text-gray-700 mb-2">Danh mục</div>
              <div className="space-y-1">
                <button onClick={() => setSelectedCategory("")} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!selectedCategory ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${selectedCategory === cat.id ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    <span>{cat.icon}</span>{cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="mb-5">
              <div className="text-sm font-medium text-gray-700 mb-2">Khoảng giá (nghìn đồng)</div>
              <div className="flex gap-2">
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Từ" className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
                <span className="text-gray-400 self-center">–</span>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Đến" className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Đánh giá tối thiểu</div>
              <div className="space-y-1">
                {[0, 4, 3].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)} className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${minRating === r ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    {r === 0 ? "Tất cả" : (<><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{r}★ trở lên</>)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Desktop sort bar */}
          <div className="hidden lg:flex items-center gap-3 mb-4 bg-white rounded-xl border border-gray-100 px-4 py-3">
            <span className="text-sm text-gray-500 mr-1">Sắp xếp:</span>
            {(Object.keys(sortLabels) as SortOption[]).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${sort === s ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {sortLabels[s]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 text-sm">Thử thay đổi từ khóa hoặc bộ lọc</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
