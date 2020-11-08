import { Machine, assign } from "xstate"

import { _generateLobbyCode } from "../utils"
import type { Player } from "../shared/types"

interface MachineContext {
  code: string
  players: Player[]
}

interface MachineStateSchema {
  states: {
    preLobby: {}
    inLobby: {}
    gameStarting: {}
    gameLive: {}
    gameBreakdown: {}
  }
}

type MachineEvent =
  | { type: "CREATE_GAME"; payload: Player }
  | { type: "JOIN_GAME"; payload: Player }

const generateGame = assign<MachineContext, MachineEvent>({
  players: (context, event) => [...context.players, event.payload],
  code: () => _generateLobbyCode()
})

const addPlayer = assign<MachineContext, MachineEvent>({
  players: (context, event) => [...context.players, event.payload]
})

const gameMachine = Machine<MachineContext, MachineStateSchema, MachineEvent>({
  id: "game",
  initial: "preLobby",
  context: {
    code: "",
    players: []
  },
  states: {
    preLobby: {
      on: {
        CREATE_GAME: {
          target: "inLobby",
          actions: generateGame
        }
      }
    },
    inLobby: {
      on: {
        JOIN_GAME: {
          actions: addPlayer
        }
      }
    },
    gameStarting: {},
    gameLive: {},
    gameBreakdown: {}
  }
})
