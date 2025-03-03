import mongoose from "mongoose"

const ChatShema = new mongoose.Schema({
    type:String,
    name: String,
    profilePic: String,
    participants:[String],
    chats:[{
        userName: String,
        message: String,
    }]
})

export const ChatModel = mongoose.model('AllChats',ChatShema)