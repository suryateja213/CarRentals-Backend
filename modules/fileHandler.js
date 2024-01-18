import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images')
    },
    filename: function (req, file, callback) {
        const ext = file.originalname.split('.').pop()
        const file_name = Math.floor(100000 + Math.random() * 100000) + '_' + Date.now() + '.' + ext
        // file.filename = req.body.email + "_profile." + ext
        file.filename = file_name
        callback(null, file.filename)
    }
})
const upload = multer({ storage: storage }).single("profile_picture")

export default upload
