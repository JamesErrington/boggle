import express from "express"
import http from "http"
import morgan from "morgan"
import path from "path"
import { Server as SocketServer } from "socket.io"

import { handleGenerateGame, handleSocketConnection } from "./routes"
import { loadDictionary } from "./utils"

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)
const PORT = process.env.PORT || 8000

app.use(morgan("short"))

app.use(express.static(path.join(__dirname, "static")))

app.locals.io = io
app.locals.dictionary = loadDictionary()
app.locals.lobbies = {}

app.get("/generate-game", handleGenerateGame)

io.on("connection", handleSocketConnection(app))

server.listen(PORT, () => {
  console.log(`[server] Server running on port ${PORT}`)
})
