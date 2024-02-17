import express from 'express';
import { addHour, deleteHour, editHour, listHour } from '../controller/hourController.js';

const router = express();

//Hour
router.get('/', listHour);
router.post('/add', addHour);
router.patch('/edit/:id', editHour);
router.delete('/delete/:id', deleteHour);

export default router;