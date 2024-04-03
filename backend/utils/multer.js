import multer from 'multer'

const storage = function (req, file, cb) {
    let destination
    if (req.params.subfolderName) {
        destination = `./uploads/${req.params.folderName}/${req.params.subfolderName}`
    } else {
        destination = `./uploads/${req.params.folderName}`
    }
    cb(null, destination)
}

const upload = multer({
    storage: multer.diskStorage({
        destination: storage,
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
});

export default upload