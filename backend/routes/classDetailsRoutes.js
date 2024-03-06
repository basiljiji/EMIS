import express from 'express'
import { addClass, deleteClass, editClass, listClass } from '../controller/classDetailsController.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Class
router.get('/', listClass)
router.post('/add', authenticateAdmin, addClass)
router.patch('/edit/:id', authenticateAdmin, editClass)
router.patch('/delete/:id', authenticateAdmin, deleteClass)

export default router