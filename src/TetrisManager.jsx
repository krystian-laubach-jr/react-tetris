import './styles/App.css';
import { useState, useEffect, useRef } from 'react';

import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';
import TetrisHeld from './TetrisHeld';
import Score from './Score';
import GameOverModal from './GameOverModal';

function TetrisManager({ onGoToLeaderboard }) {
  //#region field
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
    return tempRowsArray;
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
  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
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
      ['0.4', '1.3', '1.4', '1.5'],
      ['0.3', '1.3', '1.4', '2.3'],
      ['0.3', '0.4', '0.5', '1.4'],
      ['0.4', '1.3', '1.4', '2.4'],
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
  const [currentPieceColor, setCurrentPieceColor] = useState("");

  const [canHoldPiece, setCanHoldPiece] = useState(true);
  const [isPieceHeld, setIsPieceHeld] = useState(false);
  const [heldPiece, setHeldPiece] = useState([]);
  const [heldPieceColor, setHeldPieceColor] = useState("");

  const [isGameOver, setIsGameOver] = useState(false);
  const isGameOverRef = useRef(false);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  const [level, setLevel] = useState(1);
  const levelRef = useRef(1);

  const levelSpeeds = [800, 650, 500, 380, 280, 200, 150, 110, 80, 50];
  const levelSpeedRef = useRef(800);

  const currentPieceCellsRef = useRef([]);
  const currentPieceColorRef = useRef("");
  const currentRotationIndexRef = useRef(0);
  const fieldRef = useRef([]);
  //#endregion


  //#region piece spawning
  const getNextStockedPiece = () => {
    let currentStockedPieces = [...stockedPieces];
    let piecesLeft = currentStockedPieces.length;

    if (piecesLeft === 0) {
      currentStockedPieces = pieces;
    }

    let newNextPieceId = Math.floor(Math.random() * piecesLeft);
    let newNextPiece = currentStockedPieces[newNextPieceId];
    let newStockedPieces = currentStockedPieces.filter((_, i) => i !== newNextPieceId);

    setStockedPieces(newStockedPieces);
    setNextPiece(newNextPiece);
    setNextColor(colors[Math.floor(Math.random() * 7)]);
  }

  const spawnPiece = (piece, color, existingField = null) => {
    if (!piece || !color) return;
    if (checkBlockOut(piece)) return;
    currentRotationIndexRef.current = 0;

    setField((oldField) => {
      const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;
      const newField = (existingField || oldField).map(row =>
        row.map(cell =>
          cellsToFill.includes(cell.id)
            ? { ...cell, isFilled: true, color: color }
            : cell
        )
      );
      fieldRef.current = newField;
      currentPieceCellsRef.current = cellsToFill;
      setCurrentPieceCells(cellsToFill);
      updateGhostPiece(currentPieceCellsRef.current, fieldRef.current);
      return newField;
    });

    setCurrentPiece(piece);
    setCurrentPieceColor(color);
    currentPieceColorRef.current = color;
  }

  const spawnNextPiece = () => {
    spawnPiece(nextPiece, nextColor);
    getNextStockedPiece();
    setCanHoldPiece(true);
  }
  //#endregion


  //#region moving pieces
  const fallPiece = (isDrop) => {
    if (isGameOverRef.current) return;
    const cells = currentPieceCellsRef.current;
    const color = currentPieceColorRef.current;
    const currentField = fieldRef.current;
    let newCells = [];

    const isAtBottom = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return true;
        return cell.rowId >= 19;
      });
    };

    const isPieceUnder = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return false;
        const cellBelow = currentField[cell.rowId + 1]?.[cell.colId];
        return cellBelow && cellBelow.isFilled && !cellArray.includes(cellBelow.id);
      });
    };

    if (isAtBottom(cells) || isPieceUnder(cells)) {
      clear();
      spawnNextPiece();
      return;
    }

    if (isDrop) {
      newCells = cells;
      let dropHeight = 0;

      while (true) {
        if (isAtBottom(newCells) || isPieceUnder(newCells)) break;
        newCells = newCells.map(id => {
          const cell = currentField.flat().find(c => c.id === id);
          if (!cell) return null;
          return `${cell.rowId + 1}.${cell.colId}`;
        });
        dropHeight++;
      }

      addScore(dropHeight * 2);
    } else {
      newCells = cells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId + 1}.${cell.colId}`;
      });

      addScore(1);
    }

    const newField = currentField.map(row =>
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
    updateGhostPiece(currentPieceCellsRef.current, fieldRef.current);

    if (isDrop) {
      clear();
      spawnNextPiece();
    }
  };

  const movePiece = (isToLeft) => {
    if (isGameOverRef.current) return;
    const cells = currentPieceCellsRef.current;
    const color = currentPieceColorRef.current;
    const currentField = fieldRef.current;

    const isAtLeftSide = cells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      return cell.colId === 0;
    });

    const isAtRightSide = cells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      return cell.colId === 9;
    });

    const isPieceToLeft = cells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellLeft = currentField[cell.rowId]?.[cell.colId - 1];
      return cellLeft && cellLeft.isFilled && !cells.includes(cellLeft.id);
    });

    const isPieceToRight = cells.some(id => {
      const cell = currentField.flat().find(c => c.id === id);
      const cellRight = currentField[cell.rowId]?.[cell.colId + 1];
      return cellRight && cellRight.isFilled && !cells.includes(cellRight.id);
    });

    let newCells = [];

    if (isToLeft && !isAtLeftSide && !isPieceToLeft) {
      newCells = cells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId}.${cell.colId - 1}`;
      });
    } else if (!isToLeft && !isAtRightSide && !isPieceToRight) {
      newCells = cells.map(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return `${cell.rowId}.${cell.colId + 1}`;
      });
    } else {
      return;
    }

    const newField = currentField.map(row =>
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
    updateGhostPiece(currentPieceCellsRef.current, fieldRef.current);
  };

  const rotatePiece = () => {
    if (isGameOverRef.current) return;
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

    const kicks = [0, -1, 1, -2, 2];

    for (const kick of kicks) {
      const nextCells = nextRotationTemplate.map(id => {
        const row = parseInt(id.split('.')[0]) + rowOffset;
        const col = parseInt(id.split('.')[1]) + colOffset + kick;
        return `${row}.${col}`;
      });

      const outOfBounds = nextCells.some(id => {
        const row = parseInt(id.split('.')[0]);
        const col = parseInt(id.split('.')[1]);
        return row < 0 || row > 19 || col < 0 || col > 9;
      });
      if (outOfBounds) continue;

      const isColliding = nextCells.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        return cell && cell.isFilled && !cells.includes(id);
      });
      if (isColliding) continue;

      const newField = currentField.map(row =>
        row.map(cell => {
          if (nextCells.includes(cell.id))
            return { ...cell, isFilled: true, color };
          if (cells.includes(cell.id))
            return { ...cell, isFilled: false, color: '' };
          return cell;
        })
      );

      currentRotationIndexRef.current = nextRotationIndex;
      fieldRef.current = newField;
      currentPieceCellsRef.current = nextCells;
      setField(newField);
      setCurrentPieceCells(nextCells);
      updateGhostPiece(currentPieceCellsRef.current, fieldRef.current);
      return;
    }
  };
  //#endregion


  //#region other game logic
  const holdPiece = () => {
    if (isGameOverRef.current) return;
    if (!canHoldPiece) return;

    const cells = currentPieceCellsRef.current;
    const currentField = fieldRef.current;

    setHeldPiece(currentPiece);
    setHeldPieceColor(currentPieceColor);

    const newField = currentField.map(row =>
      row.map(cell => {
        if (cells.includes(cell.id))
          return { ...cell, isFilled: false, color: "" };
        return cell;
      })
    );

    fieldRef.current = newField;
    currentPieceCellsRef.current = [];
    setField(newField);

    if (!isPieceHeld) {
      spawnNextPiece();
      setIsPieceHeld(true);
    }

    if (isPieceHeld) {
      spawnPiece(heldPiece, heldPieceColor);
    }
    setCanHoldPiece(false);
  }

  const clear = () => {
    const currentField = fieldRef.current;

    let remainingRows = currentField.filter(row =>
      row.some(cell => !cell.isFilled)
    );

    const clearedLines = 20 - remainingRows.length;

    if (clearedLines > 0) {
      const linePoints = [0, 100, 300, 500, 800];
      const combo = comboRef.current;
      const points = linePoints[clearedLines] * (combo + 1);
      addScore(points);
      comboRef.current += 1;
    } else {
      comboRef.current = 0;
    }

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

    fieldRef.current = correctedField;
    setField(correctedField);
  };

  const updateGhostPiece = (liveCells, currentField) => {
    let ghostCells = liveCells;

    const isAtBottom = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return true;
        return cell.rowId >= 19;
      });
    };

    const isPieceUnder = (cellArray) => {
      return cellArray.some(id => {
        const cell = currentField.flat().find(c => c.id === id);
        if (!cell) return false;
        const cellBelow = currentField[cell.rowId + 1]?.[cell.colId];
        return cellBelow && cellBelow.isFilled && !liveCells.includes(cellBelow.id);
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
        return { ...cell, isGhost: false };
      })
    );

    fieldRef.current = newField;
    setField(newField);
  };

  const addScore = (points) => {
    scoreRef.current += points;
    setScore(scoreRef.current);

    const newLevel = Math.min(10, Math.floor(scoreRef.current / 1500) + 1);
    if (newLevel !== levelRef.current) {
      levelRef.current = newLevel;
      levelSpeedRef.current = levelSpeeds[newLevel - 1];
      setLevel(newLevel);
    }
  };
  //#endregion


  //#region blockout
  const checkBlockOut = (piece) => {
    const cellsToFill = pieceStartingCells.find(p => p.name === piece).coords;
    const isBlockedOut = cellsToFill.some(id =>
      fieldRef.current.flat().find(c => c.id === id)?.isFilled
    );
    if (isBlockedOut) blockOut();
    return isBlockedOut;
  };

  const blockOut = () => {
    isGameOverRef.current = true;
    setIsGameOver(true);
  }
  //#endregion


  //#region keyboard controls
  const fallPieceRef = useRef(null);
  const movePieceRef = useRef(null);
  const holdPieceRef = useRef(null);
  const rotatePieceRef = useRef(null);

  fallPieceRef.current = fallPiece;
  movePieceRef.current = movePiece;
  holdPieceRef.current = holdPiece;
  rotatePieceRef.current = rotatePiece;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') movePieceRef.current(true);
      else if (event.key === 'ArrowRight') movePieceRef.current(false);
      else if (event.key === 'ArrowDown') fallPieceRef.current();
      else if (event.key === ' ') fallPieceRef.current(true);
      else if (event.key === 'ArrowUp') rotatePieceRef.current();
      else if (event.key === 'c') holdPieceRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  //#endregion


  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPieceCellsRef.current.length === 0) return;
      if (isGameOverRef.current) return;
      fallPieceRef.current();
    }, levelSpeeds[levelRef.current - 1]);

    return () => clearInterval(interval);
  }, [level]);


  return (
    <>
      {isGameOver && (
        <GameOverModal
          score={score}
          onPlayAgain={() => window.location.reload(true)}
          onGoToLeaderboard={onGoToLeaderboard}
        />
      )}
      <div id='leftMenu'>
        <TetrisHeld heldPiece={heldPiece} heldColor={heldPieceColor}/>
        <Score score={score} level={level}/>
      </div>
      <TetrisField fieldData={field}/>
      <TetrisNext nextPiece={nextPiece} nextColor={nextColor}/>
    </>
  );
}

export default TetrisManager;