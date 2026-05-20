import './styles/Leaderboard.css';

function Leaderboard({ onBack }) {
  const raw = JSON.parse(localStorage.getItem('tetris_scores') || '[]');
  const scores = [...raw].sort((a, b) => b.score - a.score);

  const clearScores = () => {
    if (window.confirm('Na pewno wyczyścić wszystkie wyniki?')) {
      localStorage.removeItem('tetris_scores');
      window.location.reload();
    }
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div id="leaderboardPage">
      <h1 id="leaderboardTitle">Tabela Wyników</h1>

      {scores.length === 0 ? (
        <p id="noScores">Brak wyników — zagraj i zapisz swój wynik!</p>
      ) : (
        <table id="leaderboardTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Nick</th>
              <th>Wynik</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, i) => (
              <tr key={i} className={i < 3 ? ['gold', 'silver', 'bronze'][i] : ''}>
                <td>{medals[i] ?? i + 1}</td>
                <td>{entry.nick}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div id="leaderboardActions">
        <button className="lbBtn" onClick={onBack}>← Powrót</button>
        {scores.length > 0 && (
          <button className="lbBtn danger" onClick={clearScores}>Wyczyść</button>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
