import express from 'express'
import { addTeacher, deleteTeacher, editTeacher, getTeachersById, listTeachers } from '../controller/teacherController.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

router.get('/', authenticateAdmin, listTeachers)
router.get('/:id', authenticateAdmin, getTeachersById)
router.post('/add', authenticateAdmin, addTeacher)
router.patch('/edit/:id', authenticateAdmin, editTeacher)
router.patch('/delete/:id', authenticateAdmin, deleteTeacher)

export default router