import { useState } from "react";
import { Truck, Upload, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export default function RegisterShipperPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đăng ký thành công!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Cảm ơn bạn đã đăng ký trở thành đối tác giao hàng của ShopFoodVN. Chúng tôi sẽ xem xét hồ sơ và liên hệ lại với bạn trong thời gian sớm nhất.
        </p>
        <Link to="/" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
          Trở về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trở thành Đối tác Giao hàng</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Tự do tài chính, làm chủ thời gian. Đăng ký để trở thành Shipper đồng hành cùng ShopFoodVN ngay hôm nay!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Thông tin cá nhân</h2>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="VD: Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                <input required type="tel" placeholder="09xxxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ thường trú <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương tiện giao hàng <span className="text-red-500">*</span></label>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Chọn loại phương tiện</option>
                  <option value="motorbike">Xe máy</option>
                  <option value="bike">Xe đạp điện</option>
                  <option value="car">Xe ô tô tải nhỏ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biển số xe <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="VD: 59-X1 123.45" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">CCCD (Mặt trước & Mặt sau) <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500"><span className="font-semibold text-blue-500">Tải ảnh lên</span></p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Bằng lái xe & Cavet xe <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500"><span className="font-semibold text-blue-500">Tải ảnh lên</span></p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 mb-4 cursor-pointer">
                <input required type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">
                  Tôi đã đọc và đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản Dịch vụ</a> và Chính sách bảo mật của ShopFoodVN.
                </span>
              </label>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                GỬI HỒ SƠ ĐĂNG KÝ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
