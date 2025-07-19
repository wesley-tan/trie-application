import React, { useState, useEffect, useRef } from 'react';

const SearchComponent = ({ trie, onWordSelect }) => {
  const [searchTerm, setSearchTerm] = useState(''); // string for the search term
  const [suggestions, setSuggestions] = useState([]); // array of suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // boolean to show/hide suggestions
  const [selectedIndex, setSelectedIndex] = useState(-1); // index of the selected suggestion
  const [searchResult, setSearchResult] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim()){
      const newSuggestions = trie.getWordsWithPrefix(searchTerm, 10);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm, trie]);

  // handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchResult(null);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const exists = trie.search(searchTerm.trim());
      setSearchResult({
        word: searchTerm.trim(),
        found: exists
      });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchResult({
      word: suggestion,
      found: true
    });
    if (onWordSelect) {
      onWordSelect(suggestion);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const highlightMatch = (word, query) => {
    if (!query.trim()) return word;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = word.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-component">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type to search and see auto-complete suggestions..."
            className="search-input"
            autoComplete="off"
          />
          <button 
            onClick={handleSearch} 
            className="search-button"
            disabled={!searchTerm.trim()}
          >
            Search
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-container">
            <div className="suggestions-header">
              Suggestions ({suggestions.length}):
            </div>
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  className={`suggestion-item ${
                    index === selectedIndex ? 'selected' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {highlightMatch(suggestion, searchTerm)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchResult && (
          <div className={`search-result ${searchResult.found ? 'found' : 'not-found'}`}>
            {searchResult.found ? (
              <span>
                ✅ "<strong>{searchResult.word}</strong>" found in the trie!
              </span>
            ) : (
              <span>
                ❌ "<strong>{searchResult.word}</strong>" not found in the trie.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="search-instructions">
        <h4>How to use:</h4>
        <ul>
          <li>Type in the search box to see auto-complete suggestions</li>
          <li>Use ↑↓ arrow keys to navigate suggestions</li>
          <li>Press Enter to select a suggestion or search</li>
          <li>Click on any suggestion to select it</li>
          <li>Press Escape to hide suggestions</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent; 