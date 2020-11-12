import express from "express"
import morgan from "morgan"
import path from "path"

import { handleGenerateGame } from "./routes"
import { loadDictionary } from "./utils"

const app = express()
const PORT = process.env.PORT || 8000

app.use(morgan("short"))

app.use(express.static(path.join(__dirname, "static")))

app.locals.dictionary = loadDictionary()

app.get("/generate-game", handleGenerateGame)

app.listen(PORT, () => {
  console.log(`[server] Server running on port ${PORT}`)
})
