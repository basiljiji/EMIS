import fs from 'fs'
import HttpError from '../utils/httpErrorMiddleware.js'
import Resource from '../models/resourceModel.js'
import Folder from '../models/folderModel.js'

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

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const folderName = req.params.folderName

    const folderData = await Folder.findOne({ folderName })

    if (!folderData) {
        const error = new HttpError('No Folder Found', 500)
        return next(error)
    }



    const filePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '')

    // Save the file path in the Resource model
    const resource = new Resource({
        filePath: filePath,
        // portionTitle,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.admin,
        folder: folderData._id
    })

    resource.save()
        .then(savedResource => {
            res.status(200).json({
                message: 'File Uploaded',
                resource: savedResource
            })
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' })
        })
}

export const getResourceByFolder = async (req, res, next) => {
    try {
        const folderName = req.params.folderName

        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (folderData) {
            const resources = await Resource.find({ folder: folderData._id, 'isDeleted.status': false }).populate('folder')
            res.status(200).json(resources)
        } else {
            res.json({ message: "Resources Not Found" })
        }
    } catch (err) {
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }
}

export const renameFolder = async (req, res, next) => {
    try {
        const folderId = req.params.id
        const { folderName } = req.body

        const folder = await Folder.findOneAndUpdate({ _id: folderId }, { folderName })
        res.status(200).json({ message: "Folder Renamed" })

    } catch (err) {
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

        console.log(resourceId, "1221")

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
        const folderId = req.params.id

        const folder = await Folder.findById(folderId)
        res.status(200).json(folder)
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}


