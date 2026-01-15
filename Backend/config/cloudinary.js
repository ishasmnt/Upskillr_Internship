require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'upskillr/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'webm'],
    transformation: [{ quality: 'auto' }]
  }
});

// Storage for notes/documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'upskillr/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx']
  }
});

module.exports = { cloudinary, videoStorage, documentStorage };