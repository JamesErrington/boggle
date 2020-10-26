import express from "express"
import http from "http"
import socketio, { Socket } from "socket.io"

import { generateLobby } from "./utils"
import { Lobby, LobbyStatus } from "./types"

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = 8000

const lobbies: Record<string, Lobby> = {}

io.on("connection", socket => {
  const { id } = socket
  const query = socket.request._query

  let lobby: Lobby
  const player = {
    id,
    name: query.name
  }

  if(query.create) {
    lobby = generateLobby(player, Object.keys(lobbies))
    lobbies[lobby.code] = lobby
  } else {
    lobby = lobbies[query.code]
    lobby.players.push(player)
  }

  const { code, hostId, status, players } = lobby
  console.log(
    `[socket] Connection established to ${id} in room '${code}'`
  )

  socket.on("start", (data: any) => {
    const { code } = data
    const lobby = lobbies[code]
  
    console.log(`[socket] Start request recieved for room '${code}' from ${socket.id}`)
  
    lobby.status = LobbyStatus.INGAME
  
    io.to(code).emit("update", {
      status: lobby.status,
      currentGame: lobby.currentGame
    })
  })

  socket.join(code)
  io.to(id).emit("update", {
    code,
    status,
    player,
    isHost: id === hostId
  })
  io.to(code).emit("update", {
    players
  })
})


server.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`)
})
