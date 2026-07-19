import express from 'express';
import { getPersonalizedRecommendations } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', protect, getPersonalizedRecommendations);

export default router;