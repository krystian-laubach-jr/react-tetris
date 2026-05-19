import './styles/App.css';
import { useState, useEffect, useRef } from 'react';

import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';
import TetrisHeld from './TetrisHeld';

function TetrisManager() {
  //#region field
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
  //#endregion


  //#region init
  useEffect(() => {
    const initialField = generateField();
    setField(initialField);
    fieldRef.current = initialField;
    getNextStockedPiece();
    spawnPiece(
    pieces[Math.floor(Math.random() * pieces.length)],
    colors[Math.floor(Math.random() * colors.length)],
    initialField
  );

  }, []);
  //#endregion


  //#region piece and color consts
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


  const [currentPiece, setCurrentPiece] = useState();
  const [currentPieceCells, setCurrentPieceCells] = useState([]);
  const [currentPieceColor, setCurrentPieceColor] = useState("")

  const [canHoldPiece, setCanHoldPiece] = useState(true)
  const [isPieceHeld, setIsPieceHeld] = useState(false);
  const [heldPiece, setHeldPiece] = useState([]);
  const [heldPieceColor, setHeldPieceColor] = useState("")

  const currentPieceCellsRef = useRef([]);
  const currentPieceColorRef = useRef("");
  const fieldRef = useRef([]);
  //#endregion


  //#region piece spawning
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

  const spawnPiece = (piece, color, existingField = null) => {
    if (!piece || !color) return;
    if (checkBlockOut(piece)) return;

    setField((oldField) => {
      const baseField = existingField || oldField;
      const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;
      const newField = oldField.map(row =>
        row.map(cell =>
        cellsToFill.includes(cell.id)
          ? { ...cell, isFilled: true, color: color }
          : cell
        )
      );
      fieldRef.current = newField;
      setCurrentPieceCells(cellsToFill);
      currentPieceCellsRef.current = cellsToFill;
      return newField;
    });

    setCurrentPiece(piece)
    setCurrentPieceColor(color);
    currentPieceColorRef.current = color;
  }

  const spawnNextPiece = () => {
    spawnPiece(nextPiece, nextColor)
    getNextStockedPiece()
    setCanHoldPiece(true)
  }
  //#endregion


  //#region moving pieces
  const fallPiece = (isDrop) => {
    const cells = currentPieceCellsRef.current;
    const color = currentPieceColorRef.current;
    const currentField = fieldRef.current;    
    let newCells = []

    const isAtBottom = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return true; // treat as bottom
        return cell.rowId >= 19;
      });
    };

    const isPieceUnder = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return false; // ✅ prevent crash

        const cellBelow = currentField[cell.rowId + 1]?.[cell.colId];

        return (
          cellBelow &&
          cellBelow.isFilled &&
          !cellArray.includes(cellBelow.id)
        );
      });
    };

    if (isAtBottom(currentPieceCells) || isPieceUnder(currentPieceCells)) {
      clear()
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
          const cell = currentField.flat().find(c => c.id === id);
          if (!cell) return null;

          return `${cell.rowId + 1}.${cell.colId}`;
        });
      }
    }
    else {
      newCells = currentPieceCells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId + 1}.${cell.colId}`;
      });
    }

    const newField = currentField.map(row => // build from ref snapshot, not stale state
      row.map(cell => {
        if (newCells.includes(cell.id))
          return { ...cell, isFilled: true, color };
        if (cells.includes(cell.id))
          return { ...cell, isFilled: false, color: "" };
        return cell;
      })
    );
    
    fieldRef.current = newField;
    currentPieceCellsRef.current = newCells;
    setField(newField);
    setCurrentPieceCells(newCells);

    if(isDrop) {
      clear()
      spawnNextPiece();
    }
  };

  const movePiece = (isToLeft) => {
    const cells = currentPieceCellsRef.current;   
    const color = currentPieceColorRef.current;   
    const currentField = fieldRef.current;        

    const isAtLeftSide = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      return cell.colId === 0;
    });

    const isAtRightSide = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      return cell.colId === 9;
    });

    const isPieceToLeft = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellLeft = currentField[cell.rowId]?.[cell.colId - 1];

      return (
        cellLeft &&
        cellLeft.isFilled &&
        !currentPieceCells.includes(cellLeft.id)
      );
    });

    const isPieceToRight = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellRight = currentField[cell.rowId]?.[cell.colId + 1];

      return (
        cellRight &&
        cellRight.isFilled &&
        !currentPieceCells.includes(cellRight.id)
      );
    });

    let newCells = [];

    if (isToLeft && !isAtLeftSide && !isPieceToLeft) {
      newCells = currentPieceCells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId}.${cell.colId - 1}`;
      });
    } 
    else if (!isToLeft && !isAtRightSide && !isPieceToRight) {
      newCells = currentPieceCells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId}.${cell.colId + 1}`;
      });
    } 
    else {
      return;
    }

      const newField = currentField.map(row => // build from ref snapshot, not stale state
    row.map(cell => {
      if (newCells.includes(cell.id))
        return { ...cell, isFilled: true, color };
      if (cells.includes(cell.id))
        return { ...cell, isFilled: false, color: "" };
      return cell;
    })
  );

    fieldRef.current = newField;             // sync field ref before setField so next read is fresh
    currentPieceCellsRef.current = newCells; // sync cells ref so next interval tick or keypress sees new position
    setField(newField);                       
    setCurrentPieceCells(newCells);
  };
  //#endregion


  //#region other game logic
  const holdPiece = () => {
    if(!canHoldPiece){ return }

    const cells = currentPieceCellsRef.current; // read from ref, not state — avoids stale closure
    const currentField = fieldRef.current;

    setHeldPiece(currentPiece)
    setHeldPieceColor(currentPieceColor)

    const newField = currentField.map(row => // build from ref snapshot, not stale state
      row.map(cell => {
        if (cells.includes(cell.id))
          return { ...cell, isFilled: false, color: "" };
        return cell;
      })
    );

    fieldRef.current = newField;          // sync field ref so interval doesn't re-draw the cleared piece
    currentPieceCellsRef.current = [];    // clear cells ref so interval skips ticking until new piece spawns
    setField(newField);
    
    if( !isPieceHeld) {
      spawnNextPiece()
      setIsPieceHeld(true)
    }

    if (isPieceHeld) {
      spawnPiece(heldPiece, heldPieceColor)
    }
    setCanHoldPiece(false)
  }

  const clear = () => {
    const currentField = fieldRef.current; // read from ref, not state — avoids stale closure

    let remainingRows = currentField.filter(row => // use currentField (ref) not field (state)
      row.some(cell => !cell.isFilled)
    );

    const clearedLines = 20 - remainingRows.length;

    const newRows = [];
    for (let i = 0; i < clearedLines; i++) {
      let newRow = [];
      for (let j = 0; j < 10; j++) {
        newRow.push({ rowId: i, colId: j, id: `${i}.${j}`, isFilled: false, color: "" });
      }
      newRows.push(newRow);
    }

    const rebuiltField = [...newRows, ...remainingRows];
    const correctedField = rebuiltField.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        rowId: rowIndex,
        colId: colIndex,
        id: `${rowIndex}.${colIndex}`
      }))
    );

    fieldRef.current = correctedField; // sync field ref so interval works with the cleared board
    setField(correctedField);           // update state to trigger re-render
  };
  //#endregion


  //#region blockout
const checkBlockOut = (piece) => {
  const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;
  const isBlockedOut = cellsToFill.some(id =>
    fieldRef.current.flat().find(c => c.id === id)?.isFilled
  );
  if (isBlockedOut) {
    blockOut();
  }
  return isBlockedOut;
};

  const blockOut = () => {
    alert("Game Over!");
    window.location.reload(true);
  }
  //#endregion

  //Keyboard controls
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
    } else if (event.key === 'r') {
      window.location.reload(true);
    }

    

  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [fallPiece, movePiece, holdPiece]);


  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPieceCellsRef.current.length === 0) return; // don't tick if no active piece
      console.log("fall pice");
      fallPiece();
    }, 800);

    return () => clearInterval(interval);
  }, [fallPiece]);


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

      <TetrisHeld heldPiece={heldPiece} heldColor={heldPieceColor}/>
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor} onNextClick={getNextStockedPiece}/>
    </>

  );
}

export default TetrisManager;

//todo:

//punkty

//rotate

//ghost piece (optional)

//blockout