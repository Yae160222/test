import { useEffect, useState, useContext } from "react";
import "../chatPage.css";
import React from "react";
import { userInfoContext } from "../chatPage";
import { useNavigate } from "react-router-dom";

export const Section2 = (props) => {
  return (
    <div className="Section2">
      <TitleBar title="Chats"></TitleBar>
      <div className="Chatslist">
        {props.list.map((chat, index) => (
          <ChatItem
            key={index}
            info={chat}
            updateSelectedChat={props.updateSelectedChat}
          ></ChatItem>
        ))}
      </div>
    </div>
  );
};

export const TitleBar = (props) => {
  return <h2 className="Section2TitleBar">{props.title}</h2>;
};

export const ChatItem = (props) => {
  return (
    <div
      className="ChatItem"
      onClick={() =>
        props.updateSelectedChat(
          props.info.chatId,
          props.info.chatName,
          props.info.profilePic
        )
      }
    >
      <img src={props.info.profilePic}></img>
      <h3>{props.info.chatName}</h3>
    </div>
  );
};

export const ChatRequest = (props) => {
  const [val, setVal] = useState("");

  const sendRequest = async () => {
    const data = {
      fromUserName: props.userInfo.userName,
      content: "I would like to chat with with you",
      endUserName: val,
    };
    const send = await fetch(`http://localhost:3000/chatRequest/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  return (
    <div className="ChatItem">
      <input
        placeholder="enter userName"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      ></input>
      <button onClick={sendRequest}>send request</button>
    </div>
  );
};

export const NewChat = (props) => {
  const [section2State, setSection2State] = useState("");
  return (
    <>
      {section2State === "" && (
        <div className="Section2">
          <TitleBar title="New Chat"></TitleBar>
          <button
            onClick={() => {
              setSection2State("Add Friend");
            }}
          >
            Add Friend
          </button>
          <button
            onClick={() => {
              setSection2State("New Group");
            }}
          >
            New Group
          </button>
        </div>
      )}
      {section2State === "Add Friend" && <NewPrivateChat></NewPrivateChat>}
      {section2State === "New Group" && <NewGroupChat></NewGroupChat>}
    </>
  );
};

const ParticipantItem = (props) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className="ChatItem">
      <h3>{props.userName}</h3>
      <button
        style={{
          width: "30%",
          height: "80%",
          backgroundColor: "var(--md-sys-color-error-container)",
          color: "var(--md-sys-color-on-error-container)",
          boxSizing: "border-box",
          alignSelf: "center",
          marginLeft: "auto",
          justifySelf: "flex-end",
          opacity: isHovering ? "60%" : "30%",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          props.removeParticipant(props.userName);
        }}
      >
        remove
      </button>
    </div>
  );
};
export const NewGroupChat = (props) => {
  const userInfo = useContext(userInfoContext);
  const [groupName, setGroupName] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [description, setDescription] = useState("A group");
  const [participants, setParticipants] = useState([userInfo.userName]);
  const [participant, setParticipant] = useState("");
  function addParticipant() {
    if (participant.trim() !== "") {
      setParticipants((prevList) => [participant, ...prevList]);
    }
    setParticipant("");
  }
  async function createNewGroup() {
    const reqData = {
      name: groupName,
      profilePic: profilePic,
      description: description,
      participants: participants,
    };
    if (reqData) {
      const message = await fetch(`http://localhost:3000/newGroupChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const res = await message.text();
      alert(res);
    }
  }

  function removeParticipant(participantName) {
    setParticipants((list) => {
      const newList = list.filter((participant) => {
        if (participant !== participantName) {
          return participant;
        }
      });
      return newList;
    });
  }
  return (
    <div className="Section2">
      <TitleBar title="New group"></TitleBar>
      <label
        style={{
          alignSelf: "flex-start",
          marginTop: "10%",
          marginLeft: "5%",
          marginBottom: "2%",
          fontSize: "large",
        }}
        htmlFor="groupName"
      >
        {" "}
        group name{" "}
      </label>
      <input
        id="groupName"
        style={{
          width: "90%",
          height: "50px",
        }}
        placeholder="groupName"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></input>
      <label
        style={{
          alignSelf: "flex-start",
          marginTop: "2%",
          marginLeft: "5%",
          marginBottom: "2%",
          fontSize: "large",
        }}
        htmlFor="participants"
      >
        {" "}
        participants{" "}
      </label>
      <div className="ref"> </div>
      <input
        id="participants"
        style={{
          width: "90%",
          height: "50px",
        }}
        placeholder="participants"
        value={participant}
        onChange={(e) => setParticipant(e.target.value)}
      ></input>
      <button
        style={{
          width: "90%",
          height: "50px",
        }}
        onClick={addParticipant}
      >
        add
      </button>
      <label
        style={{
          alignSelf: "flex-start",
          marginTop: "2%",
          marginLeft: "5%",
          marginBottom: "2%",
          fontSize: "large",
        }}
        htmlFor="participantsList"
      >
        {" "}
        participants list{" "}
      </label>
      <div
        id="participantsList"
        className="Chatslist"
        style={{
          height: "30%",
          width: "90%",
          margin: "5px",
          overflowX: "hidden",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          border: "2px solid var(--md-sys-color-outline)",
          borderRadius: "10px",
        }}
      >
        {participants.map((member, index) => (
          <ParticipantItem
            key={index}
            userName={member}
            removeParticipant={removeParticipant}
          />
        ))}
      </div>

      <label
        style={{
          alignSelf: "flex-start",
          marginTop: "2%",
          marginLeft: "5%",
          marginBottom: "2%",
          fontSize: "large",
        }}
        htmlFor="description"
      >
        {" "}
        description{" "}
      </label>
      <input
        id="description"
        style={{
          width: "90%",
          height: "50px",
        }}
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>

      <button
        style={{
          width: "90%",
          height: "50px",
        }}
        onClick={createNewGroup}
      >
        create
      </button>
    </div>
  );
};

