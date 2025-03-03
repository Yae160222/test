import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    socketID: String,
    userID: String,
})

 export const LogModel = mongoose.model('Log',LogSchema)
