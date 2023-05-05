import React, { Component } from "react";

class Sender extends Component {
  state = {
    massage: "1",
  };

  render() {
    return (
      <div>
        <textarea placeholder="Enter your message" onChange={this.sending} />
        <button onClick={this.sending}> Send </button>
      </div>
    );
  }
  sending(event) {
    console.log(event);
  }
}

export default Sender;
