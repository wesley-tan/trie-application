import React, { useState, useMemo } from 'react';
import Trie from './utils/Trie';
import SearchComponent from './components/SearchComponent';
import WordManager from './components/WordManager';
import TrieVisualizer from './components/TrieVisualizer';
import './App.css';

function App() {
  // Create a trie instance that persists across re-renders
  // how does memory work in react?
  const trie = useMemo(() => new Trie(), []);
  
  // State to force re-renders when trie is updated
  const [updateCount, setUpdateCount] = useState(0);
  
  // This function increments the updateCount state, which forces the App component to re-render.
  // It is called whenever the trie is modified (e.g., word added or deleted) to ensure UI updates.
  const handleTrieUpdate = () => {
    setUpdateCount(prev => prev + 1);
  };

  // Load some initial sample data
  const loadInitialData = () => {
    const initialWords = [
      'react', 'javascript', 'programming', 'computer', 'science',
      'algorithm', 'data', 'structure', 'trie', 'search',
      'autocomplete', 'prefix', 'tree', 'node', 'graph'
    ];
    
    initialWords.forEach(word => trie.insert(word));
    handleTrieUpdate();
  };

  // Load initial data on first render
  React.useEffect(() => {
    if (trie.getWordCount() === 0) {
      loadInitialData();
    }
  }, [trie]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌳 Interactive Trie Explorer</h1>
        <p className="app-description">
          Explore the trie data structure with auto-complete search, word management, and visual analysis
        </p>
      </header>

      <main className="app-main">
        <div className="app-grid">

          {/* Trie Visualization Section */}
          <section className="visualization-section">
            <TrieVisualizer 
              trie={trie}
              key={updateCount} // Force re-render when trie updates
              onTrieUpdate={handleTrieUpdate}
            />
          </section>

          {/* Word Management Section */}
          <section className="management-section">
            <WordManager 
              trie={trie} 
              onTrieUpdate={handleTrieUpdate}
            />
          </section>

          {/* Search Section */}   
          <section className="search-section">
            <SearchComponent 
              trie={trie} 
              key={updateCount} // Force re-render when trie updates
            />
          </section>

        </div>
      </main>

      <footer className="app-footer">
        <div className="learning-resources">
          <h3>📚 Learning Resources</h3>
          <div className="resources-grid">
            <div className="resource-item">
              <h4>What is a Trie?</h4>
              <p>A trie (prefix tree) is a tree-like data structure that stores strings efficiently by sharing common prefixes.</p>
            </div>
            <div className="resource-item">
              <h4>Use Cases</h4>
              <p>Auto-complete, spell checkers, IP routing tables, word games, and searching large datasets.</p>
            </div>
            <div className="resource-item">
              <h4>React Concepts Used</h4>
              <p>useState, useEffect, useMemo, component composition, event handling, and conditional rendering.</p>
            </div>
            <div className="resource-item">
              <h4>Time Complexity</h4>
              <p>Search, Insert, Delete: O(m) where m is the key length. Space: O(ALPHABET_SIZE * N * M)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 