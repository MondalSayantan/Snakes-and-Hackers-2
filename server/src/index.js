const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.options("*", cors());

const users = [];

const addPlayer = ({
  id,
  name,
  room,
  amazonTitle,
  amazonPrice,
  amazonImage,
  amazonUrl,
  userName,
  userEmail,
}) => {
  const numberOfUsersInRoom = users.filter((user) => user.room === room).length;
  if (numberOfUsersInRoom === 2) return { error: "Room full" };

  const newUser = {
    id,
    name,
    room,
    amazonTitle,
    amazonPrice,
    amazonImage,
    amazonUrl,
    userName,
    userEmail,
  };
  users.push(newUser);
  return { newUser };
};

const removePlayer = (id) => {
  const removeIndex = users.findIndex((user) => user.id === id);

  if (removeIndex !== -1) return users.splice(removeIndex, 1)[0];
};

const getPlayer = (id) => {
  return users.find((user) => user.id === id);
};

const getPlayersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

app.use("/api", routes);

io.on("connection", (socket) => {
  socket.on("join", (data, callback) => {
    let numberOfUsersInRoom = getPlayersInRoom(data.room).length;

    const { error, newUser } = addPlayer({
      id: socket.id,
      name: numberOfUsersInRoom === 0 ? "Player 1" : "Player 2",
      room: data.room,
      amazonTitle: data.amazonTitle,
      amazonPrice: data.amazonPrice,
      amazonImage: data.amazonImage,
      amazonUrl: data.amazonUrl,
      userName: data.userName,
      userEmail: data.userEmail,
    });

    if (error) return callback(error);

    socket.join(newUser.room);

    io.to(newUser.room).emit("roomData", {
      room: newUser.room,
      users: getPlayersInRoom(newUser.room),
    });
    socket.emit("currentUserData", { name: newUser.name });
    callback(); // callback is used to send data back to the client || So Cool !!
  });

  socket.on("initialize", (gameState) => {
    const user = getPlayer(socket.id);
    if (user) io.to(user.room).emit("initialize", gameState);
  });

  socket.on("update", (gameState) => {
    const user = getPlayer(socket.id);
    if (user) io.to(user.room).emit("update", gameState);
  });

  socket.on("sendMessage", (data, callback) => {
    const user = getPlayer(socket.id);
    io.to(user.room).emit("message", {
      user: user.name,
      text: data.message,
    });
    callback();
  });

  socket.on("disconnectroom", () => {
    const user = removePlayer(socket.id);
    if (user)
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getPlayersInRoom(user.room),
      });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
