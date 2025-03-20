import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema ({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        minlength: 4
    },
    password: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema);