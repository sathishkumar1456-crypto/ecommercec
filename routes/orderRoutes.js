import express from 'express';
import { addOrderItems, getMyOrders, getAllOrdersAdmin, updateOrderStatusAdmin } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getMyOrders);
router.route('/admin/all').get(protect, adminOnly, getAllOrdersAdmin);
router.route('/admin/:id').put(protect, adminOnly, updateOrderStatusAdmin);

export default router;