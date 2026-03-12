import './TetrisNext.css';
function TetrisNext({nextPiece, nextColor, onNextClick}) {

  return (
    <div className='sideContainer'>
      <div className='border'>
        <div id='tetrisNextContainer'>
          <h1>Next up:</h1>

          <div id="nextGrid">

            <div className='nextGridRow'>
              <div className='nextGridCell'>
              </div>

              <div className='nextGridCell'>
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'line') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
              </div>
            </div>

            <div className='nextGridRow'>
              <div className='nextGridCell'>
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'l') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'line' || nextPiece == 'rl') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
              </div>
            </div>

            <div className='nextGridRow'>
              <div className='nextGridCell'>
                {(nextPiece == 'z') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'z' || nextPiece == 'square' || nextPiece == 'l') && <div className={`brick ${nextColor}`}></div>}
              </div>
              
              <div className='nextGridCell'>
                {(nextPiece == 'line' || nextPiece == 'square' || nextPiece == 't' || nextPiece == 'rz' || nextPiece == 'rl') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'rz') && <div className={`brick ${nextColor}`}></div>}
              </div>
            </div>

            <div className='nextGridRow'>
              <div className='nextGridCell'>
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'z' || nextPiece == 'square' || nextPiece == 'l' || nextPiece == 't' || nextPiece == 'rz' || nextPiece == 'rl') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 'line' || nextPiece == 'z' || nextPiece == 'square' || nextPiece == 'l' || nextPiece == 't' || nextPiece == 'rz' || nextPiece == 'rl') && <div className={`brick ${nextColor}`}></div>}
              </div>

              <div className='nextGridCell'>
                {(nextPiece == 't') && <div className={`brick ${nextColor}`}></div>}
              </div>
            </div>

          </div>
          
          <p>{nextPiece}</p>
          <button onClick={() => onNextClick()}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default TetrisNext;