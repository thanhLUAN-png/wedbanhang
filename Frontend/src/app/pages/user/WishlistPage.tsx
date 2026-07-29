import { Link } from "react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "../../components/user/ProductCard";
import { mockShopProducts } from "../../data/mockShopProducts";
import { useCart } from "../../context/CartContext";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const products = mockShopProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        <h1 className="text-xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">{products.length}</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-red-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có sản phẩm yêu thích</h3>
          <p className="text-gray-500 text-sm mb-6">Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào danh sách yêu thích.</p>
          <Link to="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors inline-block">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => <ProductCard key={p.id} product={p} alwaysShowActions={true} />)}
        </div>
      )}
    </div>
  );
}
