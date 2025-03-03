import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("/profilePic.png");
  const [description, setDescription] = useState("Available");
  async function handleClick(event) {
    event.preventDefault();
    console.log(email, userName, password);
    const response = await fetch(`http://localhost:3000/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        userName: userName,
        password: password,
        profilePic: profilePic,
        description: description,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert("something went wrong");
    }
  }
  const navigate = useNavigate();
  const triggerInput = () => {
    document.getElementById("fileInput").click();
  };
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="signUp">
      <form style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
        <h4>email</h4>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <h4>username</h4>
        <input
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        ></input>
        <h4>password</h4>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleClick}> SignUp </button>
        <div
          style={{
            cursor: "default",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          {" "}
          SignIn{" "}
        </div>
      </form>
      <div className="otherDetails">
        <img className="signUpProfilePic" src={profilePic}></img>
        <div className="editIconLabel">
          {" "}
          <h2>Profile Pic</h2>{" "}
          <div className="editIcon" onClick={triggerInput}></div>{" "}
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileInput}
        />
        <h4>Description</h4>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
      </div>
    </div>
  );
};
