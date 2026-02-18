// Ai.jsx
import React, { useContext, useState } from 'react';
import ai from "../assets/ai.png";
import open from "../assets/open.mp3";
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Ai() {
  const { showSearch, setShowSearch } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);
  const openingSound = new Audio(open);

  // Speech synthesis
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (!recognition) {
    console.log("Speech recognition not supported");
  } else {
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();

      if (transcript.includes("search") && transcript.includes("open") && !showSearch) {
        speak("opening search");
        setShowSearch(true);
        navigate("/collection");
      } else if (transcript.includes("search") && transcript.includes("close") && showSearch) {
        speak("closing search");
        setShowSearch(false);
      } else if (["collection", "collections", "product", "products"].some(word => transcript.includes(word))) {
        speak("opening collection page");
        navigate("/collection");
      } else if (transcript.includes("about") || transcript.includes("aboutpage")) {
        speak("opening about page");
        navigate("/about");
        setShowSearch(false);
      } else if (transcript.includes("home") || transcript.includes("homepage")) {
        speak("opening home page");
        navigate("/");
        setShowSearch(false);
      } else if (["cart", "kaat", "caat"].some(word => transcript.includes(word))) {
        speak("opening your cart");
        navigate("/cart");
        setShowSearch(false);
      } else if (transcript.includes("contact")) {
        speak("opening contact page");
        navigate("/contact");
        setShowSearch(false);
      } else if (["order", "myorders", "orders", "my order"].some(word => transcript.includes(word))) {
        speak("opening your orders page");
        navigate("/order");
        setShowSearch(false);
      } else {
        toast.error("Try Again");
      }
    };

    recognition.onend = () => {
      setActiveAi(false);
    };
  }

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={() => {
        if (recognition) {
          recognition.start();
          openingSound.play();
          setActiveAi(true);
        }
      }}
    >
      <img
        src={ai}
        alt="AI Assistant"
        className={`w-[100px] cursor-pointer ${
          activeAi
            ? 'translate-x-[10%] translate-y-[-10%] scale-125'
            : 'translate-x-[0] translate-y-[0] scale-100'
        } transition-transform`}
        style={{
          filter: activeAi
            ? "drop-shadow(0px 0px 30px #00d2fc)"
            : "drop-shadow(0px 0px 20px black)",
        }}
      />
    </div>
  );
}

export default Ai;