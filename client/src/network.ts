import { GenerateGameResponse } from "../../shared/types"

export async function getSoloGame(): Promise<GenerateGameResponse> {
  const response = await fetch("/generate-game")
  return response.json() as Promise<GenerateGameResponse>
}
