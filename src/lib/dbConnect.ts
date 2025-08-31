
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};


async function dbconnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Database is connected");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGOOSE_URI || " " , {})
        
        connection.isConnected = db.connections[0].readyState

        
        
        console.log("DB connected successfully");
        
    } catch (error) {
        console.log("Database connection falied" , error);
        
        process.exit(1)
    }
}

export default dbconnect


