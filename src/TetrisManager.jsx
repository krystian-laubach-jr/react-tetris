import './styles/App.css';
import { useState, useEffect } from 'react';

import LeftMenu from './LeftMenu';
import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';

function TetrisManager() {
  const [field, setField] = useState([]);

  const generateField = () => {
    let tempRowsArray = [];
    for (let i=0; i < 20; i++) {

      let tempColsArray = [];
      for (let j=0; j < 10; j++) {
        tempColsArray.push(
          {id:`${i}.${j}`, isFilled: false, color:""}
        );
      }

      tempRowsArray.push(tempColsArray);
    }
    
    return tempRowsArray
  }

  const toggleCellState = (idToToggle) => {
    const newField = field.map(row =>
      row.map(cell => {
        if (cell.id === idToToggle) {
          if (cell.isFilled) {
            return { ...cell, isFilled: false }
          } else {
            return { ...cell, isFilled: true }
          }
          
        } else {
          return cell
        }
        }
      )
    );

    setField(newField);
  }

  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple' ];
  const nextColor = colors[Math.floor(Math.random() * (7))]

  const pieces = ['z', 'rz', 'l', 'rl', 't', 'line', 'square'];
  const [nextPiece, setNextPiece] = useState();

  const [stockedPieces, setStockedPieces] = useState([]);

  const getNextStockedPiece = () => {
    let currentStockedPieces = [...stockedPieces];
    let piecesLeft = currentStockedPieces.length;

    if ( piecesLeft === 0) {
      currentStockedPieces = pieces;
    }

    let newNextPieceId = Math.floor(Math.random() * (piecesLeft));
    let newNextPiece = currentStockedPieces[newNextPieceId];
    let newStockedPieces = currentStockedPieces.filter((_, i) => i !== newNextPieceId);

    console.log('Next piece: ' + newNextPiece + ' remaining pieces: ' + newStockedPieces);
    setStockedPieces(newStockedPieces);
    setNextPiece(newNextPiece);
  }



  useEffect(() => {
    setField(generateField());
  }, []); // runs only once on mount


  return (
    <>
      {/* <LeftMenu/> */}
      <TetrisField fieldData={field} onCellClick={toggleCellState}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor} onNextClick={getNextStockedPiece}/>
    </>

  );
}

export default TetrisManager;