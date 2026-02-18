// Background.jsx
import React from 'react';
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import back3 from "../assets/back3.jpg";
import back4 from "../assets/back4.jpg";

function Background({ heroCount }) {
 
  const backgrounds = [back2, back1, back3, back4];

  
  const selectedBackground = backgrounds[heroCount] || back2;

  return (
    <img
      src={selectedBackground}
      alt="Background"
      className="w-[100%] h-[100%] float-left overflow-auto object-cover"
    />
  );
}

export default Background;