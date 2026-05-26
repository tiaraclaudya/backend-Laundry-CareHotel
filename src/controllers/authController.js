import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nama, password, no_telepon, email, alamat } = req.body;

    if (!nama || !password || !no_telepon || !email || !alamat) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({ message: 'Username sudah dipakai' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        password: hashed,
        no_telepon,
        email,
        alamat,
      }
    });

    res.status(201).json({
      message: 'Register berhasil',
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: username }
    });

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};