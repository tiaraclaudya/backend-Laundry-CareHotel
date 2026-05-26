// controllers/orderController.js
import prisma from '../config/database.js';

// ========== GET ALL ORDERS ==========
export const getAllOrders = async (req, res) => {
  try {
    const { status, jenisLayanan, limit, page } = req.query;
    
    // Build filter
    let where = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (jenisLayanan && jenisLayanan !== 'all') {
      where.jenisLayanan = jenisLayanan;
    }
    
    // Pagination
    const take = limit ? parseInt(limit) : 100;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    const data = await prisma.orderLaundry.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      take,
      skip
    });
    
    const total = await prisma.orderLaundry.count({ where });
    
    res.json({
      success: true,
      message: 'Berhasil ambil data order laundry',
      data,
      pagination: {
        total,
        limit: take,
        page: page ? parseInt(page) : 1,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== CREATE ORDER ==========
export const createOrder = async (req, res) => {
  try {
    const {
      jenis_layanan,
      nama_lengkap,
      no_telepon,
      no_kamar,
      // Item laundry
      sprei,
      baju_kaos,
      celana,
      handuk,
      sarung_bantal,
      sarung_guling,
      // Item baru
      gaun_dress,
      blazer,
      jas,
      kemeja_wol,
      sweater_wol,
      sutra_silk,
      antarKeKamar,
      total_harga
    } = req.body;

    // Validasi input wajib
    if (!jenis_layanan || !nama_lengkap || !no_telepon || !no_kamar) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi (jenis_layanan, nama_lengkap, no_telepon, no_kamar)'
      });
    }

    // Validasi minimal pilih 1 item
    const spreiVal = parseInt(sprei) || 0;
    const bajuKaosVal = parseInt(baju_kaos) || 0;
    const celanaVal = parseInt(celana) || 0;
    const handukVal = parseInt(handuk) || 0;
    const sarungBantalVal = parseInt(sarung_bantal) || 0;
    const sarungGulingVal = parseInt(sarung_guling) || 0;
    const gaunDressVal = parseInt(gaun_dress) || 0;
    const blazerVal = parseInt(blazer) || 0;
    const jasVal = parseInt(jas) || 0;
    const kemejaWolVal = parseInt(kemeja_wol) || 0;
    const sweaterWolVal = parseInt(sweater_wol) || 0;
    const sutraSilkVal = parseInt(sutra_silk) || 0;

    const totalItem = spreiVal + bajuKaosVal + celanaVal + handukVal + 
                      sarungBantalVal + sarungGulingVal + gaunDressVal + 
                      blazerVal + jasVal + kemejaWolVal + sweaterWolVal + sutraSilkVal;

    if (totalItem === 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimal pilih 1 item laundry'
      });
    }

    const isAntarKeKamar = antarKeKamar === 'Yes';
    const data = await prisma.orderLaundry.create({
      data: {
        jenisLayanan: jenis_layanan,
        namaLengkap: nama_lengkap,
        noTelepon: no_telepon,
        noKamar: no_kamar,
        sprei: spreiVal,
        bajuKaos: bajuKaosVal,
        celana: celanaVal,
        handuk: handukVal,
        sarungBantal: sarungBantalVal,
        sarungGuling: sarungGulingVal,
        gaunDress: gaunDressVal,
        blazer: blazerVal,
        jas: jasVal,
        kemejaWol: kemejaWolVal,
        sweaterWol: sweaterWolVal,
        sutraSilk: sutraSilkVal,
        antarKeKamar: isAntarKeKamar,
        totalHarga: parseInt(total_harga) || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order laundry berhasil ditambahkan',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== GET ORDER BY ID ==========
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await prisma.orderLaundry.findUnique({
      where: { id }
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Order laundry tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== UPDATE ORDER ==========
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Cek apakah order exist
    const existingOrder = await prisma.orderLaundry.findUnique({
      where: { id }
    });
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order laundry tidak ditemukan'
      });
    }

    // Mapping field dari camelCase ke format yang sesuai dengan schema
    const mappedData = {};
    if (updateData.jenis_layanan) mappedData.jenisLayanan = updateData.jenis_layanan;
    if (updateData.nama_lengkap) mappedData.namaLengkap = updateData.nama_lengkap;
    if (updateData.no_telepon) mappedData.noTelepon = updateData.no_telepon;
    if (updateData.no_kamar) mappedData.noKamar = updateData.no_kamar;
    if (updateData.sprei !== undefined) mappedData.sprei = parseInt(updateData.sprei);
    if (updateData.baju_kaos !== undefined) mappedData.bajuKaos = parseInt(updateData.baju_kaos);
    if (updateData.celana !== undefined) mappedData.celana = parseInt(updateData.celana);
    if (updateData.handuk !== undefined) mappedData.handuk = parseInt(updateData.handuk);
    if (updateData.sarung_bantal !== undefined) mappedData.sarungBantal = parseInt(updateData.sarung_bantal);
    if (updateData.sarung_guling !== undefined) mappedData.sarungGuling = parseInt(updateData.sarung_guling);
    if (updateData.gaun_dress !== undefined) mappedData.gaunDress = parseInt(updateData.gaun_dress);
    if (updateData.blazer !== undefined) mappedData.blazer = parseInt(updateData.blazer);
    if (updateData.jas !== undefined) mappedData.jas = parseInt(updateData.jas);
    if (updateData.kemeja_wol !== undefined) mappedData.kemejaWol = parseInt(updateData.kemeja_wol);
    if (updateData.sweater_wol !== undefined) mappedData.sweaterWol = parseInt(updateData.sweater_wol);
    if (updateData.sutra_silk !== undefined) mappedData.sutraSilk = parseInt(updateData.sutra_silk);
    if (updateData.total_harga !== undefined) mappedData.totalHarga = parseInt(updateData.total_harga);
    if (updateData.status) mappedData.status = updateData.status;
    
    console.log(updateData)
    console.log(mappedData)
    const data = await prisma.orderLaundry.update({
      where: { id },
      data: mappedData
    });

    res.json({
      success: true,
      message: 'Order laundry berhasil diupdate',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== UPDATE ORDER STATUS ==========
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    const allowedStatus = ['belum_diproses', 'sedang_diproses', 'selesai', 'diambil'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Pilihan: belum_diproses, sedang_diproses, selesai, diambil'
      });
    }

    // Cek apakah order exist
    const existingOrder = await prisma.orderLaundry.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order laundry tidak ditemukan'
      });
    }

    const data = await prisma.orderLaundry.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: `Status berhasil diubah menjadi ${status}`,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== DELETE ORDER ==========
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah order exist
    const existingOrder = await prisma.orderLaundry.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order laundry tidak ditemukan'
      });
    }

    await prisma.orderLaundry.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Order laundry berhasil dihapus'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== GET ORDER STATISTICS ==========
