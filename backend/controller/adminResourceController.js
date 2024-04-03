import fs from 'fs'
import HttpError from '../utils/httpErrorMiddleware.js'
import Folder from '../models/folderModel.js'
import Subfolder from '../models/subfolderModel.js'
import path from 'path'

export const addFolder = async (req, res, next) => {
    try {
        const { folderName, classdata, sectiondata, subjectdata } = req.body


        if (!folderName) {
            const error = new HttpError('Folder name is required', 400)
            return next(error)
        }

        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (folderData) {
            const error = new HttpError('Folder already exists', 400)
            return next(error)
        } else {
            await Folder.create({
                folderName,
                folderPath: folderName,
                accessTo: { classAccess: classdata, sectionAccess: sectiondata, subjectAccess: subjectdata }
            })
            // Check if folder already exists
            const folderPath = `./uploads/${folderName}`
            if (!fs.existsSync(folderPath)) {
                // Create folder
                fs.mkdirSync(folderPath)
                res.status(200).json(`Folder ${folderName} Created`)
            } else {
                const error = new HttpError('Folder already exists', 400)
                return next(error)
            }
        }


    } catch (err) {
        console.error(err)
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }
}

export const getAllFolders = async (req, res, next) => {
    try {
        const folders = await Folder.find({ 'isDeleted.status': false })
        res.status(200).json(folders)
    } catch (err) {
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }
}


export const uploadFile = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new HttpError('No file uploaded', 400)
        }

        const folderName = req.params.folderName
        const folderData = await Folder.findOne({ folderName })

        if (!folderData) {
            throw new HttpError('No Folder Found', 404)
        }

        // Process uploaded files and save them
        req.files.forEach(async (file) => {
            const filePath = file.path.replace(/\\/g, '/').replace('uploads/', '')

            // Create an object with file details
            const newResources = {
                portionTitle: req.body.portionTitle || null,
                filePath: filePath,
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size
            }

            // Push the new image object into the images array of the folder
            folderData.resources.push(newResources)
        })

        // Save the folder document with the new images
        await folderData.save()

        res.status(200).json({
            message: 'Files Uploaded',
            resources: folderData.resources
        })
    } catch (err) {
        const error = new HttpError('File Upload Failed', 500)
        return next(error)
    }
}

