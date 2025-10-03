import { useState, useEffect, useRef } from "react";
import "./board.css";

const Board = ({
  setWinner,
  boardData,
  draw,
  turn,
  currentUser,
  p1Name,
  p2Name,
}) => {
  const boardRef = useRef(null);
  const [boardDisabled, setBoardDisabled] = useState(false);

  useEffect(() => {
    if (currentUser === turn) setBoardDisabled(false);
    else setBoardDisabled(true);
  });

  const checkRow = () => {
    return [0, 3, 6].some(
      i => boardData[i] === boardData[i + 1] &&
           boardData[i] === boardData[i + 2] &&
           boardData[i] !== ""
    );
  };
  const checkCol = () => {
    let ans = false;
    for (let i = 0; i < 3; i++) {
      ans |=
        boardData[i] === boardData[i + 3] &&
        boardData[i] === boardData[i + 6] &&
        boardData[i] !== "";
    }
    return ans;
  };

  const checkDiagonal = () => {
    return (
      (boardData[0] === boardData[4] &&
        boardData[0] === boardData[8] &&
        boardData[0] !== "") ||
      (boardData[2] === boardData[4] &&
        boardData[2] === boardData[6] &&
        boardData[2] !== "")
    );
  };

  const checkWin = () => {
    return checkRow() || checkCol() || checkDiagonal();
  };

  const checkTie = () => {
    let count = 0;
    boardData.forEach((cell) => {
      if (cell !== "") {
        count++;
      }
    });
    return count === 9;
  };

  if (checkWin()) {
    setWinner(turn === "Player 1" ? p2Name : p1Name);
  } else if (checkTie()) {
    setWinner("It's a Tie!");
  }

  const handleBoardClick = (event) => {
    if (boardDisabled) return;
    checkWin();
    draw(event, event.target.id);
    return;
  };

  return (
    <div ref={boardRef} className="board">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className={`input input-${i + 1}`}
          id={String(i + 1)}
          onClick={handleBoardClick}
        ></div>
      ))}
    </div>
  );
};

export default Board;
