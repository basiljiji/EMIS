import HttpError from '../utils/httpErrorMiddleware.js'
import Folder from '../models/folderModel.js'

export const fetchFolders = async (req, res, next) => {
    try {
        const { classdata, sectiondata, subjectdata } = req.body

        let filter = {}

        if (classdata && sectiondata) {
            filter = {
                $and: [
                    { 'accessTo.classAccess': classdata },
                    { 'accessTo.sectionAccess': sectiondata }
                ]
            }
        } else {
            if (classdata) {
                filter['accessTo.classAccess'] = classdata
            }
            if (sectiondata) {
                filter['accessTo.sectionAccess'] = sectiondata
            }
            if (subjectdata) {
                filter['accessTo.subjectAccess'] = subjectdata
            }
        }

        const folders = await Folder.find(filter)

        res.json(folders)
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}

export const fetchResources = async (req, res, next) => {
    try {
        const { folderName } = req.params.folderName
        const folders = await Folder.findOne({ folderName })


        if (!folders) {
            const error = new HttpError('No Folder Found', 404)
            return next(error)
        } else {
            res.status(200).json(folders)
        }
    } catch (err) {
        const error = new HttpError('Something Went Wrong', 500)
        return next(error)
    }
}