export const renameFolder = async (req, res, next) => {
    try {
        const folderId = req.params.id
        const { folderName } = req.body

        const folder = await Folder.findOneAndUpdate({ _id: folderId }, { folderName })

        // Construct the new path
        const __filename = new URL(import.meta.url).pathname
        const __dirname = path.dirname(__filename)
        // Construct the paths using path.resolve()
        const rootDir = path.resolve(__dirname, '..', '..', 'uploads') // Navigate to the uploads directory
        const currentPath = path.resolve(rootDir, folder.folderName)
        const newPath = path.resolve(rootDir, folderName)

        console.log('Current Path:', currentPath)
        console.log('New Path:', newPath)

        // Rename the folder
        fs.renameSync(currentPath, newPath)

        res.status(200).json({ message: "Folder Renamed" })
    } catch (err) {
        console.error('Error renaming folder:', err)
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}

export const editAccessFolder = async (req, res, next) => {
    try {
        const folderId = req.params.id
        const { classdata, sectiondata, subjectdata } = req.body.accessTo

        // Ensure req.body contains required data
        if (!classdata && !sectiondata && !subjectdata) {
            const error = new HttpError('Missing data in request body', 400)
            return next(error)
        }

        const folder = await Folder.findById(folderId)

        if (!folder) {
            const error = new HttpError('Folder not found', 404)
            return next(error)
        }

        // Update folder access
        if (classdata && classdata.length > 0) {
            folder.accessTo.classAccess.push(...classdata)
        }
        if (sectiondata && sectiondata.length > 0) {
            folder.accessTo.sectionAccess.push(...sectiondata)
        }
        if (subjectdata && subjectdata.length > 0) {
            folder.accessTo.subjectAccess.push(...subjectdata)
        }

        // Save the updated folder
        await folder.save()

        // Return updated folder in the response
        res.json({ folder, message: "Folder Access Updated" })
    } catch (err) {
        // Handle specific errors if needed
        console.error(err)
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}



export const deleteFolder = async (req, res, next) => {
    try {
        const folderId = req.params.id
        const deleteFolderDetail = await Folder.findById(folderId)

        if (deleteFolderDetail) {
            // Construct the folder path
            const folderPath = `./uploads/${deleteFolderDetail.folderName}`

            // Remove the folder directory and its contents
            if (fs.existsSync(folderPath)) {
                fs.rmdirSync(folderPath, { recursive: true })
            }

            // Mark the folder as deleted in the database
            deleteFolderDetail.isDeleted.status = true
            deleteFolderDetail.isDeleted.deletedBy = req.admin
            deleteFolderDetail.isDeleted.deletedTime = Date.now()

            await deleteFolderDetail.save()

            res.status(200).json({ message: "Folder Deleted" })
        } else {
            res.status(404).json({ message: "Folder not found" })
        }
    } catch (err) {
        console.error(err)
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}


export const deleteResource = async (req, res, next) => {
    try {
        const resourceId = req.params.id

        const resource = await Resource.findById(resourceId)

        if (!resource) {
            const error = new HttpError('Resource not found', 404)
            throw error
        }

        console.log(resource)

        const filePath = `./uploads/${resource.filePath}`


        await fs.promises.unlink(filePath)

        resource.isDeleted.status = true
        resource.isDeleted.deletedBy = req.admin
        resource.isDeleted.deletedTime = Date.now()

        await resource.save()

        res.status(200).json({ message: 'Resource deleted successfully' })
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}



export const getSingleFolderData = async (req, res, next) => {
    try {
        const folderName = req.params.folderName

        const folder = await Folder.findOne({ folderName })
        res.status(200).json(folder)
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}


//Subfolder

export const addSubfolder = async (req, res, next) => {
    try {
        const folderName = req.params.folderName

        const { subfolderName } = req.body

        const folder = await Folder.findOne({ folderName })

        if (folder) {
            const subfolderData = await Subfolder.findOne({ subfolderName, parentFolder: folder._id })
            if (subfolderData) {
                const error = new HttpError('Folder Already Exists', 500)
                return next(error)
            } else {
                await Subfolder.create({
                    parentFolder: folder._id,
                    subfolderName
                })
                // Check if folder already exists
                const folderPath = `./uploads/${folderName}/${subfolderName}`
                if (!fs.existsSync(folderPath)) {
                    // Create folder
                    fs.mkdirSync(folderPath)
                    res.status(200).json(`Folder ${subfolderName} Created`)
                } else {
                    const error = new HttpError('Folder already exists', 400)
                    return next(error)
                }
            }
        }

        res.status(200).json(folder)
    } catch (err) {
        const error = new HttpError('Folder Not Created', 500)
        return next(error)
    }
}

export const getSubfolders = async (req, res, next) => {
    try {
        const folderName = req.params.folderName

        const folderData = await Folder.findOne({ folderName })

        if (folderData) {
            const subfolders = await Subfolder.find({ parentFolder: folderData._id, 'isDeleted.status': false }).populate('parentFolder')
            res.status(200).json(subfolders)

        } else {
            const error = new HttpError('No Subfolders Found', 500)
            return next(error)
        }

    } catch (err) {
        const error = new HttpError('No Subfolders Found', 500)
        return next(error)
    }
}


export const getSingleSubfolderData = async (req, res, next) => {
    try {
        const folderName = req.params.folderName
        const subfolderName = req.params.subfolderName

        console.log(folderName, subfolderName, "1212")

        const folderData = await Folder.findOne({ folderName })

        if (folderData) {
            const subfolder = await Subfolder.findOne({ subfolderName, parentFolder: folderData._id, 'isDeleted.status': false }).populate('parentFolder')
            res.status(200).json(subfolder)

        } else {
            const error = new HttpError('No Subfolders Found', 500)
            return next(error)
        }

    } catch (err) {
        const error = new HttpError('No Subfolders Found', 500)
        return next(error)
    }
}


export const renameSubfolder = async (req, res, next) => {
    try {
        const subfolderId = req.params.id
        const { subfolderName } = req.body

        const subfolder = await Subfolder.findOneAndUpdate({ _id: subfolderId }, { subfolderName })

        res.status(200).json({ message: "Folder Renamed" })

    } catch (err) {
        const error = new HttpError('Rename Failed', 500)
        return next(error)
    }
}


export const uploadFilesSubfolder = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new HttpError('No file uploaded', 400)
        }


        const folderName = req.params.folderName
        const subfolderName = req.params.subfolderName

        const folder = await Folder.findOne({ folderName })

        if (folder) {

            const subfolderData = await Subfolder.findOne({ subfolderName, parentFolder: folder._id }).populate('parentFolder')

            if (!subfolderData) {
                throw new HttpError('No Folder Found', 404)
            }

            // Process uploaded files and save them
            req.files.forEach(async (file) => {
                const filePath = `/${subfolderData.parentFolder.folderName}/${subfolderName}/${file.originalname}`
                // Create an object with file details
                console.log(filePath, "Here")
                const newResources = {
                    portionTitle: req.body.portionTitle || null,
                    filePath: filePath,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size
                }

                // Push the new image object into the images array of the folder
                subfolderData.resources.push(newResources)
            })

            // Save the folder document with the new images
            await subfolderData.save()

            res.status(200).json({
                message: 'Files Uploaded',
                resources: subfolderData.resources
            })

        }



    } catch (err) {
        const error = new HttpError('File Upload Failed', 500)
        return next(error)
    }
}

export const deleteSubfolder = async (req, res, next) => {
    try {
        const subfolderId = req.params.id
        const deleteFolderDetail = await Subfolder.findById(subfolderId).populate('parentFolder')

        if (deleteFolderDetail) {
            // Construct the folder path
            const folderPath = `./uploads/${deleteFolderDetail.parentFolder.folderName}/${deleteFolderDetail.subfolderName}`

            // Remove the folder directory and its contents
            if (fs.existsSync(folderPath)) {
                fs.rmdirSync(folderPath, { recursive: true })
            }

            // Mark the folder as deleted in the database
            deleteFolderDetail.isDeleted.status = true
            deleteFolderDetail.isDeleted.deletedBy = req.admin
            deleteFolderDetail.isDeleted.deletedTime = Date.now()

            await deleteFolderDetail.save()

            res.status(200).json({ message: "Folder Deleted" })
        } else {
            res.status(404).json({ message: "Folder not found" })
        }
    } catch (err) {
        const error = new HttpError('Deletion Failed', 500)
        return next(error)
    }
}