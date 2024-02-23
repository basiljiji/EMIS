import fs from 'fs'
import multer from 'multer'
import HttpError from '../utils/httpErrorMiddleware.js'
import Resource from '../models/resourceModel.js'
import Folder from '../models/folderModel.js'

export const addFolder = async (req, res, next) => {
    try {
        const { folderName } = req.body

        if (!folderName) {
            const error = new HttpError('Folder name is required', 400)
            return next(error)
        }

        const folderData = await Folder.findOne({ folderName })

        if (folderData) {
            const error = new HttpError('Folder already exists', 400)
            return next(error)
        } else {
            await Folder.create({
                folderName
            })
            // Check if folder already exists
            const folderPath = `public/${folderName}`
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


// Controller function to handle file upload
export const uploadFile = async (req, res, next) => {
    
    console.log(req.file)

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const folderName = req.params.folderName
    // const { portionTitle } = req.body

    console.log(folderName)

    const folderData = await Folder.findOne({ folderName })

    if (!folderData) {
        const error = new HttpError('No Folder Found', 500)
        return next(error)
    }



    const filePath = req.file.path.replace(/\\/g, '/').replace('public/', '')

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

        const folderData = await Folder.findOne({ folderName })

        if (folderData) {
            const resources = await Resource.find({ folder: folderData._id }).populate('folder')
            res.status(200).json(resources)
        } else {
            res.json({ message: "Resources Not Found" })
        }
    } catch (err) {
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }
}