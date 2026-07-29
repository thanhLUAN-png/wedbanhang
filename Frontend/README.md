# Frontend

Giao diện React + Vite cho khách hàng, người bán, shipper và quản trị viên.

## Chạy giao diện

```powershell
cd Frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

## API tạm thời

`server/index.js` là Node.js API hiện có, chạy cùng lệnh `npm run dev` tại cổng `3001`.
Nó dùng SQLite ở `server/database.sqlite` để phục vụ luồng đăng nhập/đăng ký hiện tại.

Khi hoàn thiện Backend .NET, các API này sẽ được chuyển dần sang .NET và SQL Server.
