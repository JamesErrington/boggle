import React from "react"
import type { FunctionComponent } from "react"

import { NewGameButton } from "./NewGameButton"
import { HowToPlayButton } from "./HowToPlayButton"

import { useAppState, useAppDispatch } from "../context"
import { GameType } from "../reducer"
import { formatResultString } from "../utils"
import { emitReadyStatus } from "../network"

export const GameControls: FunctionComponent = () => {
  const { socket, code, isPaused, timeLeft, gameType, result, player, players, isHost, allAreReady } = useAppState()
  const dispatch = useAppDispatch()

  const pauseDisabled = timeLeft <= 0
  const showSoloControls = gameType === GameType.SOLO
  const showResult = gameType === GameType.MULTI && result && timeLeft <= 0
  const resultString = formatResultString(result, players)
  const newRoundEnabled = gameType === GameType.MULTI && allAreReady
  const notReady = players.filter(lobbyPlayer => lobbyPlayer.ready === false).map(lobbyPlayer => lobbyPlayer.username)

  function handlePauseClick() {
    dispatch({ type: "ToggleGamePaused" })
  }

  function handleRestartClick() {
    dispatch({ type: "RestartGame_Solo" })
  }

  function handleReadyClicked() {
    if (socket && player) {
      emitReadyStatus(socket, code, !player.ready)
    }
  }

  return (
    <div>
      {showResult && (
        <div className="multiplayer-controls">
          <p>{resultString}</p>
          <div>
            <p>Next round?</p>
            {!isHost && <button onClick={handleReadyClicked}>{player?.ready ? "Not Ready" : "Ready"}</button>}
          </div>
          {isHost && <NewGameButton label="Start" singlePlayer={false} enabled={newRoundEnabled} />}
          {newRoundEnabled === false && <p>Waiting for {notReady.join(", ")}</p>}
        </div>
      )}
      {showSoloControls && (
        <>
          <button onClick={handlePauseClick} disabled={pauseDisabled}>
            {isPaused ? "Unpause" : "Pause"}
          </button>
          <button onClick={handleRestartClick}>Restart</button>
          <NewGameButton label="New Game" singlePlayer={true} enabled={true} />
        </>
      )}
      <HowToPlayButton />
    </div>
  )
}
