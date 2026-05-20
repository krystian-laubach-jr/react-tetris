import './styles/TetrisNext.css';

function Score({score}) {

  return (
    <div className='sideContainer' style={{height: 'auto'}}>

      <div className='border'>
        <div id='tetrisNextContainer'>

          <h1>Score:</h1>
          <p>{score}</p>
          
        </div>
      </div>

    </div>
  );
}

export default Score;