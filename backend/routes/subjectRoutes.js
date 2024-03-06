import express from 'express'
import { addSubject, deleteSubject, editSubject, listSubject } from '../controller/subjectController.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Subject
router.get('/', listSubject)
router.post('/add', authenticateAdmin, addSubject)
router.patch('/edit/:id', authenticateAdmin, editSubject)
router.patch('/delete/:id', authenticateAdmin, deleteSubject)

export default router