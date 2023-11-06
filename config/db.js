import mongoose from 'mongoose';

const connectionToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    const url = `${connection.connection.host}: ${connection.connection.port}`;
    console.log(`MongoDB connected to ${url}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectionToDb;
