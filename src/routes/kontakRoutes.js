// routes/kontakRoutes.js
import express from 'express';
import {bulkDeleteKontak,bulkMarkAsRead,createKontak,deleteKontak,getAllKontak,getKontakById,getKontakStats,markAsRead,updateStatusKontak} from '../controllers/kontakController.js'

const router = express.Router();

// POST /api/kontak - Membuat pesan kontak baru (dari form)
router.post('/create', createKontak);

// GET /api/kontak - Mendapatkan semua pesan kontak (dashboard)
router.get('/', getAllKontak);

// GET /api/kontak/stats - Mendapatkan statistik pesan
router.get('/stats', getKontakStats);

// GET /api/kontak/:id - Mendapatkan satu pesan berdasarkan ID
router.get('/:id', getKontakById);

// PUT /api/kontak/:id/status - Update status pesan
router.put('/:id/status', updateStatusKontak);

// PUT /api/kontak/:id/mark-read - Mark as read (shortcut)
router.put('/:id/mark-read', markAsRead);

// DELETE /api/kontak/:id 
router.delete('/:id', deleteKontak);

// POST /api/kontak/bulk-delete 
router.post('/bulk-delete', bulkDeleteKontak);

// POST /api/kontak/bulk-mark-read - Mark many as read
router.post('/bulk-mark-read', bulkMarkAsRead);

export default router;