import express from 'express'
import { loginTeacher, logoutTeacher } from '../controller/teacherAuthController.js'
import { authenticateTeacher } from '../utils/authMiddleware.js'

const router = express()

router.post('/login', loginTeacher)
router.post('/logout', logoutTeacher)

export default router