
const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinaryConfig')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pizza-products', // ✅ Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Optional
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional
  },
});

const uploader = multer({ storage });

module.exports = uploader;
