import { Trie } from "../trie"

describe("Trie", function () {
  it("should insert correctly", function () {
    const trie = new Trie()

    trie.insert("hello")
    trie.insert("world")

    expect(trie.contains("hello")).toBeTruthy()
    expect(trie.contains("world")).toBeTruthy()
    expect(trie.contains("helloworld")).toBeFalsy()
  })

  it("should initialize correctly", function () {
    const trie = new Trie(["hello", "world"])

    expect(trie.contains("hello")).toBeTruthy()
    expect(trie.contains("world")).toBeTruthy()
    expect(trie.contains("helloworld")).toBeFalsy()
  })

  it("should find words from prefixes correctly", function () {
    const trie = new Trie()

    trie.insert("hello")
    trie.insert("helloworld")
    trie.insert("world")

    expect(trie.find("hell")).toContain("hello")
    expect(trie.find("hell")).toContain("helloworld")
    expect(trie.find("w")).toContain("world")
    expect(trie.find("abcd")).toEqual([])
  })
})
