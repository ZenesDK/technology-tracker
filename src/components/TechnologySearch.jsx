// components/TechnologySearch.jsx
import React, { useState, useEffect } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, searchResults, searchLoading, onImport }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce механизм
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Выполняем поиск при изменении debouncedQuery
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="technology-search">
      <div className="search-header">
        <h3>🔍 Поиск технологий в базе знаний</h3>
        <p>Найдите технологии для добавления в ваш трекер</p>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Введите название технологии (React, Node.js, TypeScript...)"
          className="search-input"
        />
        {query && (
          <button onClick={clearSearch} className="clear-search-btn">
            ✕
          </button>
        )}
      </div>

      {searchLoading && (
        <div className="search-loading">
          <div className="spinner-small"></div>
          <span>Поиск...</span>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Найдено технологий: {searchResults.length}</h4>
          <div className="results-grid">
            {searchResults.map(tech => (
              <div key={tech.id} className="tech-result-card">
                <div className="tech-result-header">
                  <h5>{tech.title}</h5>
                  <span className={`difficulty-badge ${tech.difficulty}`}>
                    {tech.difficulty === 'beginner' && '👶 Начинающий'}
                    {tech.difficulty === 'intermediate' && '🚀 Продвинутый'}
                    {tech.difficulty === 'advanced' && '🔥 Эксперт'}
                  </span>
                </div>
                <p className="tech-description">{tech.description}</p>
                <div className="tech-meta">
                  <span className="category-tag">{tech.category}</span>
                  {tech.estimatedHours && (
                    <span className="hours-estimate">⏱️ {tech.estimatedHours}ч</span>
                  )}
                </div>
                <div className="tech-resources">
                  <strong>Ресурсы:</strong>
                  <ul>
                    {tech.resources?.slice(0, 2).map((resource, index) => (
                      <li key={index}>
                        <a href={resource} target="_blank" rel="noopener noreferrer">
                          {new URL(resource).hostname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => onImport(tech)}
                  className="import-tech-btn"
                >
                  ➕ Добавить в трекер
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {debouncedQuery && !searchLoading && searchResults.length === 0 && (
        <div className="no-results">
          <p>😔 Технологии по запросу "{debouncedQuery}" не найдены</p>
          <p>Попробуйте изменить запрос или добавить технологию вручную</p>
        </div>
      )}
    </div>
  );
}

export default TechnologySearch;