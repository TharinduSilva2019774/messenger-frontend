import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [newData, setNewData] = useState();

  const [message, setMassage] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://messenger-backend-production.up.railway.app/getAll", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setNewData(data);
        });
      console.log(process.env);
    }, 2000);
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
    backgroundColor: "#113d61",
    padding: "5px",
    fontFamily: "Arial",
    height: "100vh",
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
      fetch(
        "https://messenger-backend-production.up.railway.app/send",
        requestOptions
      ).then((response) => console.log(response));

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
            style={{
              width: "40%",
              margin: "30px",
              marginLeft: "-0px",
              outline: "none",
              resize: "none",
              color: "#b1aca5",
              backgroundColor: "#181a1b",
            }}
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
        <input
          type="text"
          onChange={userIdChange}
          placeholder="Plz put your ID"
          style={{
            color: "#b1aca5",
            backgroundColor: "#181a1b",
          }}
        />
      </body>
    </div>
  );
}

export default App;
