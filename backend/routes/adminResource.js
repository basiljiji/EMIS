import express from 'express'
import { addFolder, getAllFolders, getResourceByFolder, uploadFile } from '../controller/adminResourceController.js'
import upload from '../utils/multer.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Resource
router.get('/', authenticateAdmin, getAllFolders)
router.post('/', authenticateAdmin, addFolder)
router.post('/upload/:folderName', authenticateAdmin, upload.single('file'), uploadFile)
router.get('/:folderName', authenticateAdmin, getResourceByFolder)

export default router