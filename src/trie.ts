// Based on https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0

class TrieNode {
  constructor(key: string | null) {
    this.key = key
  }

  private key: string | null

  public parent: TrieNode | null = null
  public children: Record<string, TrieNode> = {}
  public end = false

  public getWord() {
    const output = []
    let node: TrieNode | null = this

    while (node !== null) {
      output.unshift(node.key)
      node = node.parent
    }

    return output.join("")
  }
}

export class Trie {
  constructor(input?: Iterable<string>) {
    if (input) {
      for (const word of input) {
        this.insert(word)
      }
    }
  }

  private root: TrieNode | null = new TrieNode(null)

  public hasChildren() {
    return this.root ? Object.keys(this.root.children).length > 0 : false
  }

  public insert(word: string) {
    let node = this.root

    for (let i = 0; i < word.length; i++) {
      const letter = word[i]
      if (node && !node.children[letter]) {
        node.children[letter] = new TrieNode(letter)

        node.children[letter].parent = node
      }

      node = node && node.children[letter]

      if (i === word.length - 1 && node) {
        node.end = true
      }
    }
  }

  public contains(word: string) {
    let node = this.root

    for (let i = 0; i < word.length; i++) {
      const letter = word[i]
      if (node && node.children[letter]) {
        node = node.children[letter]
      } else {
        return false
      }
    }
    return node ? node.end : false
  }

  public find(prefix: string) {
    const output: string[] = []
    let node = this.root

    for (var i = 0; i < prefix.length; i++) {
      const letter = prefix[i]

      if (node && node.children[letter]) {
        node = node.children[letter]
      } else {
        return output
      }
    }

    node && findAllWords(node, output)

    return output
  }

  public findTrie(prefix: string) {
    return new Trie(this.find(prefix))
  }
}

function findAllWords(node: TrieNode, array: string[]) {
  if (node.end) {
    array.unshift(node.getWord())
  }

  for (const child in node.children) {
    findAllWords(node.children[child], array)
  }
}
