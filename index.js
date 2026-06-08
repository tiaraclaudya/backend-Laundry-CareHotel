import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import dataHewanRoutes from './src/routes/informasiPelangganRoutes.js';
import kontakRoutes from './src/routes/kontakRoutes.js';
import informasiPelangganRoutes from './src/routes/informasiPelangganRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log("DB URL:", process.env.DATABASE_URL);
app.use(cors({
  origin: "http://localhost:5173/"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/data-hewan', dataHewanRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/informasiPelanggan', informasiPelangganRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 LaundryCarehotel berjalan!'
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan.`
  });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});