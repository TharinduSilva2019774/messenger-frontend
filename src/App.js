import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Sender from "./components/sender.tsx";

function App() {
  const [newData, setNewData] = useState();

  const [message, setMassage] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8080/getAll", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setNewData(data);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const topicStyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10hv",
    fontFamily: "Arial",
  };
  const bodyStyle = {
    color: "white",
    backgroundColor: "#154c79",
    padding: "5px",
    fontFamily: "Arial",
    height: "90vh",
  };
  function textareaChange(event) {
    setMassage(event.target.value);
  }

  function userIdChange(event) {
    setUserId(event.target.value);
  }

  function sending() {
    console.log(message);
    console.log(userId);
    if (message != "") {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, message: message }),
      };
      fetch("http://localhost:8080/send", requestOptions).then((response) =>
        console.log(response)
      );

      setMassage("");
    }
  }

  return (
    <div>
      <header style={topicStyle} className>
        Silent Eye Nexus (SEN)
      </header>
      <body style={bodyStyle}>
        <div className="scrollable-div">
          {newData?.map((message) => (
            <div>
              {message.user.name} :: {message.messageBody}{" "}
            </div>
          ))}
        </div>
        <div>
          <textarea
            placeholder="Enter your message"
            value={message}
            onChange={textareaChange}
          />
          <button onClick={sending}> Send </button>
        </div>
        <input
          type="text"
          onChange={userIdChange}
          placeholder="Plz put your ID"
        />
      </body>
    </div>
  );
}

export default App;
