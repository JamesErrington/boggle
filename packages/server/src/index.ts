import express from "express"
import http from "http"
import socketio from "socket.io"

import { generateLobby } from "./utils"
import { Lobby, LobbyState } from "../../shared/types"

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
    username: query.username
  }

  if (query.create) {
    lobby = generateLobby(player, Object.keys(lobbies))
    lobbies[lobby.code] = lobby
  } else {
    lobby = lobbies[query.code]
    lobby.players.push(player)
  }

  const { code, hostId, state, players } = lobby
  console.log(`[socket] Connection established to ${id} in room '${code}'`)

  socket.on("start", (data: any) => {
    const { code } = data
    const lobby = lobbies[code]

    console.log(
      `[socket] Start request recieved for room '${code}' from ${socket.id}`
    )

    lobby.state = LobbyState.InGame

    io.to(code).emit("update", {
      type: "StartGame",
      payload: lobby.currentGame.board
    })
  })

  socket.join(code)
  io.to(id).emit("update", {
    type: "HostGame",
    payload: {
      code,
      player,
      state,
      isHost: id === hostId
    }
  })
  io.to(code).emit("update", {
    type: "UpdatePlayers",
    payload: players
  })
})

server.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`)
})
