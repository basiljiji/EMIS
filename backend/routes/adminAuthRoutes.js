import express from 'express';
import { loginAdmin, logoutAdmin, registerAdmin } from '../controller/adminAuthController.js';
import { authenticateAdmin } from '../utils/authMiddleware.js';

const router = express();

router.post('/login', loginAdmin);
router.post('/register', authenticateAdmin, registerAdmin);
router.post('/logout', logoutAdmin);

export default router;