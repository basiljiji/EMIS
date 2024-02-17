import express from 'express';
import { addSection, deleteSection, editSection, listSection } from '../controller/sectionController.js';

const router = express();

//Section
router.get('/', listSection);
router.post('/add', addSection);
router.patch('/edit/:id', editSection);
router.delete('/delete/:id', deleteSection);

export default router;