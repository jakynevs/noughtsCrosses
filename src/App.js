import React, { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, fill }) {
  const boardLength = 3
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const i = boardLength * row + col
      return (
        <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        ></Square>
      )
    })
    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )
  })
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = fill;

    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + " wins!";
  } else {
    status = "next turn: " + fill;
  }

  return (
    <div>
      <div className="status">{status}</div>
      {boardRows}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [count, setCount] = useState(0);
  const fill = count % 2 === 0 ? "O" : "X";
  const currentSquares = history[count];
  let currentMove = count
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, count + 1), nextSquares];
    setHistory(nextHistory);
    setCount(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCount(nextMove);
  }

  const moves = history.map((_squares, move) => {
    let description;
    move > 0
      ? (description = "Go to move " + move)
      : (description = "Go to start");
    return (
      <li key={move}>
        {move === currentMove ? (
          <>You are at move #{move}</>
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
        <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}
