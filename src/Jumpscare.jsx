import { useEffect, useState } from "react";
import jumpscareGif from "./assets/jumpscare.gif"; // adjust path if needed

export default function Jumpscare() {
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const roll = Math.floor(Math.random() * 5);

      if (roll === 0) {
        setShowGif(true);

        setTimeout(() => {
          setShowGif(false);
        }, 840); // match your GIF duration (0.84s)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showGif) return null;

  return (
    <div style={styles.overlay}>
      <img src={jumpscareGif} alt="jumpscare" style={styles.gif} />
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  gif: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
};