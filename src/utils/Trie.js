/**
 * Trie Node class to represent each node in the trie
 */
class TrieNode {
  constructor() {
    this.children = {}; // Object to store child nodes
    this.isEndOfWord = false; // Boolean to mark end of a word
    this.wordCount = 0; // Count of words that end at this node
  }
}

/**
 * Trie class implementation with comprehensive functionality
 */
class Trie {
  constructor() {
    this.root = new TrieNode();
    this.totalWords = 0;
  }

  /**
   * Insert a word into the trie
   * @param {string} word - The word to insert
   */
  insert(word) {
    if (!word || typeof word !== 'string') {
      return false;
    }

    word = word.toLowerCase().trim();
    if (word.length === 0) {
      return false;
    }

    let current = this.root;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      // Only allow alphabetic characters
      if (!/[a-z]/.test(char)) {
        return false;
      }

      if (!current.children[char]) {
        current.children[char] = new TrieNode(); // this creates a new node
      }
      current = current.children[char]; // move down one level in the trie
    }

    // Mark end of word and increment counters
    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      this.totalWords++;
    }
    current.wordCount++;
    return true;
  }

  /**
   * Search for a word in the trie
   * @param {string} word - The word to search for
   * @returns {boolean} - True if word exists, false otherwise
   */
  search(word) {
    if (!word || typeof word !== 'string') {
      return false;
    }

    word = word.toLowerCase().trim();
    let current = this.root;

    for (let i = 0; i < word.length; i++){
        const char = word[i];
        if (!current.children[char]) {
            return false;
        }
        current = current.children[char]; // go to the next node
    }

    return current.isEndOfWord;
  }

  /**
   * Check if any word starts with the given prefix
   * @param {string} prefix - The prefix to check
   * @returns {boolean} - True if prefix exists, false otherwise
   */
  startsWith(prefix) {
    if (!prefix || typeof prefix !== 'string') {
      return false;
    }

    prefix = prefix.toLowerCase().trim();
    let current = this.root;

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }

    return true;
  }

  /**
   * Get all words that start with the given prefix
   * @param {string} prefix - The prefix to search for
   * @param {number} limit - Maximum number of suggestions (default: 10)
   * @returns {Array} - Array of words that start with the prefix
   */
  getWordsWithPrefix(prefix, limit = 10) {
    if (!prefix || typeof prefix !== 'string') {
      return [];
    }

    prefix = prefix.toLowerCase().trim();
    const results = [];
    let current = this.root;

    // Navigate to the prefix node
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children[char]) {
        return results; // Prefix doesn't exist
      }
      current = current.children[char];
    }

    // DFS to find all words with this prefix
    this._dfsCollectWords(current, prefix, results, limit);
    return results.sort(); // Return sorted suggestions
  }

  /**
   * Helper method for DFS word collection
   * @private
   */
  _dfsCollectWords(node, currentWord, results, limit) {
    if (results.length >= limit) {
      return;
    }

    if (node.isEndOfWord) {
      results.push(currentWord);
    }

    // Explore children in alphabetical order
    const sortedChars = Object.keys(node.children).sort();
    for (const char of sortedChars) {
      if (results.length >= limit) {
        break;
      }
      this._dfsCollectWords(
        node.children[char],
        currentWord + char,
        results,
        limit
      );
    }
  }

  /**
   * Delete a word from the trie
   * @param {string} word - The word to delete
   * @returns {boolean} - True if word was deleted, false if word didn't exist
   */
  delete(word) {
    if (!word || typeof word !== 'string') {
      return false;
    }

    word = word.toLowerCase().trim();
    const deleted = this._deleteHelper(this.root, word, 0);
    if (deleted) {
      this.totalWords--;
    }
    return deleted;
  }

  /**
   * Helper method for word deletion
   * @private
   */
  _deleteHelper(node, word, index) {
    if (index === word.length) {
      // We've reached the end of the word
      if (!node.isEndOfWord) {
        return false; // Word doesn't exist
      }
      
      node.isEndOfWord = false;
      node.wordCount = 0;
      
      // Return true if current node has no children (can be deleted)
      return Object.keys(node.children).length === 0;
    }

    const char = word[index];
    const childNode = node.children[char];
    
    if (!childNode) {
      return false; // Word doesn't exist
    }

    const shouldDeleteChild = this._deleteHelper(childNode, word, index + 1);

    if (shouldDeleteChild) {
      delete node.children[char];
      
      // Return true if current node should be deleted
      // (no children and not end of another word)
      return Object.keys(node.children).length === 0 && !node.isEndOfWord;
    }

    return false;
  }

  /**
   * Get all words in the trie
   * @returns {Array} - Array of all words in the trie
   */
  getAllWords() {
    const words = [];
    this._dfsCollectWords(this.root, '', words, Infinity);
    return words.sort();
  }

  /**
   * Get the total number of words in the trie
   * @returns {number} - Total number of words
   */
  getWordCount() {
    return this.totalWords;
  }

  /**
   * Clear all words from the trie
   */
  clear() {
    this.root = new TrieNode();
    this.totalWords = 0;
  }

  /**
   * Get trie statistics
   * @returns {Object} - Object containing trie statistics
   */
  getStats() {
    const stats = {
      totalWords: this.totalWords,
      totalNodes: 0,
      maxDepth: 0,
      averageWordLength: 0
    };

    const allWords = this.getAllWords();
    if (allWords.length > 0) {
      const totalLength = allWords.reduce((sum, word) => sum + word.length, 0);
      stats.averageWordLength = totalLength / allWords.length;
    }

    this._calculateStats(this.root, 0, stats);
    
    return {
      ...stats,
      averageWordLength: Math.round(stats.averageWordLength * 100) / 100
    };
  }

  /**
   * Helper method to calculate trie statistics
   * @private
   */
  _calculateStats(node, depth, stats) {
    stats.totalNodes++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    for (const child of Object.values(node.children)) {
      this._calculateStats(child, depth + 1, stats);
    }
  }
}

export default Trie; 