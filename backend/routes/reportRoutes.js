import express from 'express'
import {  generatePdf, listAllFixtures } from '../controller/ReportController.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Hour
router.get('/',authenticateAdmin, listAllFixtures)
router.get('/pdf', generatePdf)

export default router