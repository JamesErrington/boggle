import { findAllWords } from "../utils"

describe("Utils", function () {
  describe("findAllWords()", function () {
    it("", function () {
      const board = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p"
      ]
      const dictionary = new Set([
        "abcd",
        "abcdgh",
        "dcba",
        "wxyz",
        "admphekj",
        "klpojghdc"
      ])
      const result = new Set(Object.keys(findAllWords(board, dictionary)))
      const expected = new Set(["abcd", "abcdgh", "dcba", "klpojghdc"])
      expect(result).toEqual(expected)
    })
  })
})
