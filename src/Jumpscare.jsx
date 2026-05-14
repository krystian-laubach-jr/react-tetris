import { useEffect, useState, useRef } from "react";
import jumpscareGif from "./assets/jumpscare.gif";

const GIF_DURATION = 1100; // give browser some buffer

export default function Jumpscare() {
  const [showGif, setShowGif] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingRef.current) return; // 🚫 prevent overlap

      const roll = Math.floor(Math.random() * 10000);

      if (roll === 0) {
        isPlayingRef.current = true;
        setGifKey(Date.now());
        setShowGif(true);

        setTimeout(() => {
          setShowGif(false);
          isPlayingRef.current = false;
        }, GIF_DURATION);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showGif) return null;

  return (
    <div style={styles.overlay}>
      <img
        key={gifKey}
        src={jumpscareGif}
        alt="jumpscare"
        style={styles.gif}
      />
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
  },
  gif: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};