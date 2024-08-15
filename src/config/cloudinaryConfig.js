const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('./serverConfig')

const cloudinary = require('cloudinary').v2

cloudinary.config({  //picked up as it is from cloudinary website
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

module.exports = cloudinary