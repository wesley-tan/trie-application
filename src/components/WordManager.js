import React, { useState } from 'react';

const WordManager = ({ trie, onTrieUpdate }) => {
  const [newWord, setNewWord] = useState('');
  const [deleteWord, setDeleteWord] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleAddWord = () => {
    const word = newWord.trim();
    if (!word) {
      showMessage('Please enter a word to add.', 'error');
      return;
    }

    if (!/^[a-zA-Z]+$/.test(word)) {
      showMessage('Word can only contain letters.', 'error');
      return;
    }

    if (trie.search(word)) {
      showMessage(`"${word}" already exists in the trie.`, 'error');
      return;
    }

    const success = trie.insert(word);
    if (success) {
      showMessage(`"${word}" successfully added to the trie!`, 'success');
      setNewWord('');
      if (onTrieUpdate) {
        onTrieUpdate();
      }
    } else {
      showMessage('Failed to add word. Please try again.', 'error');
    }
  };

  const handleDeleteWord = () => {
    const word = deleteWord.trim();
    if (!word) {
      showMessage('Please enter a word to delete.', 'error');
      return;
    }

    if (!trie.search(word)) {
      showMessage(`"${word}" does not exist in the trie.`, 'error');
      return;
    }

    const success = trie.delete(word);
    if (success) {
      showMessage(`"${word}" successfully deleted from the trie!`, 'success');
      setDeleteWord('');
      if (onTrieUpdate) {
        onTrieUpdate();
      }
    } else {
      showMessage('Failed to delete word. Please try again.', 'error');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all words from the trie? This action cannot be undone.')) {
      trie.clear();
      showMessage('All words have been cleared from the trie.', 'success');
      if (onTrieUpdate) {
        onTrieUpdate();
      }
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const loadSampleWords = () => {
    const sampleWords = [
      'apple', 'application', 'apply', 'approach', 'appropriate',
      'banana', 'band', 'bank', 'bar', 'base',
      'cat', 'car', 'card', 'care', 'careful',
      'dog', 'door', 'down', 'drive', 'drop',
      'elephant', 'email', 'end', 'energy', 'engine',
      'friend', 'from', 'front', 'full', 'function',
      'great', 'green', 'group', 'grow', 'guess',
      'house', 'how', 'however', 'human', 'hundred',
      'information', 'into', 'issue', 'item', 'important',
      'just', 'job', 'join', 'jump', 'june'
    ];

    let addedCount = 0;
    sampleWords.forEach(word => {
      if (!trie.search(word) && trie.insert(word)) {
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showMessage(`Added ${addedCount} sample words to the trie!`, 'success');
      if (onTrieUpdate) {
        onTrieUpdate();
      }
    } else {
      showMessage('All sample words are already in the trie.', 'error');
    }
  };

  return (
    <div className="word-manager">
      <h3>Word Management</h3>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="word-actions">
        <div className="action-group">
          <h4>Add Word</h4>
          <div className="input-group">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddWord)}
              placeholder="Enter word to add..."
              className="word-input"
            />
            <button 
              onClick={handleAddWord}
              disabled={!newWord.trim()}
              className="action-button add-button"
            >
              Add Word
            </button>
          </div>
        </div>

        <div className="action-group">
          <h4>Delete Word</h4>
          <div className="input-group">
            <input
              type="text"
              value={deleteWord}
              onChange={(e) => setDeleteWord(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleDeleteWord)}
              placeholder="Enter word to delete..."
              className="word-input"
            />
            <button 
              onClick={handleDeleteWord}
              disabled={!deleteWord.trim()}
              className="action-button delete-button"
            >
              Delete Word
            </button>
          </div>
        </div>

        <div className="action-group">
          <h4>Bulk Actions</h4>
          <div className="button-group">
            <button 
              onClick={loadSampleWords}
              className="action-button sample-button"
            >
              Load Sample Words
            </button>
            <button 
              onClick={handleClearAll}
              className="action-button clear-button"
            >
              Clear All Words
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordManager; 