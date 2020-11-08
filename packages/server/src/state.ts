import express from "express"
import http from "http"
import socketio from "socket.io"

import { createPlayer, createLobby } from "./shared/utils"
import { Lobby } from "./shared/types"

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = 8000
const lobbies: Record<string, Lobby> = {}

interface ConnectionQuery {
  username: string
  create?: boolean
  code?: string
}

io.on("connection", socket => {
  const { id } = socket
  const query: ConnectionQuery = socket.request._query

  const player = createPlayer(id, query.username)

  let lobby: Lobby
  if (query.create) {
    lobby = createLobby(player, Object.keys(lobbies))
  } else {
    const found = Object.entries(lobbies).find(([code]) => code === query.code)
    if (found) {
      lobby = found[1]
    } else {
      throw new Error(`No lobby found with code ${query.code}`)
    }
  }

  const { code, hostId, state, players } = lobby
  console.log(`[socket] Connection established to ${id} in room '${code}'`)

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
