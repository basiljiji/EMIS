import express from 'express'
import { addFolder, addSubfolder, deleteFolder, deleteResource, deleteSubfolder, editAccessFolder, getAllFolders, getSingleFolderData, getSingleSubfolderData, getSubfolders, renameFolder, renameSubfolder, uploadFile, uploadFilesSubfolder } from '../controller/adminResourceController.js'
import upload from '../utils/multer.js'
import { authenticateAdmin } from '../utils/authMiddleware.js'

const router = express()

//Folders
router.get('/', authenticateAdmin, getAllFolders)
router.post('/', authenticateAdmin, addFolder)
router.post('/upload/:folderName', authenticateAdmin, upload.array('files', 100), uploadFile)
router.patch('/folder/rename/:id', authenticateAdmin, renameFolder)
router.patch('/folder/delete/:id', authenticateAdmin, deleteFolder)
router.get('/folder/:folderName', authenticateAdmin, getSingleFolderData)
router.put('/folder/access/:id', authenticateAdmin, editAccessFolder)
router.patch('/filename/:folderId/:resourceId', authenticateAdmin, deleteResource)


//Subfolders
router.get('/:folderName', authenticateAdmin, getSubfolders)
router.post('/:folderName', authenticateAdmin, addSubfolder)
router.get('/folder/:folderName/:subfolderName', authenticateAdmin, getSingleSubfolderData)
router.post('/upload/:folderName/:subfolderName', authenticateAdmin, upload.array('files', 100), uploadFilesSubfolder)
router.patch('/subfolder/rename/:id', authenticateAdmin, renameSubfolder)
router.patch('/subfolder/delete/:id', authenticateAdmin, deleteSubfolder)



export default router