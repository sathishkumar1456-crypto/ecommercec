import express from 'express';
import { getProducts, getProductById, createProductAdmin, updateProductAdmin, deleteProductAdmin } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, adminOnly, createProductAdmin);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProductAdmin).delete(protect, adminOnly, deleteProductAdmin);

export default router;