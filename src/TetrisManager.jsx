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

  const fallPiece = (isDrop) => {
    let newCells = []

    const isAtBottom = (cellArray) => {
      return cellArray.some(id => {
        const cell = field.flat().find(c => c.id === id);
        if (!cell) return true; // treat as bottom
        return cell.rowId >= 19;
      });
    };

    const isPieceUnder = (cellArray) => {
      return cellArray.some(id => {
        const cell = field.flat().find(c => c.id === id);
        if (!cell) return false; // ✅ prevent crash

        const cellBelow = field[cell.rowId + 1]?.[cell.colId];

        return (
          cellBelow &&
          cellBelow.isFilled &&
          !cellArray.includes(cellBelow.id)
        );
      });
    };

    if (isAtBottom(currentPieceCells) || isPieceUnder(currentPieceCells)) {
      return
    }

    if (isDrop) {
      newCells = currentPieceCells; // start from current position

      while (true) {
        // stop if current position can't move further
        if (isAtBottom(newCells) || isPieceUnder(newCells)) {
          break;
        }

        // otherwise move down
        newCells = newCells.map(id => {
          const cell = field.flat().find(c => c.id === id);
          if (!cell) return null;

          return `${cell.rowId + 1}.${cell.colId}`;
        });
      }
    }
    else {
      newCells = currentPieceCells.map(id => {
        const cell = field.flat().find(c => c.id === id);
        return `${cell.rowId + 1}.${cell.colId}`;
      });
    }

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

  const movePiece = (isToLeft) => {

  const isAtLeftSide = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    return cell.colId === 0;
  });

  const isAtRightSide = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    return cell.colId === 9;
  });

  const isPieceToLeft = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    const cellLeft = field[cell.rowId]?.[cell.colId - 1];

    return (
      cellLeft &&
      cellLeft.isFilled &&
      !currentPieceCells.includes(cellLeft.id)
    );
  });

  const isPieceToRight = currentPieceCells.some(id => {
    const cell = field.flat().find(c => c.id === id);
    const cellRight = field[cell.rowId]?.[cell.colId + 1];

    return (
      cellRight &&
      cellRight.isFilled &&
      !currentPieceCells.includes(cellRight.id)
    );
  });

  let newCells = [];

  if (isToLeft && !isAtLeftSide && !isPieceToLeft) {
    newCells = currentPieceCells.map(id => {
      const cell = field.flat().find(c => c.id === id);
      return `${cell.rowId}.${cell.colId - 1}`;
    });
  } 
  else if (!isToLeft && !isAtRightSide && !isPieceToRight) {
    newCells = currentPieceCells.map(id => {
      const cell = field.flat().find(c => c.id === id);
      return `${cell.rowId}.${cell.colId + 1}`;
    });
  } 
  else {
    return;
  }

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

  useEffect(() => {
  const handleKeyDown = (event) => {
    console.log(`Key pressed: ${event.key}`);

    if (event.key === 'ArrowLeft') {
      movePiece(true); // Move left
    } else if (event.key === 'ArrowRight') {
      movePiece(false); // Move right
    } else if (event.key === 'ArrowDown') {
      fallPiece(); // Fall piece
    } else if (event.key === ' ') {
      fallPiece(true); // Drop piece
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [fallPiece, movePiece]);

  return (
    <>
      <div>
        <div>
          <button onClick={() => spawnPiece(nextPiece)}>spawn piece</button>
          <button onClick={() => fallPiece()}>fall piece</button>
        </div>

        <div>
          <button onClick={() => movePiece(true)}>left</button>
          <button onClick={() => movePiece(false)}>right</button>
        </div>

        <div>
          <button onClick={() => fallPiece(true)}>drop</button>
        </div>
      </div>

      {/* <LeftMenu/> */}
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor} onNextClick={getNextStockedPiece}/>
    </>

  );
}

export default TetrisManager;

//todo:
//left menu
//usuwanie linii
//rotate
//hold
//ghost piece