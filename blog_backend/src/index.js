import dotenv from 'dotenv';
//load the environment variables first 
//why because to store sensitive values 
dotenv.config({
    path: './.env'
})

import connectDB from "./db/index.js";
import {app} from './app.js';


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on ${process.env.PORT}`);
    }) 
})
.catch((error) => {
    console.log("Mongodb connection failed!!!", error);
})