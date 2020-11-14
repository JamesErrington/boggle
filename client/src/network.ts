// @ts-ignore
import client from "socket.io-client/dist/socket.io.js"
import type { Socket } from "socket.io-client"
import type {
  GenerateGameResponse,
  Word,
  SocketConnectionQuery,
  StartGameQuery,
  FoundWordsQuery,
  ReadyQuery
} from "../../shared/types"

export async function getSoloGame(): Promise<GenerateGameResponse> {
  const response = await fetch("/generate-game")
  return response.json() as Promise<GenerateGameResponse>
}

export function createSocket(query: SocketConnectionQuery): typeof Socket {
  return client({
    query
  })
}

export function emitReadyStatus(socket: typeof Socket, code: string, ready: boolean) {
  const body: ReadyQuery = { code, ready: ready ? "true" : "false" }
  socket.emit("ready", body)
}

export function requestStartGame(socket: typeof Socket, code: string) {
  const body: StartGameQuery = { code }
  socket.emit("start", body)
}

export function submitFoundWords(socket: typeof Socket, code: string, foundWords: Word[]) {
  const body: FoundWordsQuery = { code, foundWords }
  socket.emit("found", body)
}
