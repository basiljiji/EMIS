import express from 'express';
import { addClass, deleteClass, editClass, listClass } from '../controller/classDetailsController.js';

const router = express();

router.get('/', listClass);
router.post('/add', addClass);
router.patch('/edit/:id', editClass);
router.delete('/delete/:id', deleteClass);

export default router;