import cloudinary from 'cloudinary'

import cloudinaryConfig from '../config/cloudinary.js'

cloudinaryConfig

const uploadPicture = async (file) => {
  try {
    const base64Image = Buffer.from(file.data).toString('base64')
    const dataURI = `data:${file.mimetype};base64,${base64Image}`

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
      folder: 'mern_blog',
      public_id: `${Date.now()}-${file.name}`,
    })

    return uploadResponse.url
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image:", error)
    throw new Error("Erreur lors du téléchargement de l'image")
  }
}

export { uploadPicture }
