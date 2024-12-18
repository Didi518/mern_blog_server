import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import connectDB from './config/db.js'
import { corsOptions } from './config/corsOptions.js'
import {
  errorResponseHandler,
  invalidPathHandler,
} from './middlewares/errorHandler.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import postCategoriesRoutes from './routes/postCategoriesRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(cors(corsOptions))
app.use(fileUpload())

app.get('/', (_req, res) => {
  res.send('Serveur connecté...')
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/comments', commentRoutes)
app.use('/api/v1/post-categories', postCategoriesRoutes)

app.use(invalidPathHandler)
app.use(errorResponseHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Serveur connecté sur le port ${PORT}`))
