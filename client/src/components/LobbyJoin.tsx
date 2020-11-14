import React, { useState } from "react"
import type { FunctionComponent, ChangeEvent } from "react"

import { useAppDispatch } from "../context"

export const LobbyJoin: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const [username, setUsername] = useState("")
  const [code, setCode] = useState("")

  const hostButtonDisabled = username.length === 0
  const joinButtonDisabled = username.length === 0 || code.length !== 4

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)
  }

  function handleCodeChanged(event: ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value)
  }

  function handleHostClick() {
    dispatch({
      type: "CreateSocket",
      payload: {
        username,
        create: "true"
      }
    })
  }

  function handleJoinClick() {
    dispatch({
      type: "CreateSocket",
      payload: {
        username,
        create: "false",
        code
      }
    })
  }

  return (
    <>
      <div className="lobby-username">
        <label>Username</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div className="lobby-options">
        <button disabled={hostButtonDisabled} onClick={handleHostClick}>
          Host Game
        </button>
        <h3>OR</h3>
        <div className="lobby-code">
          <label>
            Game Code
            <input type="text" value={code} onChange={handleCodeChanged} />
          </label>
          <button disabled={joinButtonDisabled} onClick={handleJoinClick}>
            Join Game
          </button>
        </div>
      </div>
    </>
  )
}
