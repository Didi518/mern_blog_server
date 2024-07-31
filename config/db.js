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
    console.log(`Erreur: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
