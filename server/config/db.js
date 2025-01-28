import mongoose from "mongoose";
//Function to connect to the mongodb databases
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/MyDatabase`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process if the database connection fails
    }
};


export default connectDB