// server.js

import express from 'express';

import cookieParser from 'cookie-parser';

import cors from 'cors';

import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';

import portfolioRoutes from './routes/portfolioRoutes.js';



dotenv.config();

const app = express();



// Middleware

app.use(express.json());

app.use(cookieParser());

app.use(cors({

  origin: ['https://cryptonep.com', 'https://www.cryptonep.com', 'https://cryptonep.vercel.app'],

  credentials: true,

}));



// Routes

app.use('/auth', authRoutes);

app.use('/portfolio', portfolioRoutes);



// Start server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




