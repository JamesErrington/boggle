import { Express, Request, Response } from "express"
import type { Server as SocketServer, Socket } from "socket.io"

import {
  setupGame,
  findOrCreateLobby,
  findLobby,
  processMultiplayerFoundWords,
  calculateMultiplayerScores,
  resetLobby,
  findPlayer
} from "./utils"
import type {
  GenerateGameResponse,
  Player,
  SocketConnectionQuery,
  Lobby,
  FoundWords,
  SocketUpdate,
  NoLobbyError,
  UsernameTakenError,
  ReadyQuery,
  StartGameQuery,
  FoundWordsQuery,
  Result
} from "../../shared/types"

export function handleGenerateGame(request: Request, response: Response<GenerateGameResponse>) {
  const { board, words, totalWordCount, totalWordScore } = setupGame(request.app.locals.dictionary)

  response.status(200).send({
    board,
    words,
    totalWordCount,
    totalWordScore
  })
}

export function handleSocketConnection(app: Express) {
  return function (socket: Socket) {
    const { io, lobbies } = app.locals
    const { id } = socket
    // @ts-ignore
    const query: SocketConnectionQuery = socket.request._query
    console.log(`[socket] Recieved connection request from client ${id}: ${JSON.stringify(query)}`)

    const player: Player = {
      id,
      username: query.username,
      points: 0,
      ready: false
    }

    const lobby = findOrCreateLobby(query, player, lobbies)
    if (lobby === undefined) {
      _emitNoLobbyError(io, id, query.code)
      return
    }
    if (lobby === null) {
      _emitUsernameTakenError(io, id, player.username)
      return
    }

    if (lobby.host === id) {
      player.ready = true
    }

    socket.on("ready", _handleReady(app, socket))
    socket.on("start", _handleStartGame(app, socket))
    socket.on("found", _handleFound(app, socket))

    socket.join(lobby.code)
    _emitLobbyState(io, id, player, lobby)
    _emitPlayers(io, lobby.code, lobby.players)
  }

  function _handleReady(app: Express, socket: Socket) {
    const { io, lobbies } = app.locals
    const { id } = socket
    return function (readyQuery: ReadyQuery) {
      const room = readyQuery.code
      const lobby = findLobby(room, lobbies)
      if (lobby === undefined) {
        _emitNoLobbyError(io, id, room)
        return
      }
      const player = findPlayer(id, lobby.players)
      player.ready = readyQuery.ready === "true"
      _emitPlayers(io, room, lobby.players)
    }
  }

  function _handleStartGame(app: Express, socket: Socket) {
    const { io, lobbies, dictionary } = app.locals
    const { id } = socket
    return function (startQuery: StartGameQuery) {
      const room = startQuery.code
      console.log(`[socket] Recieved request from ${id} to start game ${room}`)
      const { board, words, totalWordCount, totalWordScore } = setupGame(dictionary)
      const lobby = findLobby(room, lobbies)
      if (lobby === undefined) {
        _emitNoLobbyError(io, id, room)
        return
      }

      const player = findPlayer(id, lobby.players)
      player.ready = false
      resetLobby(lobby)
      _emitStartGame(io, room, {
        type: "StartGame",
        payload: {
          board,
          words,
          totalWordCount,
          totalWordScore,
          timeLeft: lobby.timeLeft,
          player
        }
      })

      const timer = setInterval(() => {
        if (lobby.timeLeft > 0) {
          lobby.timeLeft--
          _emitTimerTick(io, room, lobby.timeLeft)
        } else {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}

function _handleFound(app: Express, socket: Socket) {
  const { io, lobbies } = app.locals
  const { id } = socket
  return function (foundWordsQuery: FoundWordsQuery) {
    const { code: room, foundWords } = foundWordsQuery
    console.log(`[socket] Recieved ${foundWords.length} words from ${id} in game ${room}`)

    const lobby = findLobby(room, lobbies)
    if (lobby === undefined) {
      _emitNoLobbyError(io, id, room)
      return
    }

    lobby.foundWords[id] = processMultiplayerFoundWords(lobby.foundWords, foundWords)

    if (Object.keys(lobby.foundWords).length === Object.keys(lobby.players).length) {
      console.log(`[socket] Sending results to game ${room}`)
      const result = calculateMultiplayerScores(lobby.foundWords)
      Object.keys(result.winners).forEach(winner => {
        const player = lobby.players.find(lobbyPlayer => lobbyPlayer.id === winner)
        if (player) {
          player.points += 1
        }
      })
      _emitFoundWords(io, room, lobby.foundWords, result, lobby.players)
    }
  }
}

function _emitLobbyState(socket: SocketServer, id: string, player: Player, lobby: Lobby) {
  const body: SocketUpdate = {
    type: "LobbyState",
    payload: {
      player,
      code: lobby.code,
      isHost: lobby.host === id
    }
  }
  socket.to(id).emit("update", body)
}

function _emitPlayers(socket: SocketServer, room: string, players: Player[]) {
  const body: SocketUpdate = {
    type: "Players",
    payload: players
  }
  socket.to(room).emit("update", body)
}

function _emitStartGame(socket: SocketServer, room: string, body: SocketUpdate) {
  socket.to(room).emit("update", body)
}

function _emitTimerTick(socket: SocketServer, room: string, timeLeft: number) {
  const body: SocketUpdate = {
    type: "TimerTick",
    payload: timeLeft
  }
  socket.to(room).emit("update", body)
}

function _emitFoundWords(
  socket: SocketServer,
  room: string,
  foundWords: Record<string, FoundWords>,
  result: Result,
  players: Player[]
) {
  const body: SocketUpdate = {
    type: "FoundWords",
    payload: {
      foundWords,
      result,
      players
    }
  }
  socket.to(room).emit("update", body)
}

function _emitNoLobbyError(socket: SocketServer, id: string, room: string | undefined) {
  const body: NoLobbyError = {
    type: "NoLobby",
    payload: {
      message: room ? `No lobby found with room ${room}` : "Unable to create lobby"
    }
  }
  socket.to(id).emit("error", body)
}

function _emitUsernameTakenError(socket: SocketServer, id: string, username: string) {
  const body: UsernameTakenError = {
    type: "UsernameTaken",
    payload: {
      message: `Username ${username} is already taken in that game`
    }
  }
  socket.to(id).emit("error", body)
}
