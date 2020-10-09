const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

const roomRouter = require("./routers/roomRouter");
const rootDir = require("./utils/rootDir");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(rootDir, "public")));

app.use("/peerjs", peerServer);

app.use(roomRouter);

io.on("connection", (socket) => {
    //when someone joins the room
    socket.on("join", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });
    socket.on("message", (msg, roomId) => {
        socket.to(roomId).broadcast.emit("message", msg);
    });
});

server.listen(port, () => {
    console.log("server is listening on port http://localhost:3000");
});
