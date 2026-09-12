import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors);

app.listen(process.env.PORT , () => {
    console.log(`rider server running on port ${process.env.PORT}`);
    connectDB();
})