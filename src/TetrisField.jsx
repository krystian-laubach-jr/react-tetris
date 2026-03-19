import './styles/TetrisField.css';
import { useEffect } from 'react';
function TetrisField({fieldData, onCellClick}) {

  useEffect(() => {
    const getBrickSize = () => {

      const grid = document.querySelector('#fieldGrid');
      if (!grid) {return}

      const gridWidth = ( grid.offsetWidth) ;

      document.documentElement.style.setProperty('--brick-size', (gridWidth/10) + 'px');
      //(gridWidth/10)
      
    }

    getBrickSize();

     //resizes
    window.addEventListener("resize", getBrickSize);

    //Unmount
   return () => {
    window.removeEventListener("resize", getBrickSize);
  }}, [fieldData]);

  return (

    <div className='border'>

      <div id="fieldGrid">

        {fieldData && fieldData.map((row, rowIndex) => (
          <div className='fieldGridRow' key={rowIndex}>
            {row.map(cell => (
              <div className='fieldGridCell' key={cell.id} onClick={() => onCellClick(cell.id)}>
                <p>{cell.id}</p>
                {cell.isFilled && <div className='brick purple'></div>}
              </div>
            ))}
          </div>
        ))}

      </div>

    </div>

  );
}

export default TetrisField;