import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 30) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    setDisplayedText(""); // Reset text when a new answer arrives
    const words = text.split(" ");
    let i = 0;

    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayedText((prev) => prev + (i === 0 ? "" : " ") + words[i]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayedText;
};