import React from "react"
import type { FunctionComponent } from "react"

import { WordTableRow } from "./WordTableRow"

import { useAppState } from "../context"
import { GameType } from "../reducer"

export const WordTable: FunctionComponent = () => {
  const { gameType, totalWords, foundWords, foundWordScore, timeLeft, player, players, lobbyFoundWords } = useAppState()
  const nonFoundWords = totalWords.filter(word => foundWords.some(foundWord => word.string === foundWord.string) === false)
  const showNonFound = timeLeft <= 0
  const showPlayerScores = gameType === GameType.MULTI && Object.keys(lobbyFoundWords).length > 0

  return (
    <div className="word-table-container">
      <table className="found-word-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {showPlayerScores && (
            <tr className="username-row">
              <th colSpan={2}>{player?.username}:</th>
              <th>{foundWordScore}</th>
            </tr>
          )}
          {foundWords.map((word, index) => (
            <WordTableRow key={word.string} word={word} index={index} />
          ))}
          {showPlayerScores &&
            players.map(lobbyPlayer => (
              <>
                {lobbyPlayer.id !== player?.id && (
                  <>
                    <tr key={`${lobbyPlayer.id}-header`} className="username-row">
                      <th colSpan={2}>{lobbyPlayer.username}:</th>
                      <th>{lobbyFoundWords[lobbyPlayer.id].score}</th>
                    </tr>
                    {lobbyFoundWords[lobbyPlayer.id].words.map((word, index) => (
                      <WordTableRow key={word.string} word={word} index={index} />
                    ))}
                  </>
                )}
              </>
            ))}
        </tbody>
      </table>
      <table className="unfound-word-table">
        <tbody>
          {showNonFound && (
            <>
              <tr>
                <td colSpan={3}>You Missed:</td>
              </tr>
              {nonFoundWords.map((word, index) => (
                <WordTableRow key={word.string} word={word} index={index} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
