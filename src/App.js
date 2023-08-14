import "./App.css";
import Fader from "./components/Fader";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import useSound from "use-sound";
import SockJsClient from "react-stomp";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
// import { useSpring, animated } from "react-spring";

function App() {
  const topicStyle = {
    color: "white",
    paddingRight: "12%",
    fontFamily: "Arial",
  };

  const topRow = {
    display: "flex",
    justifyContent: "space-between",
  };

  const imageContainerStyles = {
    paddingRight: "0.5%",
    width: "10%",
    display: "flex",
    justifyContent: "end",
  };

  const imageStyles = {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  };

  const bodyStyle = {
    color: "white",
    backgroundColor: "#113d61",
    padding: "5px",
    fontFamily: "Arial",
    height: "110vh",
  };

  const [newData, setNewData] = useState();
  const [message, setMassage] = useState();
  const [googleToken, setGoogleToken] = useState();
  const [userProfile, setUserProfile] = useState();
  const [flip, setFlip] = useState(false);
  const [play] = useSound(require("./media/sounds/Oii.mp3"));
  const [typingUser, setTypingUser] = useState();
  const [counter, setCounter] = useState(0);

  const backendUrl = "https://sen-backend.onrender.com/";
  // const backendUrl = "http://localhost:8080/";

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleToken(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  let onMessageReceived = (msg) => {
    setNewData(msg);
    autoscroll();
  };

  const typingDataReceived = (typingUserv) => {
    setTypingUser(typingUserv);
    console.log(typingUserv);
    setCounter(5);
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

  useEffect(() => {
    if (counter > 0) {
      const interval = setInterval(incrementCounter, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [counter]);

  const incrementCounter = () => {
    setCounter(counter - 1);
  };

  const autoscroll = async (event) => {
    await delay(100);

    var elem = document.getElementById("autoscrollable-div");
    elem.scrollTop = elem.scrollHeight;
    console.log("Playing sound");
    play();
    console.log("Done Playing sound");
  };

  function textareaChange(event) {
    setMassage(event.target.value);
    if (userProfile) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userProfile.email,
      };
      fetch(backendUrl + "websocket/typing", requestOptions).then((response) =>
        console.log(response)
      );
    }
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
      body: JSON.stringify({ userId: 1, message: someText }),
    };
    fetch(backendUrl + "websocket/send", requestOptions).then((response) =>
      console.log(response)
    );
  };

  return (
    <div>
      <SockJsClient
        url={backendUrl + "ws-message"}
        topics={["/topic/message"]}
        onConnect={console.log("message ws connected!!")}
        onDisconnect={console.log("message ws disconnected!")}
        onMessage={(msg) => onMessageReceived(msg)}
        debug={false}
      />
      <SockJsClient
        url={backendUrl + "ws-typing"}
        topics={["/topic/typing"]}
        onConnect={console.log("typing ws connected!!")}
        onDisconnect={console.log("typing ws disconnected!")}
        onMessage={(typingUser) => typingDataReceived(typingUser)}
        debug={false}
      />
      <header style={{ backgroundColor: "DodgerBlue" }}>
        <div style={topRow}>
          <div style={topicStyle}>Silent Eye Nexus (SEN)</div>
          <div style={imageContainerStyles}>
            {userProfile && (
              <img src={userProfile.picture} style={imageStyles} />
            )}
            <dev style={{ paddingLeft: "5%" }}>
              {userProfile ? userProfile.given_name : "No user logged in"}
            </dev>
          </div>
        </div>
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
          {typingUser && counter != 0 ? (
            <div style={{ marginLeft: "10px" }}>
              {" "}
              <Fader>{typingUser.name} is typing ...</Fader>
            </div>
          ) : (
            <div style={{ height: "25px" }}></div>
          )}
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
