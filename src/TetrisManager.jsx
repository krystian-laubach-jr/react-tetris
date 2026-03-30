import './styles/App.css';
import { useState, useEffect } from 'react';

import LeftMenu from './LeftMenu';
import TetrisField from './TetrisField';
import TetrisNext from './TetrisNext';

function TetrisManager() {
  const [field, setField] = useState([]);
  const [nextPiece, setNextPiece] = useState(null);
  const [stockedPieces, setStockedPieces] = useState([]);

  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];

  const pieces = ['z', 'rz', 'l', 'rl', 't', 'line', 'square'];

  const generateField = () => {
    let tempRowsArray = [];

    for (let i = 0; i < 20; i++) {
      let tempColsArray = [];

      for (let j = 0; j < 10; j++) {
        tempColsArray.push({
          id: `${i}.${j}`,
          isFilled: false,
          color: ""
        });
      }

      tempRowsArray.push(tempColsArray);
    }

    return tempRowsArray;
  };

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

    console.log('Next piece:', newPiece, 'remaining:', newStock);

    setStockedPieces(newStock);
    setNextPiece({
      type: newPiece,
      color: getRandomColor()
    });
  };

  useEffect(() => {
    setField(generateField());
    getNextStockedPiece();
  }, []);

  return (
    <>
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