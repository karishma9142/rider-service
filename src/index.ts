import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import riderRoutes from './router/rider.js'
import { connectRabbitMq } from './config/rabbitmq.js';
import { startOrderReadyConsumer } from './config/orderReadyConsumer.js';

dotenv.config();
await connectRabbitMq();
startOrderReadyConsumer();
connectDB();
const app=express();
app.use(express.json());
app.use(cors());
app.use('/api/rider' , riderRoutes);

app.listen(process.env.PORT , () => {
    console.log(`rider server running on port ${process.env.PORT}`);
    
})