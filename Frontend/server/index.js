import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env thủ công vì server chạy cùng Vite không cần dotenv
const envPath = path.join(__dirname, '.env');
const envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
  });
} catch (e) { console.log('Không đọc được .env'); }

const GMAIL_USER = envVars.GMAIL_USER || '';
const GMAIL_APP_PASSWORD = envVars.GMAIL_APP_PASSWORD || '';
const GOOGLE_CLIENT_ID = envVars.GOOGLE_CLIENT_ID || '';
const PORT = parseInt(envVars.PORT || '3001');

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE ---
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error('Lỗi kết nối DB:', err.message); return; }
  console.log('✅ Đã kết nối SQLite database.');
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'buyer',
    google_id TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS otp_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    type TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0
  )`);

  // Tự động nâng cấp database cũ và tạo tài khoản demo theo vai trò.
  db.all('PRAGMA table_info(users)', (schemaErr, columns) => {
    if (schemaErr) {
      console.error('Lỗi kiểm tra cấu trúc bảng users:', schemaErr.message);
      return;
    }

    const seedDemoAccounts = () => {
      const demoPassword = bcrypt.hashSync('123456', 10);
      const accounts = [
        ['Nguyễn Văn A', 'nguyenvana.seller@shopviet.vn', '0987654321', demoPassword, 'seller'],
        ['Nguyễn Văn Nam', 'seller@example.com', '0912000001', demoPassword, 'seller'],
        ['Trần Văn Shipper', 'shipper@example.com', '0909123456', demoPassword, 'shipper'],
        ['Quản trị viên', 'admin@shopviet.vn', '0901999999', demoPassword, 'admin'],
      ];

      const statement = db.prepare(`
        INSERT INTO users (name, email, phone, password, role)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
          password = excluded.password,
          role = excluded.role
      `);
      accounts.forEach(account => statement.run(account));
      statement.finalize(seedErr => {
        if (seedErr) console.error('Lỗi tạo tài khoản demo:', seedErr.message);
        else console.log('✅ Đã sẵn sàng tài khoản demo seller và shipper.');
      });
    };

    const requiredColumns = [
      { name: 'role', sql: "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'buyer'" },
      { name: 'google_id', sql: 'ALTER TABLE users ADD COLUMN google_id TEXT' },
      { name: 'avatar', sql: 'ALTER TABLE users ADD COLUMN avatar TEXT' },
      { name: 'created_at', sql: 'ALTER TABLE users ADD COLUMN created_at DATETIME' },
    ];
    const existingColumns = new Set(columns.map(column => column.name));
    const missingColumns = requiredColumns.filter(column => !existingColumns.has(column.name));

    const migrateNextColumn = index => {
      if (index >= missingColumns.length) {
        seedDemoAccounts();
        return;
      }

      const column = missingColumns[index];
      db.run(column.sql, migrationErr => {
        if (migrationErr) {
          console.error(`Lỗi thêm cột ${column.name}:`, migrationErr.message);
          return;
        }
        migrateNextColumn(index + 1);
      });
    };

    migrateNextColumn(0);
  });
});

// --- NODEMAILER ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

async function sendOTPEmail(toEmail, otp, type) {
  const subject = type === 'register' ? '🔐 Mã OTP Đăng ký tài khoản ShopFoodVN' : '🔑 Mã OTP Đặt lại mật khẩu ShopFoodVN';
  const action = type === 'register' ? 'xác minh đăng ký tài khoản' : 'đặt lại mật khẩu';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #f97316, #ef4444); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🍜 ShopFoodVN</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Mã xác minh của bạn</p>
      </div>
      <div style="padding: 30px; text-align: center;">
        <p style="color: #555; font-size: 15px;">Đây là mã OTP để <strong>${action}</strong>:</p>
        <div style="background: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <span style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #f97316;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px;">⏰ Mã này có hiệu lực trong <strong>5 phút</strong>.</p>
        <p style="color: #f87171; font-size: 13px; margin-top: 10px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
      </div>
      <div style="background: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #aaa; font-size: 12px; margin: 0;">© 2026 ShopFoodVN. All rights reserved.</p>
      </div>
    </div>
  `;
  await transporter.sendMail({ from: `"ShopFoodVN" <${GMAIL_USER}>`, to: toEmail, subject, html });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- GOOGLE OAUTH ---
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ============================================================
// ROUTES
// ============================================================

