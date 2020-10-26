import React, { useState } from "react"
import type { FunctionComponent } from "react"
import { useBoggleDispatch, useBoggleState } from "../context"

interface Props {}

export const Lobby: FunctionComponent<Props> = () => {
  const dispatch = useBoggleDispatch()
  const { socketState } = useBoggleState()
  const [nameInput, setNameInput] = useState("")
  const [codeInput, setCodeInput] = useState("")

  function handleNameInput(event: any) {
    setNameInput(event.target.value)
  }

  function handleCodeInput(event: any) {
    setCodeInput(event.target.value)
  }

  function handleCreate() {
    dispatch({
      type: "JoinGame",
      payload: {
        name: nameInput,
        create: true
      }
    })
  }

  function handleJoin() {
    dispatch({
      type: "JoinGame",
      payload: {
        name: nameInput,
        code: codeInput
      }
    })
  }

  function handleStartGame() {
    dispatch({
      type: "StartGame"
    })
  }

  return (
    <div className="lobby-container">
      {!socketState?.code && 
      <>
        <div className="lobby-create">
          <label>Name:</label>
          <input value={nameInput} onChange={handleNameInput} type="text" />
          <button onClick={handleCreate}>Create Game</button>
        </div>
        <h3>OR</h3>
        <div className="lobby-join">
          <label>Game Code:</label>
          <input value={codeInput} onChange={handleCodeInput} type="text" />
          <button onClick={handleJoin} disabled={codeInput.length !== 4}>
            Join Game
          </button>
        </div>
      </>}
      {socketState?.code && 
      <>
        <p>Game Code: <strong>{socketState.code}</strong></p>
        <ul>
          {socketState.players?.map(player => (<li key={player.id}>{player.name}</li>))}
        </ul>
        {socketState.isHost && <button onClick={handleStartGame}>Start Game</button>}
      </>
      }
    </div>
  )
}
