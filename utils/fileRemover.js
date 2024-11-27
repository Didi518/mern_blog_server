import cloudinary from 'cloudinary'

const fileRemover = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === 'ok') {
      console.log(`Suppression réussie pour le fichier : ${publicId}`)
    } else {
      console.log(`Erreur : Le fichier ${publicId} n'a pas pu être supprimé.`)
    }
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du fichier ${publicId}:`,
      error.message
    )
  }
}

export { fileRemover }
