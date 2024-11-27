import cloudinary from 'cloudinary'

const cloudinaryConfig = cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
})

export default cloudinaryConfig
