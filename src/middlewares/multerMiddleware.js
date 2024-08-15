const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req,file,next)=>{
        next(null,'uploads')
    }, // Specify the upload directory
    filename: (req,file,next)=>{
        const ext = path.extname(file.originalname) // TO GIVE EXTENTION NAME SAME AS ORIGINAL FILE UPLOADED
        next(null, `${Date.now()}-${ext}`);
    }
    
})

const uploader = multer({
    storage: storage,
})

module.exports = uploader;