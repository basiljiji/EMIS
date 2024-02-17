import express from 'express';
import { loginAdmin, registerAdmin } from '../controller/adminAuthController.js';
import { authenticateAdmin } from '../utils/authMiddleware.js';

const router = express();

router.post('/login', loginAdmin);
router.post('/register', authenticateAdmin, registerAdmin);

export default router;