
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate:{
            validator: (email) =>{
                return email.includes("@gmail.com")
            },
            message: (props) => `${props.value} is not valid email`            
        }
    },
    userName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
    },
    description:String,
    chats:[{
        chatId: String,
        chatName: String
    }],
    notifications:[{
        sender: String,
        message: String,
        accpeted: Boolean
    }]
})

export const UserModel = mongoose.model('userDb', UserSchema)