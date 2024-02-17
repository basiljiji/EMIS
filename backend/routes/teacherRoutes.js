import express from 'express'
import { addTeacher } from '../controller/teacherController.js';

const router = express()

router.post('/add', addTeacher)

export default router