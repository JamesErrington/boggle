import React from "react"
import type { FunctionComponent } from "react"

import { useAppState } from "../context"

export const PlayerList: FunctionComponent = () => {
  const { player, players } = useAppState()
  return (
    <div className="player-list-container">
      <table>
        <thead>
          <tr>
            <th>Players</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map(lobbyPlayer => (
            <tr key={lobbyPlayer.id}>
              <td>
                {lobbyPlayer.username}
                {lobbyPlayer.id === player?.id && " (You)"}
              </td>
              <td>{lobbyPlayer.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
