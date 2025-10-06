import express from 'express'
import { loginTeacher, logoutTeacher, forceLogoutTeacher } from '../controller/teacherAuthController.js'
import { authenticateTeacher } from '../utils/authMiddleware.js'

const router = express()

router.post('/login', loginTeacher)
router.post('/logout', authenticateTeacher, logoutTeacher)
router.post('/force-logout', forceLogoutTeacher) // Admin endpoint for manual cleanup

export default router