import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// 1. Ambil atau buat objek global untuk menampung instance Prisma
const globalForPrisma = globalThis;

// 2. Gunakan instance yang sudah ada, atau buat baru jika belum ada
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

// 3. Simpan ke objek global jika bukan di lingkungan production
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;