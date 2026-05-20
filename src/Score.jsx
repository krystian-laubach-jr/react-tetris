import './styles/TetrisNext.css';

function Score({score, level}) {

  return (
    <div className='sideContainer' style={{height: 'auto'}}>

      <div className='border'>
        <div id='tetrisNextContainer'>

          <h1>Score:</h1>
          <p>{score}</p>
          <br/>
          <h1>Level:</h1>
          <p>{level}</p>
          
        </div>
      </div>

    </div>
  );
}

export default Score;