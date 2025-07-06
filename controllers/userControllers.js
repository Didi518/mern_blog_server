<<<<<<< HEAD
import mongoose from 'mongoose'

import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { uploadPicture } from '../middlewares/uploadPictureMiddleware.js'
import { fileRemover } from '../utils/fileRemover.js'
=======
import mongoose from 'mongoose';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { uploadAvatar } from '../config/cloudinary.js';
import {
  deleteCloudinaryImage,
  extractPublicId,
} from '../config/cloudinary.js';
>>>>>>> restore-47d26e3

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    let user = await User.findOne({ email })

    if (user) {
<<<<<<< HEAD
      throw new Error('Cet email est déjà associé à un autre compte')
=======
      throw new Error('Cet email est déjà associé à un autre compte');
>>>>>>> restore-47d26e3
    }

    user = await User.create({
      name,
      email,
      password,
    })

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })

    if (!user) {
<<<<<<< HEAD
      throw new Error('Email introuvable')
=======
      throw new Error('Email introuvable');
>>>>>>> restore-47d26e3
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      })
    } else {
<<<<<<< HEAD
      throw new Error('Identifiants invalides')
=======
      throw new Error('Identifiants invalides');
>>>>>>> restore-47d26e3
    }
  } catch (error) {
    next(error)
  }
}

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id)

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      })
    } else {
<<<<<<< HEAD
      let error = new Error('Utilisateur introuvable')
      error.statusCode = 404
      next(error)
=======
      let error = new Error('Utilisateur introuvable');
      error.statusCode = 404;
      next(error);
>>>>>>> restore-47d26e3
    }
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId

    const userId = req.user._id

    if (!req.user.admin && userId !== userIdToUpdate) {
<<<<<<< HEAD
      let error = new Error('Action interdite')
      error.statusCode = 403
      throw error
=======
      let error = new Error('Action interdite');
      error.statusCode = 403;
      throw error;
>>>>>>> restore-47d26e3
    }

    let user = await User.findById(userIdToUpdate)

    if (!user) {
<<<<<<< HEAD
      throw new Error('Utilisateur introuvable')
    }

    if (typeof req.body.admin !== 'undefined' && req.user.admin) {
      user.admin = req.body.admin
=======
      throw new Error('Utilisateur introuvable');
    }

    if (typeof req.body.admin !== 'undefined' && req.user.admin) {
      user.admin = req.body.admin;
>>>>>>> restore-47d26e3
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password && req.body.password.length < 6) {
<<<<<<< HEAD
      throw new Error('Le mot de passe doit contenir au moins 6 caractères')
=======
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
>>>>>>> restore-47d26e3
    } else if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUserProfile = await user.save()

    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    })
  } catch (error) {
    next(error)
  }
}

const updateProfilePicture = async (req, res, next) => {
  try {
<<<<<<< HEAD
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({ error: 'Aucun fichier image fourni' })
    }

    const file = req.files.profilePicture
    const imageUrl = await uploadPicture(file)

    let updatedUser = await User.findById(req.user._id)
    const oldFilename = updatedUser.avatar

    if (oldFilename) {
      fileRemover(oldFilename)
    }

    updatedUser.avatar = imageUrl
    await updatedUser.save()

    res.json({
      _id: updatedUser._id,
      avatar: updatedUser.avatar,
      name: updatedUser.name,
      email: updatedUser.email,
      verified: updatedUser.verified,
      admin: updatedUser.admin,
      token: await updatedUser.generateJWT(),
    })
=======
    const upload = uploadAvatar.single('profilePicture');

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          'Une erreur inconnue est survenue lors du chargement ' + err.message
        );
        next(error);
      } else {
        if (req.file) {
          let updatedUser = await User.findById(req.user._id);

          // Supprimer l'ancienne image de Cloudinary si elle existe
          if (updatedUser.avatar) {
            const publicId = extractPublicId(updatedUser.avatar);
            if (publicId) {
              await deleteCloudinaryImage(publicId);
            }
          }

          // Sauvegarder la nouvelle URL Cloudinary
          updatedUser.avatar = req.file.path; // Cloudinary stocke l'URL complète dans req.file.path
          await updatedUser.save();

          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
          let updatedUser = await User.findById(req.user._id);

          // Supprimer l'image actuelle de Cloudinary
          if (updatedUser.avatar) {
            const publicId = extractPublicId(updatedUser.avatar);
            if (publicId) {
              await deleteCloudinaryImage(publicId);
            }
          }

          updatedUser.avatar = '';
          await updatedUser.save();

          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
>>>>>>> restore-47d26e3
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword
    let where = {}
    if (filter) {
<<<<<<< HEAD
      where.email = { $regex: filter, $options: 'i' }
=======
      where.email = { $regex: filter, $options: 'i' };
>>>>>>> restore-47d26e3
    }
    let query = User.find(where)
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 10
    const skip = (page - 1) * pageSize
    const total = await User.find(where).countDocuments()
    const pages = Math.ceil(total / pageSize)

    res.header({
      'x-filter': filter,
      'x-totalcount': JSON.stringify(total),
      'x-currentpage': JSON.stringify(page),
      'x-pagesize': JSON.stringify(pageSize),
      'x-totalpagecount': JSON.stringify(pages),
<<<<<<< HEAD
    })
=======
    });
>>>>>>> restore-47d26e3

    if (page > pages) {
      return res.json([])
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
<<<<<<< HEAD
      .sort({ updatedAt: 'desc' })
=======
      .sort({ updatedAt: 'desc' });
>>>>>>> restore-47d26e3

    return res.json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCommentWithReplies = async (commentId, session) => {
  const commentsToDelete = await Comment.find({ parent: commentId }).session(
    session
  )
  for (const comment of commentsToDelete) {
    await deleteCommentWithReplies(comment._id, session)
  }
  await Comment.deleteOne({ _id: commentId }).session(session)
}

const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let user = await User.findById(req.params.userId).session(session)

    if (!user) {
<<<<<<< HEAD
      throw new Error('Utilisateur introuvable')
=======
      throw new Error('Utilisateur introuvable');
>>>>>>> restore-47d26e3
    }

    const postsToDelete = await Post.find({ user: user._id }).session(session)
    const postsIdsToDelete = postsToDelete.map((post) => post._id)

    for (const postId of postsIdsToDelete) {
      const commentsToDelete = await Comment.find({ post: postId }).session(
        session
      )
      for (const comment of commentsToDelete) {
        await deleteCommentWithReplies(comment._id, session)
      }
    }

    await Post.deleteMany({ _id: { $in: postsIdsToDelete } }).session(session)

<<<<<<< HEAD
    postsToDelete.forEach((post) => {
      fileRemover(post.photo)
    })

    await user.deleteOne({ session })
    fileRemover(user.avatar)
=======
    // Supprimer les images des posts de Cloudinary
    for (const post of postsToDelete) {
      if (post.photo) {
        const publicId = extractPublicId(post.photo);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      }
    }

    // Supprimer l'avatar de l'utilisateur de Cloudinary
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    await user.deleteOne({ session });
>>>>>>> restore-47d26e3

    await Comment.updateMany({ user: user._id }, { user: null }).session(
      session
    )

    await session.commitTransaction()
    session.endSession()

    res.status(204).end()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}

export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
}
