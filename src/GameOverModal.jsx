import { useState } from 'react';
import './styles/GameOverModal.css';

function GameOverModal({ score, onPlayAgain, onGoToLeaderboard }) {
  const [nick, setNick] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!nick.trim()) return;
    const scores = JSON.parse(localStorage.getItem('tetris_scores') || '[]');
    scores.push({ nick: nick.trim(), score });
    localStorage.setItem('tetris_scores', JSON.stringify(scores));
    setSaved(true);
  };

  return (
    <div id="gameOverOverlay">
      <div id="gameOverModal">
        <h1>Game Over!</h1>
        <p className="finalScore">Wynik: <span>{score}</span></p>

        {!saved ? (
          <div className="saveRow">
            <input
              type="text"
              placeholder="Podaj nick..."
              value={nick}
              onChange={e => setNick(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              maxLength={20}
            />
            <button className="modalBtn" onClick={handleSave}>Zapisz</button>
          </div>
        ) : (
          <p className="savedMsg">✓ Zapisano!</p>
        )}

        <div className="modalBtns">
          <button className="modalBtn" onClick={onPlayAgain}>Zagraj ponownie</button>
          <button className="modalBtn accent" onClick={onGoToLeaderboard}>Wyniki</button>
        </div>
      </div>
    </div>
  );
}

export default GameOverModal;
