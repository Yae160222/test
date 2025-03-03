import { useState } from "react";
import { io } from "socket.io-client";
export let socket = null;
const loading = "loading..."
const loadingState ={
    email: loading,
    userName: loading,
    password: loading,
    profilePic: loading,
    description: loading,
    chats:[loading],
    notifications: [loading]
}
//export let [userInfo, setUserInfo] = useState(loadingState)
export let profilePic = null
let base64 = null

export const createScoket = (data) =>{
    socket = io('http://localhost:3000', {query: data})
    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        //getUserInfo()
    });
    return socket
}

export const getProfilePic = async () => {
    if(base64){
        return base64
    }
    try{
        profilePic = await fetch('/ProfilePic.png')
        const blob = await profilePic.blob()
        const reader = new FileReader()
        reader.onloadend = ()=>{
            base64 = reader.result
        }
        reader.readAsDataURL(blob)
    }catch(err){
        console.log(err)
    }
}
/* 
part -1 ** CREATING FUNCTIONAL APP

1. Image handling in database
2. frontend pages

// part -2 (ADDING CHAT HISTORY)
3. db schema for chat history
4. Code for updating and acessing chat history
3. routes for getting chat history
4. merging front end and backend
*/