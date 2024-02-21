import multer from 'multer'

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Upload folder will be 'public/:id'
        cb(null, `public/${req.params.folderName}`)
    },
    filename: function (req, file, cb) {
        // File will be stored with original name
        cb(null, file.originalname)
    }
})

// Initialize upload
const upload = multer({
    storage: storage
})

export default upload