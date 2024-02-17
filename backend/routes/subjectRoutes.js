import express from 'express';
import { addSubject, deleteSubject, editSubject, listSubject } from '../controller/subjectController.js';

const router = express();

//Subject
router.get('/', listSubject);
router.post('/add', addSubject);
router.patch('/edit/:id', editSubject);
router.delete('/delete/:id', deleteSubject);

export default router;