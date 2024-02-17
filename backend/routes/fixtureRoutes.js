import express from 'express';
import { addFixture, deleteFixture, editFixture, listFixtures, viewSingleFixture } from '../controller/fixtureController.js';
import { authenticateTeacher } from '../utils/authMiddleware.js';

const router = express();

//Teacher Fixture
router.get('/', authenticateTeacher, listFixtures);
router.get('/:id', authenticateTeacher, viewSingleFixture);
router.post('/add', authenticateTeacher, addFixture);
router.patch('/edit/:id', authenticateTeacher, editFixture);
router.patch('/delete/:id', authenticateTeacher, deleteFixture);

export default router;