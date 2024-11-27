import mongoose from 'mongoose'

import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { uploadPicture } from '../middlewares/uploadPictureMiddleware.js'
import { fileRemover } from '../utils/fileRemover.js'

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    let user = await User.findOne({ email })

    if (user) {
      throw new Error('Cet email est déjà associé à un autre compte')
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
      throw new Error('Email introuvable')
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
      throw new Error('Identifiants invalides')
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
      let error = new Error('Utilisateur introuvable')
      error.statusCode = 404
      next(error)
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
      let error = new Error('Action interdite')
      error.statusCode = 403
      throw error
    }

    let user = await User.findById(userIdToUpdate)

    if (!user) {
      throw new Error('Utilisateur introuvable')
    }

    if (typeof req.body.admin !== 'undefined' && req.user.admin) {
      user.admin = req.body.admin
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password && req.body.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères')
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
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({ error: 'Aucun fichier image fourni' })
    }

    const file = req.files.profilePicture
    console.log('Fichier reçu:', file) // Ajoutez ce log pour vérifier le fichier reçu

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
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword
    let where = {}
    if (filter) {
      where.email = { $regex: filter, $options: 'i' }
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
    })

    if (page > pages) {
      return res.json([])
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: 'desc' })

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
      throw new Error('Utilisateur introuvable')
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

    postsToDelete.forEach((post) => {
      fileRemover(post.photo)
    })

    await user.deleteOne({ session })
    fileRemover(user.avatar)

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
