# 🚀 Backend UTS - Express + MySQL

## Struktur Project
```
backend-uts/
├── src/
│   ├── config/
│   │   └── database.js       # Koneksi MySQL
│   ├── controllers/
│   │   ├── authController.js     # Login & Register
│   │   ├── categoryController.js # CRUD Kategori
│   │   └── productController.js  # CRUD Produk
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   └── index.js              # Entry point
├── database.sql              # Schema database
├── .env.example              # Contoh konfigurasi
└── package.json
```

## Relasi Tabel
```
users ──< products >── categories
```
- 1 user bisa punya banyak products
- 1 category bisa punya banyak products

## Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Setup database
Buka MySQL dan jalankan:
```bash
mysql -u root -p < database.sql
```

### 3. Buat file .env
```bash
cp .env.example .env
```
Edit file `.env` sesuai konfigurasi MySQL kamu.

### 4. Jalankan server
```bash
# Mode development (auto-restart)
npm run dev

# Mode production
npm start
```

---

## Daftar Endpoint API

### 🔐 Auth
| Method | Endpoint | Keterangan | Auth |
|--------|----------|------------|------|
| POST | /api/auth/register | Daftar akun baru | ❌ |
| POST | /api/auth/login | Login | ❌ |
| GET | /api/auth/profile | Lihat profil sendiri | ✅ |

### 📦 Categories
| Method | Endpoint | Keterangan | Auth |
|--------|----------|------------|------|
| GET | /api/categories | Lihat semua kategori | ❌ |
| GET | /api/categories/:id | Lihat kategori by ID | ❌ |
| POST | /api/categories | Tambah kategori | ✅ |
| PUT | /api/categories/:id | Update kategori | ✅ |
| DELETE | /api/categories/:id | Hapus kategori | ✅ |

### 🛒 Products
| Method | Endpoint | Keterangan | Auth |
|--------|----------|------------|------|
| GET | /api/products | Lihat semua produk (+ relasi) | ❌ |
| GET | /api/products/:id | Lihat produk by ID | ❌ |
| POST | /api/products | Tambah produk | ✅ |
| PUT | /api/products/:id | Update produk | ✅ |
| DELETE | /api/products/:id | Hapus produk | ✅ |

---

## Contoh Request (pakai Postman/Thunder Client)

### Register
```json
POST /api/auth/register
{
  "name": "Budi Santoso",
  "email": "budi@gmail.com",
  "password": "123456"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "budi@gmail.com",
  "password": "123456"
}
```
Response akan berisi **token**. Gunakan token ini untuk request yang butuh auth.

### Pakai Token (Header)
```
Authorization: Bearer <token_dari_login>
```

### Tambah Produk
```json
POST /api/products
Authorization: Bearer <token>
{
  "name": "Laptop Asus",
  "description": "Laptop gaming murah",
  "price": 8500000,
  "stock": 10,
  "category_id": 1
}
```

---

## Teknologi yang Dipakai
- **Express.js** - Framework backend
- **MySQL2** - Driver database
- **bcryptjs** - Hash password
- **jsonwebtoken** - Autentikasi JWT
- **dotenv** - Konfigurasi environment
- **cors** - Cross-origin resource sharing
