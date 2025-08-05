import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'
import connectDB from './config/mongoose.js';

dotenv.config({ path: '../.env' });
const app = express();
const port = process.env.PORT || 4000;

connectDB();


const allowedOrigins = process.env.FRONTEND_URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.get('/',(req,res) => {
    res.send("API working")
})

app.use('/auth/api',authRouter)
app.use('/api/user',userRouter)

app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
})