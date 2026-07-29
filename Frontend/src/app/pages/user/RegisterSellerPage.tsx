import { useState } from "react";
import { Store, Upload, CheckCircle2, ChevronRight, Storefront } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function RegisterSellerPage() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and mark user as seller
    localStorage.setItem("isSeller", "true");
    navigate("/seller");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-orange-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trở thành Đối tác Bán hàng</h1>
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto">
            Mở rộng tệp khách hàng, tăng trưởng doanh thu với hàng triệu người dùng trên ShopFoodVN. Đăng ký hoàn toàn miễn phí!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Thông tin đăng ký</h2>
          
          <form 
            onSubmit={handleRegister}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Quán / Cửa hàng <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="VD: Cơm Tấm Sài Gòn" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email liên hệ <span className="text-red-500">*</span></label>
                <input required type="email" placeholder="VD: contact@shop.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ quán <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Người đại diện <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Họ và tên" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                <input required type="tel" placeholder="09xxxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">CCCD (Mặt trước & Mặt sau) <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500"><span className="font-semibold text-orange-500">Tải ảnh CCCD lên</span></p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Giấy phép kinh doanh <span className="text-gray-400 font-normal">(Nếu có)</span></label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500"><span className="font-semibold text-orange-500">Tải ảnh GPKD lên</span></p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 mb-4 cursor-pointer">
                <input required type="checkbox" className="mt-1 w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500" />
                <span className="text-sm text-gray-600">
                  Tôi đã đọc và đồng ý với <a href="#" className="text-orange-500 hover:underline">Điều khoản Dịch vụ</a> và Chính sách bảo mật của ShopFoodVN.
                </span>
              </label>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                GỬI YÊU CẦU ĐĂNG KÝ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
