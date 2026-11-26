import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { corsOptions } from './config/corsOptions.js';
import { errorResponseHandler, invalidPathHandler } from './middlewares/errorHandler.js';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import postCategoriesRoutes from './routes/postCategoriesRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API OK');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/post-categories', postCategoriesRoutes);

app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
}

export default app;
