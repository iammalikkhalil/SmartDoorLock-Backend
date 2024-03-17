import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_LOCAL_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to the database');
  } catch (error) {
    console.error(`Error connecting to the database. ${error}`);
  }
};

export default connectDB;