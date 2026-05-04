import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import { corsOptions } from './config/corsOptions.js';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import postCategoriesRoutes from './routes/postCategoriesRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

connectDB();

app.get('/', (_req, res) => {
  res.send('Serveur connecté...');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/post-categories', postCategoriesRoutes);

export default app;
