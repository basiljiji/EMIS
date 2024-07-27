import multer from 'multer'
import fs from 'fs'
import path from 'path'

// Helper function to create directory if it doesn't exist
const ensureDirectoryExistence = async (dir) => {
    try {
        await fs.promises.mkdir(dir, { recursive: true })
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err
        }
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let destination
        if (req.params.nestedSubfolderName) {
            destination = path.join('./uploads', req.params.folderName, req.params.subfolderName, req.params.nestedSubfolderName)
        } else if (req.params.subfolderName) {
            destination = path.join('./uploads', req.params.folderName, req.params.subfolderName)
        } else {
            destination = path.join('./uploads', req.params.folderName)
        }

        // Ensure the directory exists
        try {
            await ensureDirectoryExistence(destination)
            cb(null, destination)
        } catch (err) {
            cb(err)
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload
