import './styles/TetrisNext.css';
import BlockDisplay from './BlockDisplay';

function TetrisNext({nextPiece, nextColor, onNextClick}) {

  return (
    <div className='sideContainer'>
      <div className='border'>
        <div id='tetrisNextContainer'>
          <h1>Next up:</h1>
          <BlockDisplay piece={nextPiece} color={nextColor}/>
          <p>{nextPiece}</p>
          <button onClick={() => onNextClick()}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default TetrisNext;