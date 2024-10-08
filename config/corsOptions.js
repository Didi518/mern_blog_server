import allowedOrigins from "./allowedOrigins.js";

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-totalpagecount",
    "x-currentpage",
    "x-filter",
    "x-pagesize",
  ],
  exposedHeaders: [
    "x-totalpagecount",
    "x-currentpage",
    "x-filter",
    "x-pagesize",
    "x-totalcount",
  ],
};
