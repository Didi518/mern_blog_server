import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from 'cloudinary'

import cloudinaryConfig from '../config/cloudinary.js'

cloudinaryConfig

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern_blog',
    format: async (_req, _file) => 'jpeg',
    upload_preset: 'mern_blog_upload',
  },
})

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1000000,
  },
  fileFilter: function (_req, file, cb) {
    let ext = file.mimetype.split('/')[1]
    if (!['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext)) {
      return cb(new Error('Seuls les fichiers image sont autorisés'))
    }
    cb(null, true)
  },
})

export { uploadPicture }
