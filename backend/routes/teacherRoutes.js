import express from 'express';
import { addTeacher, deleteTeacher, editTeacher, listTeachers } from '../controller/teacherController.js';
import { authenticateAdmin } from '../utils/authMiddleware.js';

const router = express();

router.post('/add', authenticateAdmin, addTeacher);
router.get('/', authenticateAdmin, listTeachers);
router.patch('/edit/:id', authenticateAdmin, editTeacher);
router.patch('/delete/:id', authenticateAdmin, deleteTeacher);

export default router;