/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

/***********************************
  Sqaure Component
***********************************/
function Square({ value, onClickSquare, isMatchedSquare }) {
  return (
    <button
      onClick={onClickSquare}
      className={`h-12 w-12 border border-[#000]/80 m-1 leading-9 ${
        isMatchedSquare ? "bg-green-600 text-white" : "bg-white text-[#000]"
      } text-xl`}
    >
      {value}
    </button>
  );
}

/***********************************
  Game Board Component
***********************************/
function Board({ xIsNext, isDraw, squares, handlePlay, ResetGame }) {
  const matchedPositins = calculateWinner(squares).matchingPositions;
  const winner = calculateWinner(squares).player;
  let status;

  // Make status
  if (winner && !isDraw) {
    status = `Winner is ${winner}`;
  } else if (isDraw) {
    status = "Game Draw";
  } else {
    status = `Player Turn: ${xIsNext ? "X" : "O"}`;
  }

  const onClickSquare = (index) => {
    const nextSquares = squares.slice();
    if (squares[index] || winner) {
      return;
    } else {
      if (xIsNext) {
        nextSquares[index] = "X";
      } else {
        nextSquares[index] = "O";
      }
      handlePlay(nextSquares);
    }
  };

  // Matching Square box
  const isMatchedSquare = (index) => {
    if (matchedPositins?.length > 0) {
      return matchedPositins.includes(index);
    } else {
      return false;
    }
  };

  return (
    <>
      <h5 className="text-xl font-bold">{status}</h5>
      <div className="flex">
        <Square
          value={squares[0]}
          onClickSquare={() => onClickSquare(0)}
          isMatchedSquare={isMatchedSquare(0)}
        />
        <Square
          value={squares[1]}
          onClickSquare={() => onClickSquare(1)}
          isMatchedSquare={isMatchedSquare(1)}
        />
        <Square
          value={squares[2]}
          onClickSquare={() => onClickSquare(2)}
          isMatchedSquare={isMatchedSquare(2)}
        />
      </div>
      <div className="flex">
        <Square
          value={squares[3]}
          onClickSquare={() => onClickSquare(3)}
          isMatchedSquare={isMatchedSquare(3)}
        />
        <Square
          value={squares[4]}
          onClickSquare={() => onClickSquare(4)}
          isMatchedSquare={isMatchedSquare(4)}
        />
        <Square
          value={squares[5]}
          onClickSquare={() => onClickSquare(5)}
          isMatchedSquare={isMatchedSquare(5)}
        />
      </div>
      <div className="flex">
        <Square
          value={squares[6]}
          onClickSquare={() => onClickSquare(6)}
          isMatchedSquare={isMatchedSquare(6)}
        />
        <Square
          value={squares[7]}
          onClickSquare={() => onClickSquare(7)}
          isMatchedSquare={isMatchedSquare(7)}
        />
        <Square
          value={squares[8]}
          onClickSquare={() => onClickSquare(8)}
          isMatchedSquare={isMatchedSquare(8)}
        />
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={ResetGame}
          className="bg-red-600 hover:bg-red-500 px-[20px] py-[6px] text-md text-white rounded-[6px] font-bold"
        >
          Reset
        </button>
      </div>
    </>
  );
}

/***********************************
  Game History Component
***********************************/
function History({ histories }) {
  return (
    <div className="border border-gray-600 p-3 rounded-[8px]">
      <ol>{histories}</ol>
    </div>
  );
}

/***********************************
  Main Game Component
***********************************/
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDraw, setIsDraw] = useState(false);

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    setXIsNext(!xIsNext);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    const newHistory = [...history.slice(0, move + 1)];
    setHistory(newHistory);
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  useEffect(() => {
    if (history?.length === 10 && !calculateWinner(currentSquares).player) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
  }, [currentSquares, history]);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to the move # ${move}`;
    } else {
      description = `Go to start the game`;
    }
    return (
      <li
        key={move}
        className="bg-gray-700 text-white mb-1 py-1.5 px-3 rounded-[5px]"
      >
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function ResetGame() {
    setHistory([Array(9).fill(null)]);
    setXIsNext(true);
    setCurrentMove(0);
  }

  return (
    <>
      <h3 className="text-center text-2xl font-bold text-green-500 mt-[50px] mb-[30px]">Tic Tac Toe</h3>
      <div className="flex justify-center space-x-10">
        <div>
          <Board
            xIsNext={xIsNext}
            isDraw={isDraw}
            squares={currentSquares}
            handlePlay={handlePlay}
            ResetGame={ResetGame}
          />
        </div>
        <div>
          <h4 className="mb-1.5">Game History</h4>
          <History histories={moves} />
        </div>
      </div>
    </>
  );
}

/***********************************
  calculate the winner function
***********************************/
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
      return {
        player: squares[a],
        matchingPositions: [a, b, c],
      };
    }
  }
  return {
    player: null,
    matchingPositions: [],
  };
}
