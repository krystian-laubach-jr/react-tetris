import './styles/BlockDisplay.css';
function BlockDisplay({piece, color}) {

  return (
    <div id="blockDisplayGrid">

      <div className='blockDisplayGridRow'>
        <div className='blockDisplayGridCell'>
        </div>

        <div className='blockDisplayGridCell'>
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'line') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
        </div>
      </div>

      <div className='blockDisplayGridRow'>
        <div className='blockDisplayGridCell'>
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'l') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'line' || piece === 'rl') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
        </div>
      </div>

      <div className='blockDisplayGridRow'>
        <div className='blockDisplayGridCell'>
          {(piece === 'z') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'z' || piece === 'square' || piece === 'l') && <div className={`brick ${color}`}></div>}
        </div>
        
        <div className='blockDisplayGridCell'>
          {(piece === 'line' || piece === 'square' || piece === 't' || piece === 'rz' || piece === 'rl') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'rz') && <div className={`brick ${color}`}></div>}
        </div>
      </div>

      <div className='blockDisplayGridRow'>
        <div className='blockDisplayGridCell'>
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'z' || piece === 'square' || piece === 'l' || piece === 't' || piece === 'rz' || piece === 'rl') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 'line' || piece === 'z' || piece === 'square' || piece === 'l' || piece === 't' || piece === 'rz' || piece === 'rl') && <div className={`brick ${color}`}></div>}
        </div>

        <div className='blockDisplayGridCell'>
          {(piece === 't') && <div className={`brick ${color}`}></div>}
        </div>
      </div>

    </div>
  );
}

export default BlockDisplay;