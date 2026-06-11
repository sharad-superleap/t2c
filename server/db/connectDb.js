import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO) {
        throw new Error("MONGO is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");
};

export default connectDB;