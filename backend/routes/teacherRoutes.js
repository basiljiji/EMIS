import express from 'express';
import { addTeacher, deleteTeacher, editTeacher, listTeachers } from '../controller/teacherController.js';

const router = express();

router.post('/add', addTeacher);
router.get('/', listTeachers);
router.patch('/edit/:id', editTeacher);
router.patch('/delete/:id', deleteTeacher);

export default router;