import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import "./chatPage.css";
import "./material-theme/css/dark.css";
import { socket } from "./Constants.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { VerticalNavBar } from "./assets/VerticalnavBar.jsx";
import {
  Section2,
  UserInfo,
  Notifications,
  NewChat,
} from "./assets/Section-2.jsx";
import { ChatPage } from "./assets/ChatPage.jsx";

const loading = "loading...";
const loadingState = {
  email: loading,
  userName: loading,
  password: loading,
  profilePic: loading,
  description: loading,
  chats: [],
  notifications: [loading],
};

export const userInfoContext = createContext();

export const MainPage = () => {
  const [userInfo, setUserInfo] = useState(loadingState);
  const [room, setRoom] = useState("all");
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);
  const [chatsList, setChatsList] = useState(userInfo.chats);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatName, setSelectedChatName] = useState(null);
  const [section2State, setSection2State] = useState(0);
  const [selectedChatDp, setSelectedChatDp] = useState("./profilePic.png");
  const onChange = (e) => setRoom(e.target.value);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!socket.connected) {
        await new Promise((resolve) => {
          socket.on("connect", resolve);
        });
      }
      if (socket && socket.connected) {
        console.log("socket ID", socket.id);
        const response = await fetch(
          `http://localhost:3000/info?socketID=${socket.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const info = await response.json(); // assuming the server responds with JSON
        setUserInfo(info);
        setIsUserInfoLoaded(true);
        console.log(`set UserInfo`, userInfo);
      } // or handle the case where the socket is not connected
      else {
        console.log(`user info not updated`);
      }
    };
    getUserInfo();
    setChatsList(userInfo.chats);
  }, [isUserInfoLoaded]);

  useEffect(() => {
    if (isUserInfoLoaded) {
      const fetchChats = async () => {
        const updatedChats = await Promise.all(
          userInfo.chats.map(async (chat) => {
            const res = await fetch(
              `http://localhost:3000/getChatType?id=${chat.chatId}`
            );
            let type = await res.json();
            type = type.type;

            let profilePic = "./profilePic.png"; // Default profile pic
            if (type === "group") {
              const groupPicRes = await fetch(
                `http://localhost:3000/getProfilePicGroup?name=${chat.chatName}`
              );
              profilePic = await groupPicRes.text();
            } else if (type === "private") {
              const privatePicRes = await fetch(
                `http://localhost:3000/getProfilePic?userName=${chat.chatName}`
              );
              profilePic = await privatePicRes.text();
            }
            /* socket.emit("joinroom", chat.chatId); */
            return { ...chat, profilePic };
          })
        );

        setChatsList(updatedChats);
      };

      fetchChats();
      /* return () => {
        chatsList.map((chat, index) => {
          socket.emit("leaveroom", chat.chatId);
        });
      }; */
    }
  }, [isUserInfoLoaded, userInfo.chats]);

  function changeClick(state) {
    if (state === "chats") {
      setSection2State(0);
    } else if (state === "profile") {
      setSection2State(1);
    } else if (state === "notifications") {
      setSection2State(2);
    } else if (state === "newChat") {
      setSection2State(3);
    }
  }

  function updateSelectedChat(chatId, chatName, profilePic) {
    setSelectedChatId(chatId);
    setSelectedChatName(chatName);
    setSelectedChatDp(profilePic);
  }

  return (
    <div className="MainPage">
      <userInfoContext.Provider value={userInfo}>
        <VerticalNavBar handleClick={changeClick} />
        {section2State === 0 && (
          <Section2 list={chatsList} updateSelectedChat={updateSelectedChat} />
        )}
        {section2State === 1 && <UserInfo info={userInfo} />}
        {section2State === 2 && (
          <Notifications
            notifications={userInfo.notifications}
            userInfo={userInfo}
          />
        )}
        {section2State === 3 && <NewChat></NewChat>}
        <ChatPage
          room={room}
          chatId={selectedChatId}
          chatName={selectedChatName}
          chatDp={selectedChatDp}
        />
      </userInfoContext.Provider>
    </div>
  );
};