export const getOrderStats = async (req, res) => {
  try {
    const total = await prisma.orderLaundry.count();
    
    const belumDiproses = await prisma.orderLaundry.count({
      where: { status: 'belum_diproses' }
    });
    
    const sedangDiproses = await prisma.orderLaundry.count({
      where: { status: 'sedang_diproses' }
    });
    
    const selesai = await prisma.orderLaundry.count({
      where: { status: 'selesai' }
    });
    
    const diambil = await prisma.orderLaundry.count({
      where: { status: 'diambil' }
    });
    
    const hariIni = await prisma.orderLaundry.count({
      where: {
        tanggal: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    });
    
    const totalCuciLipat = await prisma.orderLaundry.count({
      where: { jenisLayanan: 'cuci_lipat' }
    });
    
    const totalCuciKering = await prisma.orderLaundry.count({
      where: { jenisLayanan: 'cuci_kering' }
    });
    
    res.json({
      success: true,
      data: {
        total,
        belum_diproses: belumDiproses,
        sedang_diproses: sedangDiproses,
        selesai,
        diambil,
        hari_ini: hariIni,
        total_cuci_lipat: totalCuciLipat,
        total_cuci_kering: totalCuciKering
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== BULK DELETE ORDERS ==========
export const bulkDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada ID yang dipilih'
      });
    }
    
    const deleted = await prisma.orderLaundry.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    
    res.json({
      success: true,
      message: `${deleted.count} order laundry berhasil dihapus`,
      data: { deletedCount: deleted.count }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========== BULK UPDATE STATUS ==========
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada ID yang dipilih'
      });
    }
    
    const allowedStatus = ['belum_diproses', 'sedang_diproses', 'selesai', 'diambil'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const updated = await prisma.orderLaundry.updateMany({
      where: {
        id: { in: ids }
      },
      data: { status }
    });
    
    res.json({
      success: true,
      message: `${updated.count} order laundry status diubah menjadi ${status}`,
      data: { updatedCount: updated.count }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};