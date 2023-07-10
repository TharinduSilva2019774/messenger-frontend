import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import useSound from "use-sound";
import SockJsClient from "react-stomp";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const [newData, setNewData] = useState();
  const [message, setMassage] = useState();
  const [userId, setUserId] = useState();
  const [googleToken, setGoogleToken] = useState();
  const [userProfile, setUserProfile] = useState();
  const [play] = useSound(require("./media/sounds/Oii.mp3"));
  const SOCKET_URL = "https://sen-backend.onrender.com/ws-message";
  const backendUrl = "https://sen-backend.onrender.com/";

  // const SOCKET_URL = "http://localhost:8080/ws-message";
  // const backendUrl = "http://localhost:8080/";

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleToken(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  let onConnected = () => {
    console.log("Connected!!");
  };
  let onMessageReceived = (msg) => {
    setNewData(msg);
    autoscroll();
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetch(backendUrl + "getAll", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== count) {
          autoscroll();
        }
        count = data.length;
        setNewData(data);
        // console.log(data);
      });

    let count = 0;
    const interval = setInterval(() => {
      fetch(backendUrl + "getAll", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length !== count) {
            autoscroll();
          }
          count = data.length;
          setNewData(data);
          // console.log(data);
        });
    }, 500000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (googleToken) {
      console.log(googleToken);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleToken.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setUserProfile(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [googleToken]);

  const autoscroll = async (event) => {
    await delay(100);

    var elem = document.getElementById("autoscrollable-div");
    elem.scrollTop = elem.scrollHeight;
    console.log("Playing sound");
    play();
    console.log("Done Playing sound");
  };

  const topicStyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10hv",
    fontFamily: "Arial",
  };
  const bodyStyle = {
    color: "white",
    backgroundColor: "#113d61",
    padding: "5px",
    fontFamily: "Arial",
    height: "110vh",
  };
  function textareaChange(event) {
    setMassage(event.target.value);
  }

  function userIdChange(event) {
    setUserId(event.target.value);
  }

  function handleEnterKeyDown(event) {
    if (event.key === "Enter") {
      sending();
    }
  }

  const sending = async (event) => {
    const someText = message.replace(/(\r\n|\n|\r)/gm, "");
    if (someText) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userProfile.email, message: someText }),
      };
      fetch(backendUrl + "send", requestOptions).then((response) =>
        console.log(response)
      );

      setMassage("");
    }
    await delay(1000);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, message: someText }),
    };
    fetch(backendUrl + "websocket/send", requestOptions).then((response) =>
      console.log(response)
    );
  };

  return (
    <div>
      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/message"]}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={(msg) => onMessageReceived(msg)}
        debug={false}
      />
      <header style={topicStyle} className>
        Silent Eye Nexus (SEN)
      </header>
      <body style={bodyStyle}>
        <div className="scrollable-div" id="autoscrollable-div">
          {newData?.map((message) => (
            <div style={{ color: message.user.color }}>
              {new Date(message.time).toLocaleString()} :: {message.user.name}{" "}
              :: {message.messageBody}{" "}
            </div>
          ))}
        </div>
        <div>
          {userProfile ? "Name : " + userProfile.name : "No user logged in"}
        </div>
        <div>
          <textarea
            placeholder="Enter your message"
            value={message}
            onChange={textareaChange}
            style={{
              width: "40%",
              margin: "30px",
              marginLeft: "-0px",
              outline: "none",
              resize: "none",
              color: "#b1aca5",
              backgroundColor: "#181a1b",
            }}
            onKeyDown={handleEnterKeyDown}
          />
          <button
            onClick={sending}
            style={{
              color: "#65625e",
              backgroundColor: "#181a1b",
            }}
          >
            {" "}
            Send{" "}
          </button>
        </div>
        <button
          onClick={() => login()}
          style={{
            color: "#b1aca5",
            backgroundColor: "#181a1b",
          }}
        >
          Sign in with Google 🚀{" "}
        </button>
      </body>
    </div>
  );
}

export default App;
