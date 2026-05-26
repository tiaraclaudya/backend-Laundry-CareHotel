// routes/orderRoutes.js
import express from 'express';
import {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  bulkDeleteOrders,
  bulkUpdateStatus
} from '../controllers/informasiPelangganController.js';

const router = express.Router();

// ========== ROUTES ORDER LAUNDRY ==========

// GET /api/orders - Mendapatkan semua order
router.get('/', getAllOrders);

// GET /api/orders/stats - Mendapatkan statistik order
router.get('/stats', getOrderStats);

// GET /api/orders/:id - Mendapatkan order by ID
router.get('/:id', getOrderById);

// POST /api/orders - Membuat order baru
router.post('/', createOrder);

// PUT /api/orders/:id - Update order (lengkap)
router.put('/:id', updateOrder);

// PUT /api/orders/:id/status - Update status order saja
router.put('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Hapus satu order
router.delete('/:id', deleteOrder);

// POST /api/orders/bulk-delete - Hapus banyak order
router.post('/bulk-delete', bulkDeleteOrders);

// POST /api/orders/bulk-update-status - Update status banyak order
router.post('/bulk-update-status', bulkUpdateStatus);

export default router;