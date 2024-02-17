import express from 'express';
import { loginTeacher } from '../controller/teacherLoginController.js';

const router = express();

router.post('/login', loginTeacher);

export default router;