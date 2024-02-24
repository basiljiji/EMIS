import HttpError from '../utils/httpErrorMiddleware.js'
import Folder from '../models/folderModel.js'

export const fetchResources = async (req, res, next) => {
    try {
        const { classdata, sectiondata, subjectdata } = req.body

        console.log(classdata, "foldee")

        let filter = {}

        // Check if both classdata and sectiondata are present
        if (classdata && sectiondata) {
            filter = {
                $and: [
                    { 'accessTo.classAccess': classdata },
                    { 'accessTo.sectionAccess': sectiondata }
                ]
            }
        } else {
            // If only one or none of them is present
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
        const error = new HttpError('Something Went Wrong', 400)
        return next(error)
    }
}