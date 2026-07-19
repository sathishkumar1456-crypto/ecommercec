import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsersAdmin, deleteUserAdmin } from '../controllers/userProfile.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/admin/all').get(protect, adminOnly, getAllUsersAdmin);
router.route('/admin/:id').delete(protect, adminOnly, deleteUserAdmin);

export default router;