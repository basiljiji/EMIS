import fs from 'fs'
import HttpError from '../utils/httpErrorMiddleware.js'
import Folder from '../models/folderModel.js'
import Subfolder from '../models/subfolderModel.js'
import path from 'path'
import NestedSubfolder from '../models/nestedSubfolderModel.js'

export const addFolder = async (req, res, next) => {
    try {
        const { folderName, classdata, sectiondata, subjectdata, teacherdata } = req.body


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
                folderTitle: folderName,
                folderPath: folderName,
                accessTo: { classAccess: classdata, sectionAccess: sectiondata, subjectAccess: subjectdata, teacherAccess: teacherdata }
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
        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (!folderData) {
            throw new HttpError('No Folder Found', 404)
        }

        // Process uploaded files and save them
        req.files.forEach(async (file) => {
            const filePath = file.path.replace(/\\/g, '/').replace('uploads/', '')

            // Create an object with file details
            const newResources = {
                portionTitle: file.originalname || null,
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

        const folder = await Folder.findById(folderId)

        if (!folder) {
            const error = new HttpError('Folder not found', 404)
            return next(error)
        }

        folder.folderTitle = folderName
        await folder.save()
        res.status(200).json({ message: "Folder Renamed" })


    } catch (err) {
        console.error('Error renaming folder:', err)
        const error = new HttpError('Something went wrong', 500)
        return next(error)
    }
}

export const editAccessFolder = async (req, res, next) => {
    try {
        const folderId = req.params.id
        const { classdata, sectiondata, subjectdata, teacherdata } = req.body.accessTo

        const folder = await Folder.findById(folderId)

        if (!folder) {
            const error = new HttpError('Folder not found', 404)
            return next(error)
        }

        // Completely replace existing data with the data from the request body
        folder.accessTo = {
            classAccess: classdata || [],
            sectionAccess: sectiondata || [],
            subjectAccess: subjectdata || [],
            teacherAccess: teacherdata || []
        }

        // Save the updated folder
        await folder.save()

        // Return updated folder in the response
        res.json({ folder, message: "Folder Access Updated" })
    } catch (err) {
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


// Donot Remove the resource from DB let it be there for references like period if necessary
// Add Class, Section, Subject as String instead of ref ID they maybe removed in future so

export const deleteResource = async (req, res, next) => {
    try {
        const folderName = req.params.folderName // Assuming you're passing folderId in the request parameters
        const resourceId = req.params.resourceId // Assuming you're passing resourceId in the request parameters

        // Find the folder by its ID
        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (!folder) {
            // If the folder doesn't exist, return an error
            return res.status(404).json({ message: 'Folder not found' })
        }

        // Find the resource index in the folder's resources array
        const resourceIndex = folder.resources.findIndex(resource => resource._id.equals(resourceId))

        if (resourceIndex === -1) {
            // If the resource doesn't exist in the folder, return an error
            return res.status(404).json({ message: 'Resource not found' })
        }

        // Remove the resource from the folder's resources array
        const deletedResource = folder.resources.splice(resourceIndex, 1)[0]

        // Save the updated folder to the database
        await folder.save()

        const filePath = `./uploads/${deletedResource.filePath}`

        const normalizedPath = path.normalize(filePath)


        // Delete the file from the file system
        await fs.unlink(normalizedPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            }
        })

        // Return a success message
        res.status(200).json({ message: 'Resource deleted successfully' })
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}



export const getSingleFolderData = async (req, res, next) => {
    try {
        const folderName = req.params.folderName

        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })
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

        const folder = await Folder.findOne({ folderName, "isDeleted.status": false })

        if (folder) {
            const subfolderData = await Subfolder.findOne({
                subfolderName, parentFolder: folder._id, "isDeleted.status": false
            })
            if (subfolderData) {
                const error = new HttpError('Folder Already Exists', 500)
                return next(error)
            } else {
                await Subfolder.create({
                    parentFolder: folder._id,
                    subfolderName,
                    folderTitle: subfolderName
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

        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })

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


        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })

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

        const subfolder = await Subfolder.findOneAndUpdate({ _id: subfolderId }, { folderTitle: subfolderName })

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

        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (folder) {

            const subfolderData = await Subfolder.findOne({ subfolderName, parentFolder: folder._id, 'isDeleted.status': false }).populate('parentFolder')

            if (!subfolderData) {
                throw new HttpError('No Folder Found', 404)
            }

            // Process uploaded files and save them
            req.files.forEach(async (file) => {
                const filePath = `/${subfolderData.parentFolder.folderName}/${subfolderName}/${file.originalname}`
                // Create an object with file details
                const newResources = {
                    filePath: filePath,
                    portionTitle: file.originalname,
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


export const deleteSubfolderResource = async (req, res, next) => {
    try {
        const folderName = req.params.folderName
        const subfolderName = req.params.subfolderName
        const resourceId = req.params.resourceId

        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' })
        } else {
            const subfolder = await Subfolder.findOne({ parentFolder: folder._id, subfolderName, 'isDeleted.status': false })

            const resourceIndex = subfolder.resources.findIndex(resource => resource._id.equals(resourceId))

            if (resourceIndex === -1) {
                return res.status(404).json({ message: 'Resource not found' })
            }

            const deletedResource = subfolder.resources.splice(resourceIndex, 1)[0]

            await subfolder.save()

            const filePath = `./uploads/${deletedResource.filePath}`

            const normalizedPath = path.normalize(filePath)

            // Delete the file from the file system
            await fs.unlink(normalizedPath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err)
                }
            })

            // Return a success message
            res.status(200).json({ message: 'Resource deleted successfully' })
        }


    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}


export const renameFolderResource = async (req, res, next) => {
    try {
        const folderName = req.params.folderName
        const resourceId = req.params.resourceid
        const { portionTitle } = req.body

        const folder = await Folder.findOneAndUpdate(
            {
                folderName: folderName,
                "isDeleted.status": false,
                "resources._id": resourceId
            },
            {
                $set: { "resources.$.portionTitle": portionTitle }
            },
            { new: true }
        )

        if (!folder) {
            return res.status(404).json({ message: "Folder or resource not found" })
        }

        res.status(200).json({ message: "File Renamed", folder })
    } catch (err) {
        const error = new HttpError('Rename Failed', 500)
        return next(error)
    }
}

export const renameSubfolderResource = async (req, res, next) => {
    try {
        const folderName = req.params.folderName
        const subfolderName = req.params.subfolderName
        const resourceId = req.params.resourceid
        const { portionTitle } = req.body

        const folder = await Folder.findOne({ folderName: folderName, 'isDeleted.status': false })

        if (folder) {
            const subfolder = await Subfolder.findOneAndUpdate(
                {
                    subfolderName: subfolderName,
                    "isDeleted.status": false,
                    "resources._id": resourceId
                },
                {
                    $set: { "resources.$.portionTitle": portionTitle }
                },
                { new: true }
            )
        }

        res.status(200).json({ message: "File Renamed" })

    } catch (err) {
        const error = new HttpError('Rename Failed', 500)
        return next(error)
    }
}





export const addNestedSubfolder = async (req, res, next) => {
    try {
        const { folderName, subfolderName } = req.params
        const { nestedSubfolderName } = req.body

        let parentFolderPath = './uploads'

        // Find the parent folder
        const parentFolder = await Folder.findOne({ folderName })
        if (!parentFolder) {
            const error = new HttpError('Parent folder not found', 404)
            return next(error)
        }
        parentFolderPath = path.join(parentFolderPath, parentFolder.folderName)

        // Find the parent subfolder
        const parentSubfolder = await Subfolder.findOne({ subfolderName, parentFolder: parentFolder._id })
        if (!parentSubfolder) {
            const error = new HttpError('Parent subfolder not found', 404)
            return next(error)
        }
        parentFolderPath = path.join(parentFolderPath, parentSubfolder.subfolderName)

        // Check if the nested subfolder already exists in the database
        const nestedSubfolderExists = await NestedSubfolder.findOne({
            subfolderName: nestedSubfolderName,
            parentFolder: parentFolder._id,
            parentSubfolder: parentSubfolder._id,
            "isDeleted.status": false
        })

        if (nestedSubfolderExists) {
            const error = new HttpError('Nested subfolder already exists', 400)
            return next(error)
        }

        // Create the nested subfolder document
        const newNestedSubfolder = new NestedSubfolder({
            nestedSubfolderName: nestedSubfolderName,
            folderTitle: nestedSubfolderName,
            parentFolder: parentFolder._id,
            parentSubfolder: parentSubfolder._id,
            createdBy: req.admin
        })

        await newNestedSubfolder.save()

        // Create the nested subfolder in the file system
        const nestedSubfolderPath = path.join(parentFolderPath, nestedSubfolderName)
        if (!fs.existsSync(nestedSubfolderPath)) {
            fs.mkdirSync(nestedSubfolderPath, { recursive: true })
        } else {
            const error = new HttpError('Nested subfolder already exists in the file system', 400)
            return next(error)
        }

        res.status(201).json({ message: `Nested subfolder ${nestedSubfolderName} created`, subfolder: newNestedSubfolder })
    } catch (err) {
        const error = new HttpError('Creating nested subfolder failed', 500)
        return next(error)
    }
}


export const getNestedSubfolders = async (req, res, next) => {
    try {
        const { folderName, subfolderName } = req.params

        // Find the folder
        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })
        if (!folderData) {
            return next(new HttpError('Folder not found', 404))
        }

        // Find the subfolder
        const subfolder = await Subfolder.findOne({ subfolderName, parentFolder: folderData._id, 'isDeleted.status': false })
        if (!subfolder) {
            return next(new HttpError('Subfolder not found', 404))
        }

        // Find the nested subfolders
        const nestedSubfolders = await NestedSubfolder.find({
            parentFolder: folderData._id,
            parentSubfolder: subfolder._id,
            'isDeleted.status': false
        }).populate('parentFolder')

        // Respond with the nested subfolders
        res.status(200).json(nestedSubfolders)
    } catch (err) {
        return next(new HttpError('Fetching nested subfolders failed', 500))
    }
}


export const getSingleNestedSubfolders = async (req, res, next) => {
    try {
        const { folderName, subfolderName } = req.params

        // Find the folder
        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })
        if (!folderData) {
            return next(new HttpError('Folder not found', 404))
        }

        // Find the subfolder
        const subfolder = await Subfolder.findOne({ subfolderName, parentFolder: folderData._id, 'isDeleted.status': false }).populate('parentFolder')
        if (!subfolder) {
            return next(new HttpError('Subfolder not found', 404))
        }

        // Find the nested subfolders
        const nestedSubfolders = await NestedSubfolder.find({
            parentFolder: folderData._id,
            parentSubfolder: subfolder._id,
            'isDeleted.status': false
        }).populate('parentFolder').populate('parentSubfolder')

        // Return both subfolder and nested subfolders
        res.status(200).json({ subfolder, nestedSubfolders })
    } catch (err) {
        return next(new HttpError('Fetching subfolder and nested subfolders failed', 500))
    }
}

export const getSingleNestedSubfolderData = async (req, res, next) => {
    try {
        const { folderName, subfolderName, nestedSubfolderName } = req.params

        // Find the folder
        const folderData = await Folder.findOne({ folderName, 'isDeleted.status': false })
        if (!folderData) {
            return next(new HttpError('Folder not found', 404))
        }

        // Find the subfolder
        const subfolder = await Subfolder.findOne({ subfolderName, parentFolder: folderData._id, 'isDeleted.status': false }).populate('parentFolder')
        if (!subfolder) {
            return next(new HttpError('Subfolder not found', 404))
        }

        // Find the nested subfolders
        const nestedSubfolders = await NestedSubfolder.findOne({
            nestedSubfolderName: nestedSubfolderName,
            parentFolder: folderData._id,
            parentSubfolder: subfolder._id,
            'isDeleted.status': false
        }).populate('parentFolder').populate('parentSubfolder')

        // Return both subfolder and nested subfolders
        res.status(200).json(nestedSubfolders)
    } catch (err) {
        return next(new HttpError('Fetching subfolder and nested subfolders failed', 500))
    }
}


export const renameNestedSubfolder = async (req, res, next) => {
    try {
        const nestedSubfolderId = req.params.id
        const { nestedSubfolderName } = req.body

        const nestedSubfolder = await NestedSubfolder.findOneAndUpdate({ _id: nestedSubfolderId }, { folderTitle: nestedSubfolderName })

        res.status(200).json({ message: "Folder Renamed" })

    } catch (err) {
        const error = new HttpError('Rename Failed', 500)
        return next(error)
    }
}



export const uploadFilesNestedSubfolder = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new HttpError('No files uploaded', 400)
        }

        const { folderName, subfolderName, nestedSubfolderName } = req.params

        // Ensure all parameters are provided
        if (!folderName || !subfolderName || !nestedSubfolderName) {
            throw new HttpError('Missing parameters', 400)
        }

        // Find the parent folder
        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })
        if (!folder) {
            throw new HttpError('Parent folder not found', 404)
        }

        const subfolder = await Subfolder.findOne({ subfolderName, parentFolder: folder._id, 'isDeleted.status': false }).populate('parentFolder')
        if (!subfolder) {
            throw new HttpError('Subfolder not found', 404)
        }

        const nestedSubfolder = await NestedSubfolder.findOne({ nestedSubfolderName, parentFolder: folder._id, parentSubfolder: subfolder._id, 'isDeleted.status': false }).populate('parentFolder').populate('parentSubfolder')
        if (!nestedSubfolder) {
            throw new HttpError('Nested subfolder not found', 404)
        }


        req.files.forEach(async (file) => {

            const filePath = `/${nestedSubfolder.parentFolder.folderName}/${nestedSubfolder.parentSubfolder.subfolderName}/${nestedSubfolder.nestedSubfolderName}/${file.originalname}`


            // Create an object with file details
            const newResource = {
                portionTitle: file.originalname || null,
                filePath: filePath,
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size
            }

            // Push the new resource into the nested subfolder's resources array
            nestedSubfolder.resources.push(newResource)
        })

        // Save the nested subfolder document with the new resources
        await nestedSubfolder.save()

        res.status(200).json({
            message: 'Files uploaded successfully',
            resources: nestedSubfolder.resources
        })
    } catch (err) {
        const error = new HttpError('File upload failed', 500)
        return next(error)
    }
}







