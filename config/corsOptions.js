import allowedOrigins from './allowedOrigins.js';

export const corsOptions = {
  origin: function (origin, callback) {
    // Requêtes sans origine (curl, Postman, health checks)
    if (!origin) return callback(null, true);

    // Origine autorisée -> en-têtes CORS ajoutés ; sinon pas d'en-têtes, sans lever d'erreur 500
    callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Indispensable pour que le client puisse lire la pagination (DataTable, liste d'articles)
  exposedHeaders: [
    'x-filter',
    'x-totalcount',
    'x-currentpage',
    'x-pagesize',
    'x-totalpagecount',
  ],
  optionsSuccessStatus: 204,
};
