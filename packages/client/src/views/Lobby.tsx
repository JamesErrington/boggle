import React, { useState } from "react"
import type { FunctionComponent } from "react"

import { useBoggleDispatch, useSocketState } from "../hooks/context"

interface Props {}

export const Lobby: FunctionComponent<Props> = () => {
  const { code, isHost, players } = useSocketState()
  const dispatch = useBoggleDispatch()
  const [username, setUsername] = useState("")
  const [gameCode, setGameCode] = useState("")

  const hostButtonDisabled = username.length === 0
  const joinButtonDisabled = username.length === 0 || gameCode.length !== 4

  function handleHost() {
    dispatch({ type: "HostGame_Multi", payload: username })
  }

  function handleJoinGame() {
    dispatch({
      type: "JoinGame_Multi",
      payload: {
        username,
        code: gameCode
      }
    })
  }

  function handleStartGame() {
    dispatch({ type: "StartGame_Multi" })
  }

  return (
    <div className="lobby">
      <h2>Multiplayer</h2>

      {code && (
        <div className="lobby-players">
          <p>
            Game Code: <strong>{code}</strong>
          </p>
          <ul>
            {players.map(player => (
              <li key={player.id}>{player.username}</li>
            ))}
          </ul>{" "}
          {isHost && <button onClick={handleStartGame}>Start Game</button>}
        </div>
      )}
      {!code && (
        <>
          <div className="lobby-username">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>
          <div className="lobby-options">
            <button disabled={hostButtonDisabled} onClick={handleHost}>
              Host Game
            </button>
            <h3>OR</h3>
            <div className="lobby-code">
              <label>
                Game Code
                <input
                  type="text"
                  value={gameCode}
                  onChange={event => setGameCode(event.target.value)}
                />
              </label>
              <button disabled={joinButtonDisabled} onClick={handleJoinGame}>
                Join Game
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
