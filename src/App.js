import React, { useState } from "react";

function Square({ value, onSquareClick, winning=false }) {
  let squareClass = "square" + 
      (winning ? " winning-square" : "")
      
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, fill }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    
    const nextSquares = squares.slice();
    nextSquares[i] = fill;
    
    onPlay(nextSquares, i);
  }
  
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo[0] : null;
  const winningLine = winnerInfo ? winnerInfo[1] : [];
  let status;
  if (winner) {
    status = winner + " wins!";
  } else {
    status = "next turn: " + fill;
  }
  
  const boardLength = 3
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const i = boardLength * row + col
      return (
        <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        winning={winningLine.includes(i)}
        ></Square>
      )
    })
    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )
  })
  return (
    <div>
      <div className="status">{status}</div>
        {boardRows}
    </div>
  );
}


export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), index: -1}]);
  const [count, setCount] = useState(0);
  const [ascending, setAscending] = useState(true)
  const displayOrder = !ascending ? 'Change order: Ascending' : 'Change order: Descending'
  const fill = count % 2 === 0 ? "O" : "X";
  const currentSquares = history[count].squares;
  let currentMove = count

  function toggleOrder() {
    setAscending(!ascending)
  }

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, count + 1), {squares: nextSquares, index: i}];
    setHistory(nextHistory);
    setCount(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCount(nextMove);
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    let moveDetails = ""
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      const symbol = turnInfo.index % 2 === 0 ? 'X' : 'O';
      moveDetails = ' - ' + symbol + '(' + row + ', ' + col + ')';
      description = "Go to move " + move + moveDetails
      } else {
        description = "Go to start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <>You are at move #{move}{moveDetails}</>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          fill={fill}
          count={count}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <div className='center'>
          <button onClick={toggleOrder}>
            {displayOrder}
          </button>
        </div>
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
