import express from "express";
import { UserModel } from "./models/UserSchema.js";
import { PrivateChatModel, GroupChatModel } from "./models/Chatschema.js";
import { LogModel } from "./models/LogSchema.js";
import mongoose, { Mongoose } from "mongoose";
import { ChatModel } from "./models/GroupChatSchema.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const user = new UserModel(req.body);

  const emailAlreadyExists = await UserModel.find({ email: user.email });
  if (emailAlreadyExists.length != 0) {
    return res.json({ message: "email already exists" });
  }

  const userNameAlreadyExixts = await UserModel.find({
    userName: user.userName,
  });
  if (userNameAlreadyExixts.length != 0) {
    return res.json({ message: "userName already exists" });
  }

  user
    .save()
    .then(() => {
      return res.json({ message: "sucessfully created account" });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.send({ message: err.errors.email.message });
      }
      return res.send({ message: "unexpected error has occured" });
    });
});

router.get("/verify", async (req, res) => {
  try {
    const { email, password } = req.query;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.send("please enter correct email");
    }
    if (user.password !== password) {
      return res.send("wrong password entered");
    }
    return res.send("valid");
  } catch (err) {
    res.send(err);
  }
});

router.get("/info", async (req, res) => {
  try {
    const socketID = req.query.socketID;
    if (socketID) {
      const log = await LogModel.findOne({ socketID: socketID });
      if (log) {
        const userInfo = await UserModel.findOne({ userName: log.userID });
        return res.json(userInfo);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/chatRequest", async (req, res) => {
  try {
    const { fromUserName, content, endUserName } = req.body;
    const fromUserInfo = await UserModel.findOne({ userName: fromUserName });
    const endUserInfo = await UserModel.findOne({ userName: endUserName });
    if (fromUserInfo && endUserInfo) {
      endUserInfo.notifications.push({
        sender: fromUserInfo._id,
        message: content,
        accpeted: false,
      });
      await endUserInfo.save();
      return res.send("sent");
    } else {
      return res.send(`there is no user with name ${endUserName}`);
    }
  } catch (err) {
    console.log(err);
    return res.send("error while sending");
  }
});

router.post("/createRoom", async (req, res) => {
  const { userName1, userName2 } = req.body;
  console.log(userName1, userName2);
  const user1Details = await UserModel.findOne({ userName: userName1 });
  const user2Details = await UserModel.findOne({ userName: userName2 });
  //console.log(user1Details, user2Details)
  if (user1Details && user2Details) {
    // create a new Chat
    const data = {
      participants: [user1Details.userName, user2Details.userName],
      chats: [],
    };
    const new_chat = ChatModel(data);
    const saved_instance = await new_chat.save();

    // add the current chat to the users database
    user1Details.chats.push({
      chatId: saved_instance._id,
      chatName: user2Details.userName,
    });
    user2Details.chats.push({
      chatId: saved_instance._id,
      chatName: user1Details.userName,
    });
    await user1Details.save();
    await user2Details.save();

    return res.send("room created sucessfully");
  }
});

router.delete("/deleteChatRequest", async (req, res) => {
  const { userId, senderId } = req.body;

  try {
    // Find the user document
    const userDetails = await UserModel.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the notification with the matching senderId
    const notificationIndex = userDetails.notifications.findIndex(
      (notification) => notification.sender === senderId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Remove the notification from the array
    userDetails.notifications.splice(notificationIndex, 1);

    // Save the updated user document
    await userDetails.save();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addMessage", async (req, res) => {
  const { chatId, message, userId } = req.body;
  let chat = await GroupChatModel.findById(chatId);
  if (!chat) {
    chat = await PrivateChatModel.findById(chatId);
  }
  if (chat) {
    chat.messages.push({
      userId: userId,
      message: message,
      time: "10:00:00",
    });
    await chat.save();
    return res.send("added");
  } else {
    res.send("failed to add");
  }
});

router.get("/getProfilePic", async (req, res) => {
  const userName = req.query.userName;
  const userDetails = await UserModel.findOne({ userName: userName });
  if (userDetails) {
    return res.send(userDetails.profilePic);
  }
  return res.send("the user is not defined");
});

router.get("/getProfilePicGroup", async (req, res) => {
  const { name } = req.query;
  if (name) {
    const object = await GroupChatModel.findOne({ name: name });
    if (object) {
      const profilePic = object.profilePic;
      return res.send(profilePic);
    } else {
      return res.send("./profilePic.png");
    }
  } else {
    return res.json({
      profilePic: "/profilePic.png",
    });
  }
});

router.get("/getChatType", async (req, res) => {
  const { id } = req.query;
  if (id) {
    let chat = await PrivateChatModel.findById(id);
    if (!chat) {
      chat = await GroupChatModel.findById(id);
    }
    if (chat) {
      res.json({
        type: chat.type,
      });
    } else {
      res.json({
        type: "not defined",
      });
    }
  } else {
    res.json({
      type: "not defined",
    });
  }
});

router.post("/newPrivateChat", async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const user1 = await UserModel.findById(userId1);
    const user2 = await UserModel.findById(userId2);
    if (user1 && user2) {
      const newPrivateChat = PrivateChatModel({
        type: "private",
        messages: [],
      });
      const newChatInstance = await newPrivateChat.save();
      if (newChatInstance) {
        user1.chats.push({
          chatId: newChatInstance._id,
          chatName: user2.userName,
        });
        user1.save();
        user2.chats.push({
          chatId: newChatInstance._id,
          chatName: user1.userName,
        });
        user2.save();
        return res.send("created");
      } else {
        return res.send("error while creating new chat");
      }
    } else {
      return res.send("the user doesn't exist");
    }
  } catch (e) {
    return res.send(e);
  }
});

router.post("/newGroupChat", async (req, res) => {
  const { name, profilePic, description, participants } = req.body;
  const participantsList = [];
  const participantsIdList = [];
  for (const participant of participants) {
    const user = await UserModel.findOne({ userName: participant });
    if (user) {
      participantsList.push(user);
      participantsIdList.push(user._id);
    }
  }
  if (participantsList.length !== 0) {
    const newGroup = GroupChatModel({
      type: "group",
      name: name,
      profilePic: profilePic,
      participants: participantsIdList,
      description: description,
      messages: [],
    });
    const newGroupInstance = await newGroup.save();
    for (const participant of participantsList) {
      participant.chats.push({
        chatId: newGroupInstance._id,
        chatName: newGroupInstance.name,
      });
      await participant.save();
    }
    return res.send("group created succesfully");
  } else {
    res.send("problem while creating group");
  }
});

router.get("/getChat", async (req, res) => {
  const { chatId } = req.query;
  let chat = await GroupChatModel.findById(chatId);
  if (!chat) {
    chat = await PrivateChatModel.findById(chatId);
  }
  if (chat) {
    res.json(chat);
  } else {
    console.log(chatId);
  }
});

router.get("/getDpAndNamefromId", async (req, res) => {
  const { id } = req.query;
  /* const objectId = ObjectId(id)*/
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    console.log("id->", id);
    const userInfo = await UserModel.findById(id);
    if (userInfo) {
      return res.json({
        dp: userInfo.profilePic,
        userName: userInfo.userName,
      });
    } else {
      return res.json({
        dp: "./profilePic.png",
        userName: "user2",
      });
    }
  } else {
    return res.json({
      dp: "./profilePic.png",
      userName: "user2",
    });
  }
});

router.post("/addMember", async (req, res) => {
  const { id, newParticipantName } = req.body;
  if (id) {
    const chatInstance = await GroupChatModel.findById(id);
    const participantInfo = await UserModel.findOne({
      userName: newParticipantName,
    });
    if (!participantInfo) {
      res.send(`user with name ${newParticipantName} doesn't exist`);
    }
    if (chatInstance && participantInfo) {
      chatInstance.participants.push(participantInfo._id);
      await chatInstance.save();
      return res.send("added");
    } else {
      res.send("error while adding");
    }
  } else {
    res.send("error while adding");
  }
});

router.delete("/deleteParticipant", async (req, res) => {
  const { id, participantName } = req.body;
  if (id) {
  }
});
export default router;
