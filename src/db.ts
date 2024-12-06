import mongoose from 'mongoose';

const MONGO_URI =
  'mongodb+srv://debangshimandal:PY337BRNju0ManTh@aistudio.q7oao.mongodb.net/AIStudio';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
