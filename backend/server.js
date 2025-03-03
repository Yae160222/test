import express from "express"
import cors from "cors"
import {Server} from "socket.io"
import { createServer } from "node:http"
import mongoose from "mongoose"
import { LogModel } from './models/LogSchema.js'
import router from "./routes.js"
import { UserModel } from "./models/UserSchema.js"
import bodyParser from "body-parser"

//const mongoose = require('mongoose');
//const UserModel = require('./path/to/your/userModel'); // Adjust path accordingly

/*const migrateNotifications = async () => {
    try {
        const users = await UserModel.find({});

        for (const user of users) {
            if (user.notifications.length > 0 && typeof user.notifications[0] === 'string') {
                // Convert string notifications to objects
                user.notifications = user.notifications.map(notification => ({
                    sender: 'unknown', // or some default value
                    message: notification,
                    accepted: false,
                    timestamp: new Date()
                }));

                // Save the updated user document
                await user.save();
                console.log(`Updated notifications for user: ${user.userName}`);
            }
        }

        console.log('Migration completed.');
    } catch (err) {
        console.error('Error during migration:', err);
    }
};

mongoose.connect('mongodb://localhost:27017/projects', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
        return migrateNotifications();
    })
    .then(() => mongoose.disconnect())
    .catch(err => console.error('Database connection error:', err));*/


mongoose.connect('mongodb://localhost:27017/projects').then(() => console.log('connected')).catch((err) => console.log(err))

const port = 3000

const app = express()

const server = createServer(app)
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });
  
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json())
app.use(router)
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

io.use(async (socket, next) => {
  if(socket.handshake.query){
    const { email, password } = socket.handshake.query;
    try {
      const user = await UserModel.findOne({ email: email });
      if (user && user.password === password) {
        socket.user = user.userName;
        
        return next(); // Allow the connection to proceed
      } else {
        return next(new Error('Authentication error')); // Reject the connection
      }
    } catch (err) {
      return next(new Error('Authentication error')); // Reject the connection in case of error
    }
  }
  return next(new Error('No details entered'))
});


io.on('connection', async (socket) => {
    const entry = new LogModel({socketID: socket.id, userID: socket.user})
    await entry.save()

    socket.on("joinroom", (roomName)=>{
      socket.join(roomName)
    })

    socket.on("leaveroom", (roomName) =>{
      socket.leave(roomName)
    })

    socket.on('disconnect', async ()=>{
        await LogModel.deleteOne({socketID: socket.id})
    })

    socket.on('chat message', (roomName, msg)=>{
        socket.to(roomName).emit('chat message', {chatId: roomName, userId: socket.id, message: msg})
    })
})

server.listen(port,() =>{
    console.log(`running at port ${port}`)
})

