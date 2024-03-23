import express from 'express'
import { addFolder, deleteFolder, editAccessFolder, getAllFolders, getResourceByFolder, getSingleFolderData, renameFolder, uploadFile } from '../controller/adminResourceController.js'
import upload from '../utils/multer.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Resource
router.get('/', authenticateAdmin, getAllFolders)
router.get('/:folderName', authenticateAdmin, getResourceByFolder)
router.post('/', authenticateAdmin, addFolder)
router.post('/upload/:folderName', authenticateAdmin, upload.single('file'), uploadFile)
router.patch('/folder/rename/:id', authenticateAdmin, renameFolder)
router.patch('/folder/delete/:id', authenticateAdmin, deleteFolder)
router.get('/folder/edit/:id', authenticateAdmin, getSingleFolderData)
router.put('/folder/access/:id', authenticateAdmin, editAccessFolder)

export default router