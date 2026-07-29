# WEDBANDOAN

## Cấu trúc dự án

```text
WEDBANDOAN/
├── Frontend/                 # React + Vite: giao diện user, seller, shipper, admin
│   ├── src/app/pages/        # Các trang giao diện theo vai trò
│   ├── src/app/components/   # Thành phần dùng chung và layout
│   └── server/               # Node API tạm thời + SQLite cho chức năng đăng nhập hiện tại
├── Backend/                  # ASP.NET Core MVC + SQL Server LocalDB
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Views/
│   └── appsettings.Development.json
├── WEDBANDOAN.slnx           # Mở Backend bằng Visual Studio
└── README.md
```

## Chạy Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Chạy Backend .NET

```powershell
cd Backend
dotnet run
```

Backend chạy mặc định ở `http://localhost:5092` (hoặc HTTPS `https://localhost:7180`).

## Lưu ý hiện tại

Frontend đang gọi Node API tạm thời ở cổng `3001` để đăng nhập/đăng ký và dùng SQLite.
Backend .NET đang kết nối SQL Server LocalDB và có phần Seller Portal. Hai phần chưa được hợp nhất hoàn toàn; kế hoạch tiếp theo là chuyển dần API Node/SQLite sang Backend .NET/SQL Server.
