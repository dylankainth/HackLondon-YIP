import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { nanoid } from 'nanoid';

config();

const CORS_ORIGIN_BASE_URL = process.env.CORS_ORIGIN_BASE_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN_BASE_URL },
});

interface Progress {
  text: string,
  time: number
}

interface IRoom {
  [key: string]: { socketId: string, nickname: string, progress: Progress[] }[];
}

interface ISignalDto {
  roomId: string,
  nickname: string
}

interface ITimelineUpdate {
  roomId: string,
  nickname: string,
  progressInput: string
}

interface SearchMap {
  [key: string]: string[]
}

const searchMap: SearchMap = {};
const rooms: IRoom = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', (args: ISignalDto) => {
    console.log('someone joined');
    const { roomId, nickname } = args;

    if (rooms[roomId]) rooms[roomId].push({ socketId: socket.id, nickname, progress: [] });
    else rooms[roomId] = [{ socketId: socket.id, nickname,progress: [] }];
    const otherUser = rooms[roomId].find((item) => item.socketId !== socket.id);

    if (otherUser && otherUser.socketId !== socket.id) {
      // Peer 2 -> Peer 1 (notify the caller that Peer 2 just joined the room)
      socket.to(otherUser.socketId).emit('userJoined', { otherUserSocketId: socket.id, otherUserNickname: nickname });
      socket.emit('waitingToBeAcceptedBy', otherUser.nickname);
    }
    console.log('joinRoom rooms: ', rooms);
  });

  socket.on('callAccepted', (args: ISignalDto) => {
    const { roomId, nickname } = args;

    const room = rooms[roomId];
    if (room) {
      const otherUser = room.find((item) => item.socketId !== socket.id);
      if (otherUser) {
        // Peer 1 -> Peer 1 (gets the information about the receiver Peer 2)
        socket.emit('otherUserId', { otherUserSocketId: otherUser.socketId, otherUserNickname: otherUser.nickname });
        // Peer 1 -> Peer 2 (notify Peer 2 about the caller)
        socket.to(otherUser.socketId).emit('acceptedBy', nickname);
      }
    }
    else{
      console.log('roomid not found ', roomId);
    }
  });

  socket.on('timelineUpdate', (args: ITimelineUpdate) => {
    const { roomId, nickname, progressInput } = args;
    const room = rooms[roomId];
    const progressEntry = { text: progressInput, time: Date.now() };
    const participant = room.find((participant) => participant.nickname === nickname);
    if (participant) {
      participant.progress.push(progressEntry);
    }
    console.log('timelineUpdate rooms: ', rooms);
    // Notify all participants except the sender


    fetch("http://localhost:8000/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({text: progressInput})
    }).then(response => response.json())
    .then(data => {
      console.log("results:", data);
      io.to(socket.id).emit('summaryResult', {text: data['summary'],time: Date.now()});
      room.forEach(({ socketId }) => {
        if (socketId !== socket.id) {
          io.to(socketId).emit('opponentUpdate', {text: data['summary'],time: Date.now()});
        }
      });
    })
    .catch(error => console.error("Error posting progress:", error));

  });

  socket.on('generateResults',(roomId: string) => {
    const room = rooms[roomId];
    if (room){
      console.log("room:",roomId);

      fetch("http://localhost:8000/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({room: room.slice(0,2)})
      }).then(response => response.json())
      .then(data => {
        console.log("results:", data);
        room.forEach(({ socketId }) => {
          io.to(socketId).emit('resultsReceived', data);
        });
      })
      .catch(error => console.error("Error posting progress:", error));
      
    }

  });
  
  socket.on('searchRoom', (searchTerm: string) => { 
    if (!searchMap[searchTerm]) {
      // No socket for this search term; add the current socket id
      searchMap[searchTerm] = [socket.id];
      console.log(`Added ${socket.id} to searchMap under term "${searchTerm}"`);
    } else {
      // There exists at least one socket id; remove the last one from the array
      const removedSocketId = searchMap[searchTerm].pop()!;
      if (removedSocketId === socket.id) {
        // If the last socket id was the same as the current one, do nothing
        searchMap[searchTerm].push(removedSocketId);
        //console.log(`Did not remove ${removedSocketId} from searchMap for term "${searchTerm}"`);
      } else {
        // If the last socket id was different, notify both sockets that a room has been found
        const roomId = nanoid(8);
        io.to(removedSocketId).emit('roomFound', roomId);
        socket.emit('roomFound', roomId);
        console.log(`Found a room for term "${searchTerm}" with sockets ${socket.id} and ${removedSocketId}`);
      }
    }
  });

  /**
   * Signaling
   * Just passing DTOs from one peer to another
   */
  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ICECandidate', (payload) => {
    io.to(payload.target).emit('ICECandidate', payload.candidate);
  });

  /**
   * on disconnect - reject call utilities
   */
  socket.on('disconnect', (reason: string) => {
    let roomId: string | null = null;
    for (let id in rooms) {
      const found = rooms[id].find(item => item.socketId === socket.id);
      if (found) {
        roomId = id;
        break;
      }
    }
    if (roomId) {
      const room = rooms[roomId];
      const otherUser = room.find((item) => item.socketId !== socket.id);
      rooms[roomId] = rooms[roomId].filter(el => el.socketId !== socket.id);
      // notify the other user about disconnection
      if (otherUser) socket.to(otherUser.socketId).emit('otherUserDisconnected', otherUser.nickname);
    }
    console.log('disconnect rooms: ', rooms);
  });

  socket.on('callRejected', (args: ISignalDto) => {
    const { roomId, nickname } = args;

    const otherUser = rooms[roomId].find(el => el.socketId !== socket.id);
    if (otherUser) {
      rooms[roomId] = rooms[roomId].filter(el => el.socketId !== otherUser.socketId);
      socket.to(otherUser.socketId).emit('callRejected', nickname);
    }
    console.log('callRejected rooms: ', rooms);
  });



});

httpServer.listen(PORT, () =>
  console.log(`server is running on port: ${PORT}`),
);
