import './styles/MainPage.css';
import React, { useState } from "react";
import './styles/App.css';
import TetrisManager from './TetrisManager';

export default function MainPage() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="container">

      {showGame ? (
        // 🎮 tutaj renderujesz grę
        <TetrisManager />
      ) : (
        // 📋 tutaj menu
        <>
          <div className="guzikiborder">
            <div className="button-column">
                <button 
                  className="btn btn1"
                  onClick={() => setShowGame(true)}
                >
                  Graj
                </button>

                <button className="btn btn1">Wyniki</button>
                <button className="btn btn1">Sterowanie</button>
                <a 
                  href="https://github.com/krystian-laubach-jr/react-tetris.git" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  <button className="btn btn1">Credits</button>
                </a>
            </div>
          </div>

        </>
      )} 
    </div>
  );
}