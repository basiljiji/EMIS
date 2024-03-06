import express from 'express';
import { addSection, deleteSection, editSection, listSection } from '../controller/sectionController.js';
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express();

//Section
router.get('/',  listSection);
router.post('/add', authenticateAdmin, addSection);
router.patch('/edit/:id', authenticateAdmin, editSection);
router.patch('/delete/:id', authenticateAdmin, deleteSection);

export default router;