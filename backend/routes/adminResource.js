import express from 'express'
import { addFolder, addNestedSubfolder, addSubfolder, deleteFolder, deleteResource, deleteSubfolder, deleteSubfolderResource, editAccessFolder, getAllFolders, getNestedSubfolders, getSingleFolderData, getSingleNestedSubfolderData, getSingleNestedSubfolders, getSingleSubfolderData, getSubfolders, renameFolder, renameFolderResource, renameNestedSubfolder, renameSubfolder, renameSubfolderResource, uploadFile, uploadFilesNestedSubfolder, uploadFilesSubfolder } from '../controller/adminResourceController.js'
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
router.patch('/filename/:folderName/:resourceId', authenticateAdmin, deleteResource)
router.patch('/folder/resrename/:folderName/:resourceid', authenticateAdmin, renameFolderResource)



//Subfolders
router.get('/:folderName', authenticateAdmin, getSubfolders)
router.post('/:folderName', authenticateAdmin, addSubfolder)
router.get('/folder/:folderName/:subfolderName', authenticateAdmin, getSingleSubfolderData)
router.post('/upload/:folderName/:subfolderName', authenticateAdmin, upload.array('files', 100), uploadFilesSubfolder)
router.patch('/subfolder/rename/:id', authenticateAdmin, renameSubfolder)
router.patch('/subfolder/delete/:id', authenticateAdmin, deleteSubfolder)
router.patch('/subfilename/:folderName/:subfolderName/:resourceId', authenticateAdmin, deleteSubfolderResource)
router.patch('/subfolder/resrename/:folderName/:subfolderName/:resourceid', authenticateAdmin, renameSubfolderResource)


//NestedSubfolder
router.get('/:folderName/:subfolderName', authenticateAdmin, getNestedSubfolders)
router.post('/:folderName/:subfolderName', authenticateAdmin, addNestedSubfolder)
router.get('/nestedsubfolder/:folderName/:subfolderName', authenticateAdmin, getSingleNestedSubfolders)
router.get('/nestedsubfolder/:folderName/:subfolderName/:nestedSubfolderName', authenticateAdmin, getSingleNestedSubfolderData)
router.patch('/nestedsubfolder/rename/:id', authenticateAdmin, renameNestedSubfolder)
router.post('/upload/:folderName/:subfolderName/:nestedSubfolderName', authenticateAdmin, upload.array('files', 100), uploadFilesNestedSubfolder)




export default router