// Gửi OTP (dùng cho đăng ký)
app.post('/api/send-otp', async (req, res) => {
  const { email, type = 'register' } = req.body;
  if (!email) return res.status(400).json({ error: 'Vui lòng cung cấp email' });

  if (type === 'register') {
    const existing = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err); else resolve(row);
      });
    });
    if (existing) return res.status(400).json({ error: 'Email này đã được đăng ký' });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút

  db.run('DELETE FROM otp_tokens WHERE email = ? AND type = ?', [email, type]);
  db.run('INSERT INTO otp_tokens (email, otp, type, expires_at) VALUES (?, ?, ?, ?)',
    [email, otp, type, expiresAt]);

  try {
    await sendOTPEmail(email, otp, type);
    res.json({ message: `Đã gửi mã OTP đến ${email}` });
  } catch (err) {
    console.error('Lỗi gửi email:', err);
    res.status(500).json({ error: 'Không thể gửi email. Kiểm tra lại cấu hình Gmail.' });
  }
});

// Xác minh OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp, type } = req.body;
  if (!email || !otp || !type) return res.status(400).json({ error: 'Thiếu thông tin' });

  db.get(
    'SELECT * FROM otp_tokens WHERE email = ? AND type = ? AND used = 0 ORDER BY id DESC LIMIT 1',
    [email, type],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Lỗi server' });
      if (!row) return res.status(400).json({ error: 'Mã OTP không tồn tại hoặc đã hết hạn' });
      if (Date.now() > row.expires_at) return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
      if (row.otp !== otp) return res.status(400).json({ error: 'Mã OTP không đúng' });

      db.run('UPDATE otp_tokens SET used = 1 WHERE id = ?', [row.id]);
      res.json({ message: 'Xác minh OTP thành công' });
    }
  );
});

// Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, 'buyer'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email hoặc số điện thoại đã được đăng ký' });
          }
          return res.status(500).json({ error: 'Lỗi server' });
        }
        res.status(201).json({ message: 'Đăng ký thành công', id: this.lastID });
      }
    );
  } catch {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đăng nhập
app.post('/api/login', (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email/sđt và mật khẩu' });
  }
  db.get(
    'SELECT * FROM users WHERE email = ? OR phone = ?',
    [emailOrPhone, emailOrPhone],
    async (err, user) => {
      if (err) return res.status(500).json({ error: 'Lỗi server' });
      if (!user) return res.status(400).json({ error: 'Tài khoản không tồn tại' });
      if (!user.password) return res.status(400).json({ error: 'Tài khoản này đăng nhập bằng Google. Vui lòng dùng nút Đăng nhập Google.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Mật khẩu không chính xác' });

      const { password: _, ...userData } = user;
      res.json({ message: 'Đăng nhập thành công', user: userData });
    }
  );
});

// Quên mật khẩu - Bước 1: Gửi OTP (dùng /api/send-otp với type=forgot)
// Quên mật khẩu - Bước 2: Đặt lại mật khẩu mới
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin' });

  db.get(
    'SELECT * FROM otp_tokens WHERE email = ? AND type = ? AND used = 0 ORDER BY id DESC LIMIT 1',
    [email, 'forgot'],
    async (err, row) => {
      if (err) return res.status(500).json({ error: 'Lỗi server' });
      if (!row) return res.status(400).json({ error: 'Mã OTP không tồn tại' });
      if (Date.now() > row.expires_at) return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
      if (row.otp !== otp) return res.status(400).json({ error: 'Mã OTP không đúng' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err2) => {
        if (err2) return res.status(500).json({ error: 'Lỗi cập nhật mật khẩu' });
        db.run('UPDATE otp_tokens SET used = 1 WHERE id = ?', [row.id]);
        res.json({ message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' });
      });
    }
  );
});

// Đăng nhập bằng Google
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Thiếu token Google' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    db.get('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId], async (err, user) => {
      if (err) return res.status(500).json({ error: 'Lỗi server' });

      if (user) {
        // Cập nhật google_id nếu chưa có
        if (!user.google_id) {
          db.run('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?', [googleId, picture, user.id]);
        }
        const { password: _, ...userData } = { ...user, google_id: googleId, avatar: picture };
        return res.json({ message: 'Đăng nhập Google thành công', user: userData });
      }

      // Tạo tài khoản mới từ Google
      db.run(
        'INSERT INTO users (name, email, google_id, avatar) VALUES (?, ?, ?, ?)',
        [name, email, googleId, picture],
        function (err2) {
          if (err2) return res.status(500).json({ error: 'Lỗi tạo tài khoản' });
          res.status(201).json({
            message: 'Đăng ký & Đăng nhập Google thành công',
            user: { id: this.lastID, name, email, avatar: picture, google_id: googleId }
          });
        }
      );
    });
  } catch (err) {
    console.error('❌ Lỗi xác thực Google:', err?.message || err);
    console.error('GOOGLE_CLIENT_ID hiện tại:', GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 30) + '...' : 'KHÔNG CÓ');
    res.status(400).json({ error: 'Token Google không hợp lệ: ' + (err?.message || 'Lỗi không xác định') });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
