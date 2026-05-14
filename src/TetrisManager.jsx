import './styles/App.css';
import { useState, useEffect, use } from 'react';
import './styles/App.css';
import { useState, useEffect } from 'react';

import LeftMenu from './LeftMenu';
import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';
import TetrisHeld from './TetrisHeld';

function TetrisManager() {
  //field
  const [field, setField] = useState([]);
  const [nextPiece, setNextPiece] = useState(null);
  const [stockedPieces, setStockedPieces] = useState([]);

  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];

  const pieces = ['z', 'rz', 'l', 'rl', 't', 'line', 'square'];

  const generateField = () => {
    let tempRowsArray = [];
    
    for (let i=0; i < 20; i++) {

    for (let i = 0; i < 20; i++) {
      let tempColsArray = [];
      for (let j=0; j < 10; j++) {
        tempColsArray.push(
          {rowId:i, colId:j, id:`${i}.${j}`, isFilled: false, color:""}
        );

      for (let j = 0; j < 10; j++) {
        tempColsArray.push({
          id: `${i}.${j}`,
          isFilled: false,
          color: ""
        });
      }

      tempRowsArray.push(tempColsArray);
    }
    console.log(tempRowsArray)
    return tempRowsArray
  }

    return tempRowsArray;
  };

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
  const toggleCellState = (idToToggle) => {
    const newField = field.map(row =>
      row.map(cell => {
        if (cell.id === idToToggle) {
          return { ...cell, isFilled: !cell.isFilled };
        }
        return cell;
      })
    );

    setField(newField);
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getNextStockedPiece = () => {
    let currentStock = [...stockedPieces];

    if (currentStock.length === 0) {
      currentStock = [...pieces];
    }

    const randomIndex = Math.floor(Math.random() * currentStock.length);
    const newPiece = currentStock[randomIndex];

    const newStock = currentStock.filter((_, i) => i !== randomIndex);

    console.log('Next piece: ' + newNextPiece + ' remaining pieces: ' + newStockedPieces);
    setStockedPieces(newStockedPieces);
    setNextPiece(newNextPiece);
    setNextColor(colors[Math.floor(Math.random() * (7))])
  }

  const [currentPiece, setCurrentPiece] = useState();
  const [currentPieceCells, setCurrentPieceCells] = useState([]);
  const [currentPieceColor, setCurrentPieceColor] = useState("")

  const [canHoldPiece, setCanHoldPiece] = useState(true)
  const [isPieceHeld, setIsPieceHeld] = useState(false);
  const [heldPiece, setHeldPiece] = useState([]);
  const [heldPieceColor, setHeldPieceColor] = useState("")

  const spawnPiece = (piece, color) => {
    setField((oldField) => {
      const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;
      const newField = oldField.map(row =>
        row.map(cell =>
        cellsToFill.includes(cell.id)
          ? { ...cell, isFilled: true, color: color }
          : cell
        )
      );
      setCurrentPieceCells(cellsToFill);
      return newField;
    });

    setCurrentPiece(piece)
    setCurrentPieceColor(color);
  }

  const spawnNextPiece = () => {
    spawnPiece(nextPiece, nextColor)
    getNextStockedPiece()
    setCanHoldPiece(true)
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
      spawnNextPiece();
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

    setField(field => {
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

      return newField;
    });
    
    setCurrentPieceCells(newCells);
    if(isDrop) spawnNextPiece();
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

    setField(field => {
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
      return newField;
    });
    
    setCurrentPieceCells(newCells);
  };

  const holdPiece = () => {
    if(!canHoldPiece){ return }

    setHeldPiece(currentPiece)
    setHeldPieceColor(currentPieceColor)

    setField(field => {
      const newField = field.map(row =>
        row.map(cell => {
          if (currentPieceCells.includes(cell.id)) {
            return { ...cell, isFilled: false, color: "" };
          }
          return cell;
        })
      );

      return newField;
    });
    
    if( !isPieceHeld) {
      spawnPiece(nextPiece, nextColor)
      setIsPieceHeld(true)
    }

    if (isPieceHeld) {
      spawnPiece(heldPiece, heldPieceColor)
    }
    setCanHoldPiece(false)
  }

  const clear = () => {
    setField(oldField => {
        // keep rows that are NOT full
        let remainingRows = oldField.filter(row =>
          row.some(cell => !cell.isFilled)
        );

        // how many rows were removed
        const clearedLines = 20 - remainingRows.length;

        // create new empty rows at the top
        const newRows = [];

        for (let i = 0; i < clearedLines; i++) {
          let newRow = [];

          for (let j = 0; j < 10; j++) {
            newRow.push({
              rowId: i,
              colId: j,
              id: `${i}.${j}`,
              isFilled: false,
              color: ""
            });
          }

          newRows.push(newRow);
        }

        // combine new rows + remaining rows
        const rebuiltField = [...newRows, ...remainingRows];

        // rebuild ALL ids/rowIds so coordinates stay correct
        const correctedField = rebuiltField.map((row, rowIndex) =>
          row.map((cell, colIndex) => ({
            ...cell,
            rowId: rowIndex,
            colId: colIndex,
            id: `${rowIndex}.${colIndex}`
          }))
        );

        return correctedField;
    });
  }
    console.log('Next piece:', newPiece, 'remaining:', newStock);

    setStockedPieces(newStock);
    setNextPiece({
      type: newPiece,
      color: getRandomColor()
    });
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
    }  else if (event.key === 'c') {
      holdPiece(); // Hold piece
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [fallPiece, movePiece, holdPiece]);

  return (
    <>
      <div>
        <div>
          <button onClick={() => spawnNextPiece()}>spawn piece</button>
          <button onClick={() => fallPiece()}>fall piece</button>
        </div>

        <div>
          <button onClick={() => movePiece(true)}>left</button>
          <button onClick={() => movePiece(false)}>right</button>
        </div>

        <div>
          <button onClick={() => fallPiece(true)}>drop</button>
          <button onClick={() => holdPiece(true)}>hold</button>
        </div>

        <div>
          <button onClick={() => clear()}>clear</button>
        </div>
      </div>

      {/* <LeftMenu/> */}
      <TetrisHeld heldPiece={heldPiece} heldColor={heldPieceColor}/>
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor} onNextClick={getNextStockedPiece}/>
      {/* <LeftMenu /> */}

      <TetrisField 
        fieldData={field} 
        onCellClick={toggleCellState}
      />

      <TetrisNext 
        nextPiece={nextPiece?.type}
        nextColor={nextPiece?.color}
        onNextClick={getNextStockedPiece}
      />
    </>
  );
}

export default TetrisManager;

//todo:

//left menu

//usuwanie linii

//rotate

//ghost piece

//blockout