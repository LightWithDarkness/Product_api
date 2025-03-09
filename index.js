import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';


config();
//
const PORT = process.env.PORT || 3000;
const app = express();






const startServer = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, ()=> console.log(`Server is live at Port ${PORT} and Connected to Database`));
    } catch (error) {
        console.log(error);
    }
}

startServer();