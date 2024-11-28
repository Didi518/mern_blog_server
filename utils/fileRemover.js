import cloudinary from 'cloudinary'

const extractPublicIdFromUrl = (url) => {
  const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/
  const match = url.match(regex)
  return match ? match[1] : null
}

const fileRemover = async (imageUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl)

    if (!publicId) {
      console.log(`Le public_id n'a pas pu être extrait de l'URL: ${imageUrl}`)
      return
    }

    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === 'ok') {
      console.log(`Suppression réussie pour le fichier : ${publicId}`)
    } else {
      console.log(`Erreur : Le fichier ${publicId} n'a pas pu être supprimé.`)
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du fichier: ${error.message}`)
  }
}

export { fileRemover }
