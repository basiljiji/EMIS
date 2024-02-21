import express from 'express'
import { addFolder, getResourceByFolder, uploadFile } from '../controller/adminResourceController.js'
import upload from '../utils/multer.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Class
router.post('/', addFolder)
router.post('/upload/:folderName', authenticateAdmin, upload.single('file'), uploadFile)
router.get('/:folderName', authenticateAdmin, getResourceByFolder)
// router.post('/add', addClass)
// router.patch('/edit/:id', editClass)
// router.delete('/delete/:id', deleteClass)

export default router