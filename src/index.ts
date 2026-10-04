import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import riderRoutes from './router/rider.js'

dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use(cors);
app.use('/api/rider' , riderRoutes);

app.listen(process.env.PORT , () => {
    console.log(`rider server running on port ${process.env.PORT}`);
    
})