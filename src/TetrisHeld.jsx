import './styles/TetrisNext.css';
import BlockDisplay from './BlockDisplay';

function TetrisHeld({heldPiece, heldColor}) {

  return (
    <div className='sideContainer'>

      <div className='border'>
        <div id='tetrisNextContainer'>

          <h1>Held:</h1>
          <BlockDisplay piece={heldPiece} color={heldColor}/>
          
        </div>
      </div>

    </div>
  );
}

export default TetrisHeld;