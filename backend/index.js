// console.log("test");
// const express = require('express');
// const ws = require('ws');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set up a headless websocket server that prints any
// // events that come in.
// const wsServer = new ws.Server({ noServer: true });
// wsServer.on('connection', socket => {
//   socket.on('message', message => console.log(message));
// });

// // `server` is a vanilla Node.js HTTP server, so use
// // the same ws upgrade process described here:
// // https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
// // const server = app.listen(3000);


// app.use("/", require("./routes"));

// const server = app.listen(PORT,()=>{
//     console.log(`Test server running on port: ${PORT}`);
// });
// server.on('upgrade', (request, socket, head) => {
//   wsServer.handleUpgrade(request, socket, head, socket => {
//     wsServer.emit('connection', socket, request);
//   });
// });

// let sockets = [];
// server.on('connection', function(socket) {
//   sockets.push(socket);

//   // When you receive a message, send that message to every socket.
//   socket.on('message', function(msg) {
//     sockets.forEach(s => s.send(msg));
//   });

//   // When a socket closes, or disconnects, remove it from the array.
//   socket.on('close', function() {
//     sockets = sockets.filter(s => s !== socket);
//   });
// });
// const constantData = require ('../constants.js');
import constantData from '../constants.js';
// const WebSocket = require('ws');/
import  WebSocket  from "./node_modules/ws/index.js";
console.log(WebSocket.version);
const server = new WebSocket.Server({
  port: 3000
});
let pns = 0;
let players = {};
let game = [];
let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);
  console.log("dingus is connected, now we can set him up to play");
  players[pns] = {
    name:"",
    socket:socket,
  }
  socket.send(JSON.stringify({pns}));
  console.log("note: dingus's id is ",pns);
  pns++;
  // console.log(players);ss

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {
    let recievedData = ""+msg;
    while(typeof recievedData === "string") {
      console.log("type", typeof recievedData);
      if(typeof recievedData != "[object Object]")
      {
        recievedData = (JSON.parse(""+recievedData));

      }
    }
    console.log("data ", recievedData);
    if(recievedData.ingame) {
      console.log("dingus plays game, friend is there, send the message, watch them play.");
      console.log("player 1 id:", recievedData.players[0]);
      console.log("player 2 id:", recievedData.players[1]);
      // if(recievedData.players[0]==recievedData.turn)
      players[recievedData.players[0]].socket.send(JSON.stringify(recievedData))
      players[recievedData.players[1]].socket.send(JSON.stringify(recievedData))
      // players[recievedData.turn].socket.send(JSON.stringify(recievedData))
      // sockets.forEach(s => {
      // });
    } else {
      if(game.length == 1) {
        console.log("dingus wants game, friend is there, set them up, now they can play.");
        const gameData = ({
          players: [game[0].id,recievedData.id],
          player1loadout:game[0].loadout,
          player2loadout:recievedData.loadout,
          player1hp:100,
          player2hp:100,
          turn:game[0].id,
          gameStatus:"starting",
          origin: "server",
          id:recievedData.id,
        });
        console.log("id:",game[0].id);
        players[game[0].id].socket.send(JSON.stringify(gameData));
        game.splice(0,1);
        players[recievedData.id].socket.send(JSON.stringify(gameData));
      } else {
        console.log("dingus wants game, no one there. wait for friend, add to game");
        game.push((recievedData));
      }
    }
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});