import React, { useState, useEffect } from 'react';

const TrieVisualizer = ({ trie }) => {
  const [stats, setStats] = useState({}); // this sets the default values for the stats
  const [allWords, setAllWords] = useState([]); // this sets the default values for the allWords
  const [showWords, setShowWords] = useState(false); // this sets the default values for the showWords
  const [showStructure, setShowStructure] = useState(false); // this sets the default values for the showStructure

  useEffect(() => {
    updateData();
  }, [trie]);

  const updateData = () => {
    setStats(trie.getStats());
    setAllWords(trie.getAllWords());
  };

  // This first builds the trie structure
  const renderTrieStructure = () => {
    const structure = buildTrieStructure(trie.root, '', 0);
    return structure;
  };

  const buildTrieStructure = (node, prefix, depth) => {
    if (depth > 7) { // Limit depth to prevent overwhelming display
      return <div key={prefix} className="trie-node truncated">...</div>;
    }

    const children = Object.keys(node.children).sort();
    
    return (
      <div key={prefix} className="trie-node">
        <div className={`node-content ${node.isEndOfWord ? 'end-word' : ''}`}>
          <span className="node-prefix">{prefix || '(root)'}</span>
          {node.isEndOfWord && <span className="word-marker">✓</span>}
        </div>
        {children.length > 0 && (
          <div className="node-children">
            {children.map(char => 
              buildTrieStructure(
                node.children[char], 
                prefix + char, 
                depth + 1
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const WordList = ({ words }) => {
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredWords = words
      .filter(word => word.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      });

    return (
      <div className="word-list-container">
        <div className="word-list-controls">
          <input
            type="text"
            placeholder="Filter words..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
        <div className="word-count">
          Showing {filteredWords.length} of {words.length} words
        </div>
        <div className="word-grid">
          {filteredWords.map((word, index) => (
            <span key={index} className="word-item">
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="trie-visualizer">
      <h3>Trie Analysis</h3>
      
      <div className="stats-container">
        <h4>Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Words:</span>
            <span className="stat-value">{stats.totalWords || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Nodes:</span>
            <span className="stat-value">{stats.totalNodes || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max Depth:</span>
            <span className="stat-value">{stats.maxDepth || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Word Length:</span>
            <span className="stat-value">{stats.averageWordLength || 0}</span>
          </div>
        </div>
      </div>

      <div className="visualization-controls">
        <button 
          onClick={() => setShowWords(!showWords)}
          className={`toggle-button ${showWords ? 'active' : ''}`}
        >
          {showWords ? 'Hide' : 'Show'} All Words ({allWords.length})
        </button>
        
        <button 
          onClick={() => setShowStructure(!showStructure)}
          className={`toggle-button ${showStructure ? 'active' : ''}`}
        >
          {showStructure ? 'Hide' : 'Show'} Trie Structure
        </button>
      </div>

      {showWords && (
        <div className="words-section">
          <h4>All Words in Trie</h4>
          {allWords.length > 0 ? (
            <WordList words={allWords} />
          ) : (
            <p className="empty-message">No words in the trie yet. Add some words to get started!</p>
          )}
        </div>
      )}

      {showStructure && (
        <div className="structure-section">
          <h4>Trie Structure</h4>
          {stats.totalWords > 0 ? (
            <div className="structure-container">
              <div className="structure-note">
                Note: Showing first 7 levels only. Nodes with ✓ represent end-of-word positions.
              </div>
              <div className="trie-structure">
                {renderTrieStructure()}
              </div>
            </div>
          ) : (
            <p className="empty-message">Add words to see the trie structure visualization.</p>
          )}
        </div>
      )}

      <div className="performance-info">
        <h4>Trie Performance Benefits</h4>
        <ul>
          <li><strong>Search:</strong> O(m) where m is the length of the word</li>
          <li><strong>Insert:</strong> O(m) where m is the length of the word</li>
          <li><strong>Prefix Search:</strong> O(p + n) where p is prefix length and n is number of results</li>
          <li><strong>Memory:</strong> Shared prefixes save space compared to storing full words</li>
          <li><strong>Auto-complete:</strong> Efficiently finds all words with a given prefix</li>
        </ul>
      </div>
    </div>
  );
};

export default TrieVisualizer; 