import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../App.css";

const Fader = ({ children }) => {
  const [fadeProp, setFadeProp] = useState({
    fade: "fade-in",
  });

  useEffect(() => {
    const timeout = setInterval(() => {
      if (fadeProp.fade === "fade-in") {
        setFadeProp({
          fade: "fade-out",
        });
      } else {
        setFadeProp({
          fade: "fade-in",
        });
      }
    }, 600);

    return () => clearInterval(timeout);
  }, [fadeProp]);

  return (
    <>
      <text data-testid="fader" className={fadeProp.fade}>
        {children}
      </text>
    </>
  );
};

export default Fader;
