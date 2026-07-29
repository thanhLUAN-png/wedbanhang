import { useLocation } from "react-router";

export default function PlaceholderPage() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Đang phát triển</h1>
      <p className="text-gray-500 max-w-md">
        Trang <span className="font-mono text-orange-500">{location.pathname}</span> đang trong quá trình xây dựng. Vui lòng quay lại sau!
      </p>
    </div>
  );
}
