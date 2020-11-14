import React from "react"
import type { FunctionComponent } from "react"

import { useAppState } from "../context"
import { emitReadyStatus } from "../network"
import { NewGameButton } from "./NewGameButton"

export const LobbyStart: FunctionComponent = () => {
  const { code, players, isHost, player, socket, allAreReady } = useAppState()
  const notReady = players.filter(lobbyPlayer => lobbyPlayer.ready === false).map(lobbyPlayer => lobbyPlayer.username)

  function handleReadyClicked() {
    if (socket && player) {
      emitReadyStatus(socket, code, !player.ready)
    }
  }

  return (
    <div className="lobby-players">
      <p>
        Game Code: <strong>{code}</strong>
      </p>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>{" "}
      {!isHost && <button onClick={handleReadyClicked}>{player?.ready ? "Not Ready" : "Ready"}</button>}
      {isHost && <NewGameButton label="Start Game" singlePlayer={false} enabled={allAreReady} />}
      {allAreReady === false && <p>Waiting for {notReady.join(", ")}</p>}
    </div>
  )
}
