import express from 'express';
import { registerUser, loginUser, loginAdmin } from '../controllers/authentication.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);

export default router;