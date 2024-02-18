import express from 'express';
import { addHour, deleteHour, editHour, listHour } from '../controller/hourController.js';
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express();

//Hour
router.get('/', listHour);
router.post('/add', authenticateAdmin, addHour);
router.patch('/edit/:id', authenticateAdmin, editHour);
router.patch('/delete/:id',authenticateAdmin, deleteHour);

export default router;