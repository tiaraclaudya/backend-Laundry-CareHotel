import prisma from '../config/database.js';

// ========== CREATE ==========
// Membuat pesan kontak baru (dari form hubungi kami)
export const createKontak = async (req, res) => {
  try {
    const { nama_lengkap, email, pesan } = req.body;

    // Validasi input
    if (!nama_lengkap || !email || !pesan) {
      // Jika dari form biasa (bukan AJAX), redirect dengan error
      if (req.accepts('html')) {
        return res.redirect('/hubungi-kami.html?status=error&msg=Semua field wajib diisi');
      }
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.accepts('html')) {
        return res.redirect('/hubungi-kami.html?status=error&msg=Format email tidak valid');
      }
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Simpan ke database
    const kontak = await prisma.kontak.create({
      data: {
        namaLengkap: nama_lengkap,
        email: email,
        pesan: pesan,
        status: 'belum_dibaca'
      }
    });

    console.log(kontak)

    // Redirect atau response JSON
    // if (req.accepts('html')) {
    //   return res.redirect('/hubungi-kami.html?status=success');
    // }
    return res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim',
      data: kontak
    });

  } catch (error) {
    console.error('Error createKontak:', error);
    
    if (req.accepts('html')) {
      return res.redirect(`/hubungi-kami.html?status=error&msg=${encodeURIComponent(error.message)}`);
    }
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan',
      error: error.message
    });
  }
};

// Mendapatkan semua pesan kontak (untuk dashboard)
export const getAllKontak = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    
    // Build filter
    let where = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // Pagination
    const take = limit ? parseInt(limit) : 100;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    const kontak = await prisma.kontak.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      take,
      skip
    });
    
    const total = await prisma.kontak.count({ where });
    
    res.json({
      success: true,
      data: kontak,
      pagination: {
        total,
        limit: take,
        page: page ? parseInt(page) : 1,
        totalPages: Math.ceil(total / take)
      }
    });
    
  } catch (error) {
    console.error('Error getAllKontak:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kontak',
      error: error.message
    });
  }
};

// Mendapatkan satu pesan kontak berdasarkan ID
export const getKontakById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kontak = await prisma.kontak.findUnique({
      where: { id }
    });
    
    if (!kontak) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: kontak
    });
    
  } catch (error) {
    console.error('Error getKontakById:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data',
      error: error.message
    });
  }
};


// Update status pesan (belum_dibaca -> sudah_dibaca)
export const updateStatusKontak = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validasi status
    const allowedStatus = ['belum_dibaca', 'sudah_dibaca'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    // Cek apakah pesan exist
    const existingKontak = await prisma.kontak.findUnique({
      where: { id }
    });
    
    if (!existingKontak) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }
    
    // Update status
    const updated = await prisma.kontak.update({
      where: { id },
      data: { status }
    });
    
    res.json({
      success: true,
      message: `Status berhasil diubah menjadi ${status}`,
      data: updated
    });
    
  } catch (error) {
    console.error('Error updateStatusKontak:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status',
      error: error.message
    });
  }
};

// Mark as read (shortcut untuk update status ke sudah_dibaca)
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updated = await prisma.kontak.update({
      where: { id },
      data: { status: 'sudah_dibaca' }
    });
    
    res.json({
      success: true,
      message: 'Pesan ditandai sudah dibaca',
      data: updated
    });
    
  } catch (error) {
    console.error('Error markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai pesan',
      error: error.message
    });
  }
};


// Menghapus pesan kontak
export const deleteKontak = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cek apakah pesan exist
    const existingKontak = await prisma.kontak.findUnique({
      where: { id }
    });
    
    if (!existingKontak) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }
    
    // Hapus pesan
    await prisma.kontak.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'Pesan berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleteKontak:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesan',
      error: error.message
    });
  }
};
// Mendapatkan statistik pesan (untuk dashboard)
export const getKontakStats = async (req, res) => {
  try {
    const total = await prisma.kontak.count();
    const belumDibaca = await prisma.kontak.count({
      where: { status: 'belum_dibaca' }
    });
    const sudahDibaca = await prisma.kontak.count({
      where: { status: 'sudah_dibaca' }
    });
    const hariIni = await prisma.kontak.count({
      where: {
        tanggal: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        total,
        belum_dibaca: belumDibaca,
        sudah_dibaca: sudahDibaca,
        hari_ini: hariIni
      }
    });
    
  } catch (error) {
    console.error('Error getKontakStats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik',
      error: error.message
    });
  }
};

// ========== BULK OPERATIONS ==========
// Menghapus banyak pesan sekaligus
export const bulkDeleteKontak = async (req, res) => {
  try {
    const { ids } = req.body;
    console.log(ids)
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada ID yang dipilih'
      });
    }
    
    const deleted = await prisma.kontak.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    
    res.json({
      success: true,
      message: `${deleted.count} pesan berhasil dihapus`,
      data: { deletedCount: deleted.count }
    });
    
  } catch (error) {
    console.error('Error bulkDeleteKontak:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesan',
      error: error.message
    });
  }
};

// Mark many as read
export const bulkMarkAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada ID yang dipilih'
      });
    }
    
    const updated = await prisma.kontak.updateMany({
      where: {
        id: { in: ids },
        status: 'belum_dibaca'
      },
      data: { status: 'sudah_dibaca' }
    });
    
    res.json({
      success: true,
      message: `${updated.count} pesan ditandai sudah dibaca`,
      data: { updatedCount: updated.count }
    });
    
  } catch (error) {
    console.error('Error bulkMarkAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate pesan',
      error: error.message
    });
  }
};