export const deleteNestedSubfolder = async (req, res, next) => {
    try {
        const nestedSubfolderId = req.params.id

        const deleteFolderDetail = await NestedSubfolder.findById(nestedSubfolderId).populate('parentFolder').populate('parentSubfolder')

        if (deleteFolderDetail) {
            // Construct the folder path
            const folderPath = `./uploads/${deleteFolderDetail.parentFolder.folderName}/${deleteFolderDetail.parentSubfolder.subfolderName}/${deleteFolderDetail.nestedSubfolderName}`

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


export const deleteNestedSubfolderResource = async (req, res, next) => {
    try {
        const { folderName, subfolderName, nestedSubfolderName, resourceId } = req.params

        const folder = await Folder.findOne({ folderName, 'isDeleted.status': false })

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' })
        }

        const subfolder = await Subfolder.findOne({ parentFolder: folder._id, subfolderName, 'isDeleted.status': false })

        if (!subfolder) {
            return res.status(404).json({ message: 'Subfolder not found' })
        }

        const nestedSubfolder = await NestedSubfolder.findOne({
            parentFolder: folder._id,
            parentSubfolder: subfolder._id,
            nestedSubfolderName,
            'isDeleted.status': false
        })

        if (!nestedSubfolder) {
            return res.status(404).json({ message: 'Nested subfolder not found' })
        }

        const resourceIndex = nestedSubfolder.resources.findIndex(resource => resource._id.equals(resourceId))

        if (resourceIndex === -1) {
            return res.status(404).json({ message: 'Resource not found' })
        }

        const deletedResource = nestedSubfolder.resources.splice(resourceIndex, 1)[0]

        await nestedSubfolder.save()

        const filePath = `./uploads/${deletedResource.filePath}`
        const normalizedPath = path.normalize(filePath)

        // Delete the file from the file system
        fs.unlink(normalizedPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            }
        })

        // Return a success message
        res.status(200).json({ message: 'Resource deleted successfully' })

    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
};

export const renameNestedSubfolderResource = async (req, res, next) => {
    try {
        const folderName = req.params.folderName
        const subfolderName = req.params.subfolderName
        const nestedsubfolderName = req.params.nestedsubfolderName
        const resourceId = req.params.resourceid
        const { portionTitle } = req.body

        const folder = await Folder.findOne({ folderName: folderName, 'isDeleted.status': false })

        if (folder) {
            const subfolder = await Subfolder.findOne({ parentFolder: folder._id, subfolderName, 'isDeleted.status': false })

            if(subfolder){
                const nestedsubfolder = await NestedSubfolder.findOneAndUpdate(
                    {
                        nestedSubfolderName: nestedsubfolderName,
                        "isDeleted.status": false,
                        "resources._id": resourceId
                    },
                    {
                        $set: { "resources.$.portionTitle": portionTitle }
                    },
                    { new: true }
                )
            }
           
        }

        res.status(200).json({ message: "File Renamed" })

    } catch (err) {
        const error = new HttpError('Rename Failed', 500)
        return next(error)
    }
}