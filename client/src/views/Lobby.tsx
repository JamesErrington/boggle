import React from "react"
import type { FunctionComponent } from "react"

import { LobbyJoin } from "../components/LobbyJoin"
import { LobbyStart } from "../components/LobbyStart"

import { useAppState } from "../context"

export const LobbyView: FunctionComponent = () => {
  const { code } = useAppState()

  const inLobby = code.length > 0

  return (
    <div className="lobby">
      {!inLobby && <LobbyJoin />}
      {inLobby && <LobbyStart />}
    </div>
  )
}
