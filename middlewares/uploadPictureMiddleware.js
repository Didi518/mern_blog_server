// Ce fichier est maintenant déprécié - utiliser config/cloudinary.js à la place
// Gardé pour compatibilité temporaire

import { uploadAvatar, uploadPostImage } from '../config/cloudinary.js';

// Re-export pour maintenir la compatibilité
export const uploadPicture = uploadAvatar;

// Export des nouveaux middlewares
export { uploadAvatar, uploadPostImage };
