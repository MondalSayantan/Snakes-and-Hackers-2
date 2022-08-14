import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import Box from "../components/Box";
import io from "socket.io-client";
import queryString from "query-string";
import "./game.css";
import { playerTurn } from "../utils/randomCodeGenerator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../App";

let socket;

function Game() {
  const data = queryString.parse(window.location.search);
  const room = data.roomCode;
  const navigate = useNavigate();

  const [amazonTitle] = useState(localStorage.getItem("amazonTitle"));
  const [amazonPrice] = useState(localStorage.getItem("amazonPrice"));
  const [amazonImage] = useState(localStorage.getItem("amazonImage"));
  const [amazonUrl] = useState(localStorage.getItem("amazonUrl"));
  const [currentName] = useState(localStorage.getItem("name"));
  const [currentEmail] = useState(localStorage.getItem("email"));

  const [oppAmazonTitle, setOppAmazonTitle] = useState("");
  const [oppAmazonPrice, setOppAmazonPrice] = useState("");
  const [oppAmazonImage, setOppAmazonImage] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Email, setP1Email] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Email, setP2Email] = useState("");
  const [p1AmazonUrl, setP1AmazonUrl] = useState("");
  const [p2AmazonUrl, setP2AmazonUrl] = useState("");

  const [reset, setReset] = useState(false);
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [first, setFirst] = useState();

  useEffect(() => {
    if (users.length === 2) {
      if (currentUser === "Player 1") {
        setOppAmazonTitle(users[1].amazonTitle);
        setOppAmazonPrice(users[1].amazonPrice);
        setOppAmazonImage(users[1].amazonImage);
        setP1Name(users[0].userName);
        setP1Email(users[0].userEmail);
        setP2Name(users[1].userName);
        setP2Email(users[1].userEmail);
        setP1AmazonUrl(users[0].amazonUrl);
        setP2AmazonUrl(users[1].amazonUrl);
      } else {
        setOppAmazonTitle(users[0].amazonTitle);
        setOppAmazonPrice(users[0].amazonPrice);
        setOppAmazonImage(users[0].amazonImage);
        setP1Name(users[0].userName);
        setP1Email(users[0].userEmail);
        setP2Name(users[1].userName);
        setP2Email(users[1].userEmail);
        setP1AmazonUrl(users[0].amazonUrl);
        setP2AmazonUrl(users[1].amazonUrl);
      }
    } else return;
  }, [users]);

  useEffect(() => {
    if (!amazonUrl) {
      if (users.length === 0) {
        navigate("/create");
      }
    }
    const connectionOptions = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    socket = io.connect(endpoint, connectionOptions);

    socket.emit(
      "join",
      {
        room: room,
        amazonTitle: amazonTitle,
        amazonPrice: amazonPrice,
        amazonImage: amazonImage,
        amazonUrl: amazonUrl,
        userName: currentName,
        userEmail: currentEmail,
      },
      (error) => {
        if (error) setRoomFull(true);
      }
    );

    return function cleanup() {
      socket.emit("disconnectroom");
      socket.off();
      localStorage.clear();
    };
  }, []);

  //initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [boardData, setBoardData] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    const x = playerTurn();
    setFirst(x);
    socket.emit("initialize", {
      gameOver: false,
      turn: x,
    });
    console.log("initialize");
  }, []);

  useEffect(() => {
    socket.on("initialize", ({ gameOver, turn }) => {
      setGameOver(gameOver);
      setTurn(turn);
    });

    socket.on(
      "update",
      ({ gameOver, winner, turn, boardData, id, current }) => {
        gameOver && setGameOver(gameOver);
        winner && setWinner(winner);
        turn && setTurn(turn);
        boardData && setBoardData(boardData);
        id && (document.getElementById(id).innerText = current);
      }
    );

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    socket.on("currentUserData", ({ name }) => {
      setCurrentUser(name);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const resetBoard = () => {
    setReset(true);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message: message }, () => {
        setMessage("");
      });
    }
  };

  const draw = (event, index) => {
    if (boardData[index - 1] === "" && winner === "") {
      const current = turn === "Player 1" ? "X" : "O";
      boardData[index - 1] = current;
      event.target.innerText = current;
      const newTurn = turn === "Player 1" ? "Player 2" : "Player 1";
      setTurn(newTurn);
      socket.emit("update", {
        boardData: boardData,
        id: event.target.id,
        current: current,
        turn: newTurn,
      });
    }
  };

  const onEndClick = async (e) => {
    e.preventDefault();
    let winnerAmazonUrl;
    let senderEmail;
    let fromName;
    if (winner === p1Name) {
      winnerAmazonUrl = p1AmazonUrl;
      senderEmail = p2Email;
      fromName = p1Name;
    } else if (winner === p2Name) {
      winnerAmazonUrl = p2AmazonUrl;
      senderEmail = p1Email;
      fromName = p2Name;
    }
    const data = {
      toEmail: senderEmail,
      amazonUrl: winnerAmazonUrl,
      fromName: fromName,
    };
    try {
      const res = await axios.post(`${endpoint}/api/email`, data);
      if (res.status === 200) {
        alert("Email sent!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (users.length === 1) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center flex-col">
        <h1 className="text-white text-3xl mb-5">Room Code: {room}</h1>
        <h1 className="text-white text-3xl">Waiting for Player 2...</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-between">
      <div className="h-screen w-full">
        <div className={`winner ${winner !== "" ? "" : "shrink"}`}>
          <div className="p-5 font-bold text-3xl text-white">
            {winner} Wins!
          </div>
          <div className="flex justify-around items-center w-full">
            <button onClick={() => resetBoard()}>Reset Board</button>
            <button onClick={onEndClick}>End Game</button>
          </div>
        </div>
        <div className="h-screen w-full justify-around items-center bg-black flex flex-col ">
          <h1 className="text-white text-center">{`Room Code: ${room}`}</h1>

          {turn === currentUser ? (
            <div className="flex w-4/5 items-start justify-between ">
              <h1 className="text-white text-center">Your Turn</h1>
              <div></div>
            </div>
          ) : (
            <div className="flex w-4/5 items-start justify-between ">
              <div></div>
              <h1 className="text-white text-center">Opponent's Turn</h1>
            </div>
          )}

          <Board
            setWinner={setWinner}
            boardData={boardData}
            draw={draw}
            turn={turn}
            currentUser={currentUser}
            p1Name={p1Name}
            p2Name={p2Name}
          />
          <Box
            currentUser={currentUser}
            amazonPrice={amazonPrice}
            amazonTitle={amazonTitle}
            amazonImage={amazonImage}
            oppAmazonPrice={oppAmazonPrice}
            oppAmazonTitle={oppAmazonTitle}
            oppAmazonImage={oppAmazonImage}
            first={first}
            boardData={boardData}
            users={users}
          />
        </div>
      </div>
      <div className="bg-blue-700 h-screen w-2/6">
        <div className="flex flex-col justify-between  h-full">
          <div className="flex flex-col text-white">
            <h1 className="text-center text-3xl font-bold">CHAT</h1>
            {messages.map((msg) => {
              console.log(msg);
              if (msg.user === currentUser)
                return (
                  <div className="w-full flex justify-end  p-3">
                    <div className="bg-green-700 w-1/2 p-2 border rounded-md">
                      {msg.text}
                    </div>
                  </div>
                );
              else
                return (
                  <div className=" w-full flex justify-start mt-2 p-3">
                    <div className="bg-orange-700 w-1/2 p-2 border rounded-md">
                      {msg.text}
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Enter message"
              id="message"
              className="w-full rounded-lg m-1 p-1"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
