import express from 'express'
import { addAccessData, addClassData, getAllPeriods, getAllPeriodsReport, getPeriodsByTeacher } from '../controller/periodController.js'
import { authenticateAdmin, authenticateTeacher } from '../utils/authMiddleware.js'

const router = express()

router.post('/add', authenticateTeacher, addAccessData)
router.get('/all', authenticateAdmin, getAllPeriods)
router.get('/teacher/:id', authenticateAdmin, getPeriodsByTeacher)
router.post('/classdata', authenticateTeacher, addClassData)
router.get('/report', authenticateAdmin, getAllPeriodsReport)




export default router