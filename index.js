import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.handler.js';


config();
//
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);

//custom middleware
app.use(errorHandler);


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`Server is live at Port ${PORT} and Connected to Database`));
    } catch (error) {
        console.log(error);
    }
}

startServer();