export const NewPrivateChat = (props) => {
  const [input, setInput] = useState("");
  const userInfo = useContext(userInfoContext);
  async function sendRequest() {
    const response = await fetch(`http://localhost:3000/chatRequest`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        fromUserName: userInfo.userName,
        message: "has sent a chat request",
        endUserName: input,
      }),
    });
    const res = await response.text();
    alert(res);
  }
  return (
    <div className="Section2">
      <TitleBar title="Chat Request"></TitleBar>
      <label
        style={{
          alignSelf: "flex-start",
          marginTop: "15%",
          marginLeft: "5%",
          marginBottom: "2%",
          fontSize: "large",
        }}
        htmlFor="input"
      >
        {" "}
        username{" "}
      </label>
      <input
        id="input"
        style={{
          width: "90%",
          height: "50px",
        }}
        value={input}
        placeholder="enter username..."
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <button
        style={{
          width: "90%",
          height: "50px",
        }}
        onClick={sendRequest}
      >
        send
      </button>
    </div>
  );
};

export const UserInfo = (props) => {
  return (
    <div className="Section2">
      <TitleBar title="User info"></TitleBar>
      <img className="profilePic" src={props.info.profilePic}></img>
      <h3>{props.info.userName}</h3>
      <h4 className="desc">{props.info.description}</h4>
    </div>
  );
};

/* export const JoinRoom = (props) => {
  return (
    <div className="Section2">
      <input
        placeholder="enter room name"
        value={props.val}
        onChange={props.onChange}
      ></input>
    </div>
  );
}; */

export const Notifications = (props) => {
  const [notifications, setNotifications] = useState(
    props.notifications ? props.notifications : []
  );
  function deleteNotification(notificationToBeDeleted) {
    setNotifications((list) =>
      list.filter((notification) => notification !== notificationToBeDeleted)
    );
  }
  return (
    <div className="Section2">
      <TitleBar title="Notifications"></TitleBar>
      {props.notifications.map((notification, index) => (
        <Notification
          key={index}
          notification={notification}
          userInfo={props.userInfo}
          deleteNotification={deleteNotification}
        />
      ))}
    </div>
  );
};

export const Notification = (props) => {
  const { notification, userInfo } = props;
  const [senderProfilePic, setSenderProfilePic] = useState("./ProfilePic.png");
  const [userName, setUserName] = useState("user");
  const [visibility, setVisibility] = useState(false);

  const createRoom = async () => {
    if (!notification.accepted) {
      const data = {
        userId1: notification.sender,
        userId2: userInfo._id,
      };
      // Create room
      const response = await fetch(`http://localhost:3000/newPrivateChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.text();
      alert(res);

      // deleteChatRequest
      await deleteRequest();
    }
  };

  async function deleteRequest() {
    const response = await fetch(`http://localhost:3000/deleteChatRequest`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userInfo._id,
        senderId: notification.sender,
      }),
    });
    // remove form the notifications
    props.deleteNotification();
  }

  useEffect(() => {
    async function fun() {
      const response = await fetch(
        `http://localhost:3000/getDpAndNamefromId?id=${notification.sender}`
      );
      const res = await response.json();
      if (res) {
        setSenderProfilePic(res.dp);
        setUserName(res.userName);
      }
    }
    fun();
  }, [props.notification]);

  return (
    <div
      className="Notification"
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <img src={senderProfilePic || ""} alt={senderProfilePic} />
        <h3>{userName}</h3>
      </div>
      {/* <h4>{notification.message}</h4> */}
      <h4
        style={{
          marginLeft: "5%",
        }}
      >
        {userName} has sent you a chat request
      </h4>
      {visibility && (
        <div chatName="options">
          <button
            style={{
              backgroundColor: "green",
              height: "40px",
              width: "30%",
            }}
            className="accept"
            onClick={createRoom}
          >
            {" "}
            Accept
          </button>
          <button
            style={{
              backgroundColor: "red",
              height: "40px",
              width: "30%",
            }}
            className="reject"
            onClick={deleteRequest}
          >
            {" "}
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
