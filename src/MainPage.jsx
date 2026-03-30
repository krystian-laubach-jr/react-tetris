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
              <div className="border">
                <button 
                  className="btn btn1"
                  onClick={() => setShowGame(true)}
                >
                  Graj
                </button>
              </div>

              <div className="border">
                <button className="btn btn1">Wyniki</button>
              </div>
              <div className="border">
                <button className="btn btn1">Styl</button>
              </div>
             <div className="border">
                <a 
                  href="https://github.com/krystian-laubach-jr/react-tetris.git" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  <button className="btn btn1">Credits</button>
                </a>
              </div>
            </div>
          </div>

          <div className="tabliczka">
            <div className="border">
              <div className="side-panel">
                <h2>Panel</h2>
                <p>Lorem ipsum dolor sit amet...</p>
                <p>Ut enim ad minim veniam...</p>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}