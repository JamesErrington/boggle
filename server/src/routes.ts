import { Request, Response } from "express"

import { generateBoard, findAllWords } from "./utils"
import type { GenerateGameResponse } from "../../shared/types"

export function handleGenerateGame(request: Request, response: Response<GenerateGameResponse>) {
  const board = generateBoard()
  const { words, totalWordCount, totalWordScore } = findAllWords(board, request.app.locals.dictionary)

  response.status(200).send({
    board,
    words,
    totalWordCount,
    totalWordScore
  })
}
