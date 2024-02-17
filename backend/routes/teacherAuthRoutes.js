import express from 'express'
import { loginTeacher, logoutTeacher } from '../controller/teacherAuthController.js'

const router = express()

router.post('/login', loginTeacher)
router.post('/logout', logoutTeacher)

export default router