import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { ShopProduct } from "../../data/mockShopProducts";
import { useCart } from "../../context/CartContext";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatSold(sold: number) {
  return sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : `${sold}`;
}

interface ProductCardProps {
  product: ShopProduct;
  showFlashSale?: boolean;
  alwaysShowActions?: boolean;
}

export function ProductCard({ product, showFlashSale, alwaysShowActions }: ProductCardProps) {
  const { addItem, toggleWishlist, isInWishlist, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const inCart = items.some((i) => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
  }

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={imgError ? "https://placehold.co/300x300/f1f5f9/94a3b8?text=SP" : product.image}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
        {showFlashSale ? (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1 z-10">
            ⚡ Flash Sale {discount > 0 ? `-${discount}%` : ""}
          </span>
        ) : (
          discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium z-10">
              -{discount}%
            </span>
          )
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-0" />
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-opacity hover:bg-white ${alwaysShowActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>
        <button
          onClick={inCart ? (e) => e.preventDefault() : handleAddToCart}
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-opacity whitespace-nowrap ${alwaysShowActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"} ${inCart ? "bg-gray-500 cursor-default" : "bg-orange-500 hover:bg-orange-600"}`}
        >
          <ShoppingCart className="h-3 w-3" />
          {inCart ? "Đã có trong giỏ" : "Thêm vào giỏ"}
        </button>
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem] leading-5">{product.name}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-orange-500 font-semibold text-base">{formatVND(product.price)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">{formatVND(product.originalPrice)}</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">Đã bán {formatSold(product.sold)}</span>
        </div>
        <div className="mt-1 text-xs text-gray-400 truncate">{product.shopName}</div>
      </div>
    </Link>
  );
}
