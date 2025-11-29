// components/ResourceLoader.jsx
import React, { useState } from 'react';
import './ResourceLoader.css';

function ResourceLoader({ techId, techTitle, onResourcesLoaded }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleLoadResources = async () => {
    setLoading(true);
    try {
      // Здесь будет вызов API для загрузки ресурсов
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock данные
      const mockResources = [
        `https://awesome-${techTitle.toLowerCase()}.com`,
        `https://${techTitle.toLowerCase()}-patterns.com`,
        `https://github.com/topics/${techTitle.toLowerCase()}`
      ];
      
      onResourcesLoaded(techId, mockResources);
      setExpanded(false);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-loader">
      <button 
        className="load-resources-btn"
        onClick={() => setExpanded(!expanded)}
      >
        📚 Загрузить ресурсы
      </button>
      
      {expanded && (
        <div className="resources-panel">
          <p>Загрузить дополнительные учебные ресурсы для {techTitle}?</p>
          <div className="resource-actions">
            <button 
              onClick={handleLoadResources}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Загрузка...' : '✅ Да, загрузить'}
            </button>
            <button 
              onClick={() => setExpanded(false)}
              className="btn btn-secondary"
            >
              ❌ Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceLoader;