import './styles/App.css';
import { useState } from 'react';
import TetrisManager from './TetrisManager.jsx';
import Jumpscare from './Jumpscare.jsx';
import Leaderboard from './Leaderboard.jsx';

function App() {
  const [page, setPage] = useState('menu');

  if (page === 'game') {
    return (
      <main>
        <TetrisManager onGoToLeaderboard={() => setPage('leaderboard')} />
        <Jumpscare />
      </main>
    );
  }

  if (page === 'leaderboard') {
    return (
      <main>
        <Leaderboard onBack={() => setPage('menu')} />
      </main>
    );
  }

  return (
    <main id="menuMain">
      <h1 id="menuTitle">TETRIS</h1>
      <div id="menuButtons">
        <button className="menuBtn" onClick={() => setPage('game')}>Graj</button>
        <button className="menuBtn secondary" onClick={() => setPage('leaderboard')}>Wyniki</button>
      </div>
    </main>
  );
}

export default App;
