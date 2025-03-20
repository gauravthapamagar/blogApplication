import { User } from "../models/user.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET;
const registerUser = async(req, res) => {

    //get valid details from frontend
    //validation
    //check if the user already exists
    //create user object- create entry in the database
    //remove password and refreshtoken from the response
    //check for user creation
    //return response

    const {username, password} = req.body;
    
    //validation
    if(
        [username, password].some((field) => field?.trim() === "")
    ){
        res.status(400).json({message: "all fields are required"});
    }
    //check if user already exists
    const existedUser = await User.findOne({
        $or: [{username}]
    })

    if(existedUser){
        res.status(400).json({message: "User with this username already exists"})
    }

    try {
        //for password hashing
        const salt = bcrypt.genSaltSync(10); //salt ensures that even though two users have same password, their hashed passwords will be different
        const hashedPassword = bcrypt.hashSync(password, salt);

        //create entry in the database
        const user = await User.create({
            username,
            password: hashedPassword
        })
        res.json(user);
        
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        
    }

}

// const loginUser = async(req, res) => {
//     //get data from req.body
//     //username or email
//     //find the user
//     //check the passwod
//     //access and refresh token
//     //send cookies
//     const {username, password} =req.body;
//     // Use a securely generated random string (secret key) for signing JWT tokens. at .env
//     // Do not use a JWT token itself as the secret key. The secret key ensures the integrity and authenticity of the JWT.
//     // code to generate secret key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    
//     if(!(username) || !(password)){

//         return res.status(400).json({message: "Username or password is required"})
//     }
//     const user = await User.findOne({
//         username
//     })
//     //if not found
//     if(!user){
//         return res.status(400).json({message: "User not found"})
//     }
//     //check for password
//     const isPasswordValid = bcrypt.compareSync(password, user.password);
//     if(!isPasswordValid){
//         return res.status(400).json({message: "Invalid user credentials"})
//     }
//     //login functionality
//     if(isPasswordValid){
//         jwt.sign({username, id:user._id}, secret, {}, (err, token) => {
//             if (err) throw err;
//             res.cookie('token', token).json({id: user._id, username})
//         })
//     }
//     else{
//         res.status(400).json({message: "Wrong credentials"})
//     }
// }

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password is required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for password validity
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid user credentials" });
    }

    // Generate JWT Token
    jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
        if (err) {
            console.error("JWT Error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Send response with cookie
        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            id: user._id,
            username,
            token, // Include token in the response for debugging
        });
    });
};
const userProfile = async(req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info)
    })
}

const logoutUser = async(req, res) => {
    res.cookie('token', '').json({message: "Logged Out Successfully"});
}



export {
    registerUser,
    loginUser,
    userProfile,
    logoutUser

}