import mongoose from "mongoose"


export const GroupChatSchema = new mongoose.Schema({
        type:String,
        name: String,
        profilePic: String,
        participants:[String],
        description: String,
        messages:[{
            userId: String,
            message: String,
            time: String,
        }]        
})

export const PrivateChatSchema = new mongoose.Schema({
    type: String,
    messages:[{
        userId: String,
        message: String,
        time: String
    }]
})
export const GroupChatModel = mongoose.model('GroupChats',GroupChatSchema)
export const PrivateChatModel = mongoose.model('PrivateChats', PrivateChatSchema)