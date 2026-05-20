import './styles/App.css';
import { useState, useEffect, useRef } from 'react';
import { useState, useEffect } from 'react';

import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';
import TetrisHeld from './TetrisHeld';

function TetrisManager() {
  //#region field

  // FIELD
  const [field, setField] = useState([]);

  const generateField = () => {
    let tempRowsArray = [];
    
    for (let i=0; i < 20; i++) {

      let tempColsArray = [];
      for (let j=0; j < 10; j++) {
        tempColsArray.push(
          {rowId:i, colId:j, id:`${i}.${j}`, isFilled: false, isGhost: false, color:""}
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
  // PIECES
  const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'cyan',
    'blue',
    'purple'
  ];

  const pieces = ['z', 'rz', 'l', 'rl', 't', 'line', 'square'];

  const pieces = [
    'z',
    'rz',
    'l',
    'rl',
    't',
    'line',
    'square'
  ];

  const pieceStartingCells = [
    { name: 'z', coords: ['0.4', '0.5', '1.5', '1.6'] },
    { name: 'rz', coords: ['0.4', '0.5', '1.3', '1.4'] },
    { name: 'l', coords: ['0.4', '1.4', '2.4', '2.5'] },
    { name: 'rl', coords: ['0.5', '1.5', '2.4', '2.5'] },
    { name: 't', coords: ['0.4', '1.3', '1.4', '1.5'] },
    { name: 'line', coords: ['0.4', '1.4', '2.4', '3.4'] },
    { name: 'square', coords: ['0.4', '0.5', '1.4', '1.5'] }
  ];

  const pieceRotations = [
  { name: 'z', rotations: [
    ['0.4', '0.5', '1.5', '1.6'],
    ['0.5', '1.4', '1.5', '2.4'],
  ]},
  { name: 'rz', rotations: [
    ['0.4', '0.5', '1.3', '1.4'],
    ['0.4', '1.4', '1.5', '2.5'],
  ]},
  { name: 'l', rotations: [
    ['0.4', '1.4', '2.4', '2.5'],
    ['0.4', '0.5', '0.6', '1.4'],
    ['0.4', '0.5', '1.5', '2.5'],
    ['0.6', '1.4', '1.5', '1.6'],
  ]},
  { name: 'rl', rotations: [
    ['0.5', '1.5', '2.4', '2.5'],
    ['0.4', '1.4', '1.5', '1.6'],
    ['0.4', '0.5', '1.4', '2.4'],
    ['0.4', '0.5', '0.6', '1.6'],
  ]},
{ name: 't', rotations: [
  ['0.4', '1.3', '1.4', '1.5'],  // stem up
  ['0.3', '1.3', '1.4', '2.3'],  // stem right
  ['0.3', '0.4', '0.5', '1.4'],  // stem down
  ['0.4', '1.3', '1.4', '2.4'],  // stem left
]},
  { name: 'line', rotations: [
    ['0.4', '1.4', '2.4', '3.4'],
    ['1.3', '1.4', '1.5', '1.6'],
  ]},
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
  const currentRotationIndexRef = useRef(0);
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
  const [nextPiece, setNextPiece] = useState(null);
  const [nextColor, setNextColor] = useState("");

  const spawnPiece = (piece, color, existingField = null) => {
    if (!piece || !color) return;
    if (checkBlockOut(piece)) return;
    currentRotationIndexRef.current = 0;

  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPieceCells, setCurrentPieceCells] = useState([]);
  const [currentPieceColor, setCurrentPieceColor] = useState("");

  const [canHoldPiece, setCanHoldPiece] = useState(true);
  const [isPieceHeld, setIsPieceHeld] = useState(false);

  const [heldPiece, setHeldPiece] = useState(null);
  const [heldPieceColor, setHeldPieceColor] = useState("");

  // GENERATE FIELD
  const generateField = () => {
    let tempRowsArray = [];

    for (let i = 0; i < 20; i++) {

      let tempColsArray = [];

      for (let j = 0; j < 10; j++) {

        tempColsArray.push({
          rowId: i,
          colId: j,
          id: `${i}.${j}`,
          isFilled: false,
          color: ""
        });
      }

      tempRowsArray.push(tempColsArray);
    }

    return tempRowsArray;
  };

  useEffect(() => {
    setField(generateField());
    getNextStockedPiece();
  }, []);

  // RANDOM COLOR
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // NEXT PIECE
  const getNextStockedPiece = () => {

    let currentStock = [...stockedPieces];

    if (currentStock.length === 0) {
      currentStock = [...pieces];
    }

    const randomIndex = Math.floor(Math.random() * currentStock.length);

    const newPiece = currentStock[randomIndex];

    const newStock = currentStock.filter(
      (_, i) => i !== randomIndex
    );

    setStockedPieces(newStock);
    setNextPiece(newPiece);
    setNextColor(getRandomColor());
  };

  // SPAWN PIECE
  const spawnPiece = (piece, color) => {

    if (!piece) return;

    setField((oldField) => {
      const baseField = existingField || oldField;
      const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;

      const cellsToFill = pieceStartingCells.find(
        p => p.name === piece
      ).coords;

      const newField = oldField.map(row =>
        row.map(cell =>
          cellsToFill.includes(cell.id)
            ? { ...cell, isFilled: true, color: color }
            : cell
        )
      );
      fieldRef.current = newField;
      currentPieceCellsRef.current = cellsToFill;

      setCurrentPieceCells(cellsToFill);
      updateGhostPiece(currentPieceCellsRef.current, fieldRef.current); // pass refs so ghost always has latest values
      return newField; // still need to return for setField callback

      return newField;
    });

    setCurrentPiece(piece);
    setCurrentPieceColor(color);
    currentPieceColorRef.current = color;
  }
  };

  // SPAWN NEXT
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

    spawnPiece(nextPiece, nextColor);

    getNextStockedPiece();

    setCanHoldPiece(true);
  };

  // FALL PIECE
  const fallPiece = (isDrop = false) => {

    let newCells = [];

    const isAtBottom = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return true; // treat as bottom

        const cell = field.flat().find(c => c.id === id);

        if (!cell) return true;

        return cell.rowId >= 19;
      });
    };

    const isPieceUnder = (cellArray) => {

      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return false; // ✅ prevent crash

        const cell = field.flat().find(c => c.id === id);

        if (!cell) return false;

        const cellBelow = currentField[cell.rowId + 1]?.[cell.colId];

        return (
          cellBelow &&
          cellBelow.isFilled &&
          !cellArray.includes(cellBelow.id)
        );
      });
    };

    if (isAtBottom(cells) || isPieceUnder(cells)) {
      clear()
    if (
      isAtBottom(currentPieceCells) ||
      isPieceUnder(currentPieceCells)
    ) {
      spawnNextPiece();
      return;
    }

    if (isDrop) {
      newCells = cells; // start from current position

      newCells = currentPieceCells;

      while (true) {

        if (
          isAtBottom(newCells) ||
          isPieceUnder(newCells)
        ) {
          break;
        }

        newCells = newCells.map(id => {
          const cell = currentField.flat().find(c => c.id === id);
          if (!cell) return null;

          const cell = field.flat().find(c => c.id === id);

          return `${cell.rowId + 1}.${cell.colId}`;
        });
      }
    }
    else {
      newCells = cells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);

    } else {

      newCells = currentPieceCells.map(id => {

        const cell = field.flat().find(c => c.id === id);

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
    setField(oldField => {

      const newField = oldField.map(row =>
        row.map(cell => {

          if (newCells.includes(cell.id)) {
            return {
              ...cell,
              isFilled: true,
              color: currentPieceColor
            };
          }

          if (currentPieceCells.includes(cell.id)) {
            return {
              ...cell,
              isFilled: false,
              color: ""
            };
          }

          return cell;
        })
      );

      return newField;
    });

    setCurrentPieceCells(newCells);
    updateGhostPiece(currentPieceCellsRef.current, fieldRef.current); // pass refs so ghost always has latest values

    if(isDrop) {
      clear()
      spawnNextPiece();
    }

    if (isDrop) {
      spawnNextPiece();
    }
  };

  // MOVE PIECE
  const movePiece = (isToLeft) => {
    const cells = currentPieceCellsRef.current;   
    const color = currentPieceColorRef.current;   
    const currentField = fieldRef.current;        

    const isAtLeftSide = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);

      const cell = field.flat().find(c => c.id === id);

      return cell.colId === 0;
    });

    const isAtRightSide = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);

      const cell = field.flat().find(c => c.id === id);

      return cell.colId === 9;
    });

    const isPieceToLeft = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellLeft = currentField[cell.rowId]?.[cell.colId - 1];

      const cell = field.flat().find(c => c.id === id);

      const cellLeft = field[cell.rowId]?.[cell.colId - 1];

      return (
        cellLeft &&
        cellLeft.isFilled &&
        !currentPieceCells.includes(cellLeft.id)
      );
    });

    const isPieceToRight = currentPieceCells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellRight = currentField[cell.rowId]?.[cell.colId + 1];

      const cell = field.flat().find(c => c.id === id);

      const cellRight = field[cell.rowId]?.[cell.colId + 1];

      return (
        cellRight &&
        cellRight.isFilled &&
        !currentPieceCells.includes(cellRight.id)
      );
    });

    let newCells = [];

    if (
      isToLeft &&
      !isAtLeftSide &&
      !isPieceToLeft
    ) {

      newCells = currentPieceCells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);

        const cell = field.flat().find(c => c.id === id);

        return `${cell.rowId}.${cell.colId - 1}`;
      });

    } else if (
      !isToLeft &&
      !isAtRightSide &&
      !isPieceToRight
    ) {

      newCells = currentPieceCells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);

        const cell = field.flat().find(c => c.id === id);

        return `${cell.rowId}.${cell.colId + 1}`;
      });

    } else {
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

    fieldRef.current = newField;
    currentPieceCellsRef.current = newCells;
    setCurrentPieceCells(newCells);
    updateGhostPiece(currentPieceCellsRef.current, fieldRef.current); // pass refs so ghost always has latest values
  };

  const rotatePiece = () => {
    const cells = currentPieceCellsRef.current;
    const color = currentPieceColorRef.current;
    const currentField = fieldRef.current;

    const pieceData = pieceRotations.find(p => p.name === currentPiece);
    if (!pieceData) return;
    if (currentPiece === 'square') return;

    const currentRotationTemplate = pieceData.rotations[currentRotationIndexRef.current];
    const nextRotationIndex = (currentRotationIndexRef.current + 1) % pieceData.rotations.length;
    const nextRotationTemplate = pieceData.rotations[nextRotationIndex];

    const templateAnchorRow = parseInt(currentRotationTemplate[0].split('.')[0]);
    const templateAnchorCol = parseInt(currentRotationTemplate[0].split('.')[1]);
    const actualAnchorRow = parseInt(cells[0].split('.')[0]);
    const actualAnchorCol = parseInt(cells[0].split('.')[1]);

    const rowOffset = actualAnchorRow - templateAnchorRow;
    const colOffset = actualAnchorCol - templateAnchorCol;

    // kicks to try in order: no kick, left 1, right 1, left 2, right 2
    const kicks = [0, -1, 1, -2, 2];

    for (const kick of kicks) {
      const nextCells = nextRotationTemplate.map(id => {
        const row = parseInt(id.split('.')[0]) + rowOffset;
        const col = parseInt(id.split('.')[1]) + colOffset + kick; // apply kick offset
        return `${row}.${col}`;
      });

      const outOfBounds = nextCells.some(id => {
        const row = parseInt(id.split('.')[0]);
        const col = parseInt(id.split('.')[1]);
        return row < 0 || row > 19 || col < 0 || col > 9;
      });
      if (outOfBounds) continue; // try next kick

      const isColliding = nextCells.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return cell && cell.isFilled && !cells.includes(id);
      });
      if (isColliding) continue; // try next kick

      // this kick worked — apply it
      const newField = currentField.map(row =>
    setField(oldField => {

      const newField = oldField.map(row =>
        row.map(cell => {
          if (nextCells.includes(cell.id))
            return { ...cell, isFilled: true, color };
          if (cells.includes(cell.id))
            return { ...cell, isFilled: false, color: '' };

          if (newCells.includes(cell.id)) {
            return {
              ...cell,
              isFilled: true,
              color: currentPieceColor
            };
          }

          if (currentPieceCells.includes(cell.id)) {
            return {
              ...cell,
              isFilled: false,
              color: ""
            };
          }

          return cell;
        })
      );

      currentRotationIndexRef.current = nextRotationIndex;
      fieldRef.current = newField;
      currentPieceCellsRef.current = nextCells;
      setField(newField);
      setCurrentPieceCells(nextCells);
      updateGhostPiece(currentPieceCellsRef.current, fieldRef.current);
      return; // stop as soon as a kick works
    }
    // if all kicks failed, rotation is fully blocked — do nothing
  };
  //#endregion


  //#region other game logic

      return newField;
    });

    setCurrentPieceCells(newCells);
  };

  // HOLD PIECE
  const holdPiece = () => {
    if(!canHoldPiece){ return }

    const cells = currentPieceCellsRef.current; // read from ref, not state — avoids stale closure
    const currentField = fieldRef.current;

    if (!canHoldPiece) return;

    setHeldPiece(currentPiece);
    setHeldPieceColor(currentPieceColor);

    const newField = currentField.map(row => // build from ref snapshot, not stale state
      row.map(cell => {
        if (cells.includes(cell.id))
          return { ...cell, isFilled: false, color: "" };
        return cell;
      })
    );
    setField(oldField => {

      const newField = oldField.map(row =>
        row.map(cell => {

          if (currentPieceCells.includes(cell.id)) {
            return {
              ...cell,
              isFilled: false,
              color: ""
            };
          }

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
      return newField;
    });

    if (!isPieceHeld) {

      spawnPiece(nextPiece, nextColor);

      getNextStockedPiece();

      setIsPieceHeld(true);

    } else {

      spawnPiece(heldPiece, heldPieceColor);
    }

    setCanHoldPiece(false);
  };

  // CLEAR LINES
  const clear = () => {
    const currentField = fieldRef.current; // read from ref, not state — avoids stale closure

    let remainingRows = currentField.filter(row => // use currentField (ref) not field (state)
      row.some(cell => !cell.isFilled)
    );

    setField(oldField => {

      let remainingRows = oldField.filter(row =>
        row.some(cell => !cell.isFilled)
      );

    const clearedLines = 20 - remainingRows.length;
      const clearedLines = 20 - remainingRows.length;

    const newRows = [];
    for (let i = 0; i < clearedLines; i++) {
      let newRow = [];
      for (let j = 0; j < 10; j++) {
        newRow.push({ rowId: i, colId: j, id: `${i}.${j}`, isFilled: false, color: "" });
      }
      newRows.push(newRow);
    }
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

    const rebuiltField = [...newRows, ...remainingRows];
    const correctedField = rebuiltField.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        rowId: rowIndex,
        colId: colIndex,
        id: `${rowIndex}.${colIndex}`
      }))
    );
      const rebuiltField = [
        ...newRows,
        ...remainingRows
      ];

      const correctedField = rebuiltField.map(
        (row, rowIndex) =>
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

  const updateGhostPiece = (liveCells, currentField) => {
  let ghostCells = liveCells;

  const isAtBottom = (cellArray) => {
    return cellArray.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      if (!cell) return true;
      return cell.rowId >= 19;
      return correctedField;
    });
  };

  const isPieceUnder = (cellArray) => {
    return cellArray.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      if (!cell) return false;
      const cellBelow = currentField[cell.rowId + 1]?.[cell.colId];
      return cellBelow && cellBelow.isFilled && !liveCells.includes(cellBelow.id); // use liveCells not cellArray so ghost doesn't block itself
    });
  };

  while (!isAtBottom(ghostCells) && !isPieceUnder(ghostCells)) {
    ghostCells = ghostCells.map(id => {
      const cell = currentField.flat().find(c => c.id === id);
      return `${cell.rowId + 1}.${cell.colId}`;
    });
  }

  const newField = currentField.map(row =>
    row.map(cell => {
      if (ghostCells.includes(cell.id) && !liveCells.includes(cell.id))
        return { ...cell, isGhost: true };
      return { ...cell, isGhost: false }; // clear old ghost cells
    })
  );

  fieldRef.current = newField;           // sync ref so next interval/keypress reads field with ghost applied
  setField(newField);
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

  //#region Keyboard controls
  const fallPieceRef = useRef(null);
  const movePieceRef = useRef(null);
  const holdPieceRef = useRef(null);
  const rotatePieceRef = useRef(null);

  fallPieceRef.current = fallPiece;
  movePieceRef.current = movePiece;
  holdPieceRef.current = holdPiece;
  rotatePieceRef.current = rotatePiece;
  };

  // KEYBOARD
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') movePieceRef.current(true);
      else if (event.key === 'ArrowRight') movePieceRef.current(false);
      else if (event.key === 'ArrowDown') fallPieceRef.current();
      else if (event.key === ' ') fallPieceRef.current(true);
      else if (event.key === 'ArrowUp') rotatePieceRef.current();
      else if (event.key === 'c') holdPieceRef.current();
      else if (event.key === 'r') window.location.reload(true);
    };

    const handleKeyDown = (event) => {

      if (event.key === 'ArrowLeft') {
        movePiece(true);
        event.preventDefault()
      }

      else if (event.key === 'ArrowRight') {
        movePiece(false);
        event.preventDefault()
      }

      else if (event.key === 'ArrowDown') {
        fallPiece();
        event.preventDefault()
      }

      else if (event.key === ' ') {
        fallPiece(true);
        event.preventDefault()
      }

      else if (event.key === 'c') {
        holdPiece();
        event.preventDefault()
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // empty deps — listener never re-registers
  //#endregion

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPieceCellsRef.current.length === 0) return; // don't tick if no active piece
      fallPieceRef.current();
    }, 800);

    return () => clearInterval(interval);
  }, []);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };

  }, [
    field,
    currentPieceCells,
    currentPieceColor,
    nextPiece,
    nextColor,
    heldPiece,
    heldPieceColor,
    canHoldPiece,
    isPieceHeld
  ]);

  return (
    <>
      <TetrisHeld heldPiece={heldPiece} heldColor={heldPieceColor}/>
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor}/>
      <div>

        <div>
          <button onClick={spawnNextPiece}>
            spawn piece
          </button>

          <button onClick={() => fallPiece()}>
            fall piece
          </button>
        </div>

        <div>
          <button onClick={() => movePiece(true)}>
            left
          </button>

          <button onClick={() => movePiece(false)}>
            right
          </button>
        </div>

        <div>
          <button onClick={() => fallPiece(true)}>
            drop
          </button>

          <button onClick={holdPiece}>
            hold
          </button>
        </div>

        <div>
          <button onClick={clear}>
            clear
          </button>
        </div>

      </div>

      <TetrisHeld
        heldPiece={heldPiece}
        heldColor={heldPieceColor}
      />

      <TetrisField fieldData={field} />

      <TetrisNext
        nextPiece={nextPiece}
        nextColor={nextColor}
        onNextClick={getNextStockedPiece}
      />
    </>
  );
}

export default TetrisManager;

//todo:

//punkty

//rotate