import express from 'express'
import { fetchResources } from '../controller/teacherResourceController.js'
import { authenticateTeacher } from '../utils/authMiddleware.js'

const router = express()

//Teacher Resource
router.get('/:folderName', authenticateTeacher, fetchResources)

export default router