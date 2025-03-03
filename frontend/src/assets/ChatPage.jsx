import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { socket } from "../Constants.jsx";
import "../chatPage.css";
import { userInfoContext } from "../chatPage.jsx";
import React from "react";

export const ChatPage = (props) => {
  const navigate = useNavigate();
  const [messageList, setMessageList] = useState([]);
  const [input, setInput] = useState("");
  const userInfo = useContext(userInfoContext); // Use context directly

  const handleSendMessage = async () => {
    console.log(`this is userInfo: `, userInfo);
    console.log(`this is input: `, input);
    if (input.trim() !== "") {
      console.log(`this is input: `, input);
      const new_message = {
        chatId: props.chatId,
        userId: userInfo._id,
        message: input,
      };
      setMessageList((prevList) => [...prevList, new_message]);
      const resp = await fetch(`http://localhost:3000/addMessage`, {
        method: "POST", // Correct key
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_message),
      });
      console.log(resp, `is the resopnse`);
      if (socket) {
        socket.emit("chat message", props.chatId, input);
      }
      setInput("");
    }
  };
  useEffect(() => {
    setMessageList([]);
    async function getChathistory() {
      if (props.chatId) {
        const res = await fetch(
          `http://localhost:3000/getChat?chatId=${props.chatId}`
        );
        const chat = await res.json();
        setMessageList(chat.messages);
      } else {
        setMessageList([]);
      }
    }
    getChathistory();
  }, [props.chatId]);
  useEffect(() => {
    if (socket) {
      socket.on("chat message", (json) => {
        console.log("message received-> ", json);
        setMessageList((prevList) => [...prevList, json]);
      });
      return () => {
        socket.off("chat message");
      };
    } else {
      navigate("/");
    }
  }, [socket]);

  useEffect(() => {
    socket.emit("joinroom", props.chatId);
    return () => {
      socket.emit("leaveroom", props.chatId);
    };
  }, [props.chatId]);

  const updateInput = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="ChatPage">
      <ChatTitleBar
        profilePic={props.chatDp}
        chatTitle={props.chatName}
      ></ChatTitleBar>
      <MessageWindow list={messageList} userInfo={userInfo} />
      <Input
        input={input}
        handleSendMessage={handleSendMessage}
        updateInput={updateInput}
      />
    </div>
  );
};

export const MessageWindow = (props) => {
  return (
    <div className="MessageWindow">
      {props.list.map((message, index) => (
        <Message key={index} message={message} userInfo={props.userInfo} />
      ))}
    </div>
  );
};

export const Message = (props) => {
  const userInfo = useContext(userInfoContext);
  const [participantInfo, setParticipantInfo] = useState("./profilePic.png");
  const userIdToDpMap = useRef(new Map());

  async function getParticipantsInfo(id) {
    if (userIdToDpMap.current.has(id)) {
      return userIdToDpMap.current.get(id);
    }
    const response = await fetch(
      `http://localhost:3000/getDpAndNamefromId?id=${id}`
    );
    const participantsInfo = await response.json();
    userIdToDpMap.current.set(id, participantsInfo);
    return participantsInfo;
  }

  useEffect(() => {
    if (props.message.userId !== userInfo._id) {
      getParticipantsInfo(props.message.userId).then((fetchedDp) => {
        setParticipantInfo(fetchedDp);
      });
    }
  }, []);

  if (props.message.userId === userInfo._id) {
    return (
      <div className="User">
        <div className="UserM">{props.message.message}</div>
        <img src={userInfo.profilePic} alt="User profile" />
      </div>
    );
  }

  return (
    <div className="Other">
      <img src={participantInfo.dp} alt="Other user profile" />
      <div className="OtherM">
        <div className="userName">{participantInfo.userName}</div>
        {props.message.message}
      </div>
    </div>
  );
};

export const Input = (props) => {
  return (
    <div className="Input">
      <input
        className="input"
        value={props.input}
        onChange={props.updateInput}
      />
      <button className="button" onClick={props.handleSendMessage}>
        send
      </button>
    </div>
  );
};

export const ChatTitleBar = (props) => {
  return (
    <div className="ChatTitleBar">
      <img src={props.profilePic} className="groupProfilePic"></img>
      <h2>{props.chatTitle}</h2>
    </div>
  );
};
