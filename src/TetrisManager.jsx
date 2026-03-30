import './styles/App.css';
import { useState, useEffect, use } from 'react';

import LeftMenu from './LeftMenu';
import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';

function TetrisManager() {
  //field
  const [field, setField] = useState([]);

  const generateField = () => {
    let tempRowsArray = [];
    
    for (let i=0; i < 20; i++) {

      let tempColsArray = [];
      for (let j=0; j < 10; j++) {
        tempColsArray.push(
          {rowId:i, colId:j, id:`${i}.${j}`, isFilled: false, color:""}
        );
      }

      tempRowsArray.push(tempColsArray);
    }
    console.log(tempRowsArray)
    return tempRowsArray
  }

  useEffect(() => {
    setField(generateField());
    getNextStockedPiece();
  }, []); //on mount

  //pieces
  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple' ];
  const [nextColor, setNextColor] = useState();

  const pieces = ['z', 'rz', 'l', 'rl', 't', 'line', 'square'];
  const pieceStartingCells = [
    { name: 'z', coords: ['0.4', '0.5', '1.5', '1.6'] },
    { name: 'rz', coords: ['0.4', '0.5', '1.3', '1.4'] },
    { name: 'l', coords: ['0.4', '1.4', '2.4', '2.5'] },
    { name: 'rl', coords: ['0.5', '1.5', '2.4', '2.5'] },
    { name: 't', coords: ['0.4', '1.3', '1.4', '1.5'] },
    { name: 'line', coords: ['0.4', '1.4', '2.4', '3.4'] },
    { name: 'square', coords: ['0.4', '0.5', '1.4', '1.5'] }
  ];
  const [stockedPieces, setStockedPieces] = useState([]);
  const [nextPiece, setNextPiece] = useState();

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
    setNextColor(colors[Math.floor(Math.random() * (7))])
  }

  const [currentPieceCells, setCurrentPieceCells] = useState([]);
  const [currentPieceColor, setCurrentPieceColor] = useState("")

  const spawnPiece = (piece) => {
    const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;

    const newField = field.map(row =>
      row.map(cell =>
      cellsToFill.includes(cell.id)
        ? { ...cell, isFilled: true, color: nextColor }
        : cell
      )
    );

    setField(newField);
    setCurrentPieceCells(cellsToFill);
    setCurrentPieceColor(nextColor);
    getNextStockedPiece();
  }

  const fallPiece = () => {

  const isAtBottom = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    return cell.rowId === 19;
  });

  const isPieceUnder = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    const cellBelow = field[cell.rowId + 1]?.[cell.colId];

    return (
      cellBelow &&
      cellBelow.isFilled &&
      !currentPieceCells.includes(cellBelow.id)
    );
  });

  if (isAtBottom || isPieceUnder) {
    spawnPiece(nextPiece);
    return
  }

  const newCells = currentPieceCells.map(id => {
    const cell = field.flat().find(c => c.id === id);
    return `${cell.rowId + 1}.${cell.colId}`;
  });

  const newField = field.map(row =>
    row.map(cell => {
      
      if (newCells.includes(cell.id)) {
        return { ...cell, isFilled: true, color: currentPieceColor };
      }

      if (currentPieceCells.includes(cell.id)) {
        return { ...cell, isFilled: false, color: "" };
      }

      return cell;
    })
  );

  setField(newField);
  setCurrentPieceCells(newCells);
};

  return (
    <>
      <button onClick={() => spawnPiece(nextPiece)}>spawn piece</button>
      <button onClick={() => fallPiece()}>fall piece</button>
      {/* <LeftMenu/> */}
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor} onNextClick={getNextStockedPiece}/>
    </>

  );
}

export default TetrisManager;