import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING.replace(
        "<password>",
        process.env.MONGODB_PASSWORD
      )
    );
    console.log(`Base de données connectée, ${conn.connection.host} 👍`);
  } catch (error) {
    // Pas de process.exit(1) : sur Vercel cela tue la fonction serverless
    console.error(`Erreur MongoDB: ${error.message}`);
  }
};

export default connectDB;
