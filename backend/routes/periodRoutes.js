import express from 'express'
import { addAccessData, getAllPeriods } from '../controller/periodController.js'
import { authenticateAdmin, authenticateTeacher } from '../utils/authMiddleware.js'

const router = express()

router.post('/add', authenticateTeacher, addAccessData)
router.get('/all', authenticateAdmin, getAllPeriods)


export default router