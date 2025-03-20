import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';

const app = express();


app.use(cors({
    //which which origin you are allowing
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    
    
}))

//Middlewares
app.use(express.json()); //this line is crucial in order to parse json requests.
app.use(cookieParser());
//Use routes
app.use("/api/users", userRoutes)

export { app };
