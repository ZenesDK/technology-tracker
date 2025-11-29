// pages/TechnologyList.jsx
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import './TechnologyList.css';

function TechnologyList() {
  const { technologies, updateStatus, updateNotes } = useTechnologies();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'all');

  // Обработка фильтра из URL
  React.useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setStatusFilter(filter);
    }
  }, [searchParams]);

  const filteredTechnologies = useMemo(() => {
    let filtered = technologies;

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tech => tech.status === statusFilter);
    }

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        (tech.notes && tech.notes.toLowerCase().includes(query)) ||
        tech.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [technologies, statusFilter, searchQuery]);

  const handleFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    if (newFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter: newFilter });
    }
  };

  const handleCardClick = (techId, currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    updateStatus(techId, statusOrder[nextIndex]);
  };

  const clearSearch = () => setSearchQuery('');

  const filterStats = {
    all: technologies.length,
    'not-started': technologies.filter(t => t.status === 'not-started').length,
    'in-progress': technologies.filter(t => t.status === 'in-progress').length,
    'completed': technologies.filter(t => t.status === 'completed').length
  };

  return (
    <div className="page technology-list-page">
      <div className="page-header">
        <h1>📋 Все технологии</h1>
        <Link to="/add-technology" className="btn btn-primary">
          ➕ Добавить технологию
        </Link>
      </div>

      {/* Поиск и фильтры */}
      <div className="list-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Поиск технологий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={clearSearch}
                title="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Все ({filterStats.all})
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => handleFilterChange('not-started')}
            >
              Не начато ({filterStats['not-started']})
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => handleFilterChange('in-progress')}
            >
              В процессе ({filterStats['in-progress']})
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              Изучено ({filterStats.completed})
            </button>
          </div>
        </div>

        <div className="results-info">
          Найдено: <strong>{filteredTechnologies.length}</strong> из <strong>{technologies.length}</strong>
          {searchQuery && (
            <span className="search-query">
              по запросу: "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* Список технологий */}
      {filteredTechnologies.length > 0 ? (
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <div key={tech.id} className="tech-card-with-notes">
              <TechnologyCard
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                category={tech.category}
                onStatusChange={handleCardClick}
                hasNotes={!!tech.notes && tech.notes.length > 0}
                searchQuery={searchQuery}
                showDetailsLink={true}
              />
              <TechnologyNotes
                notes={tech.notes}
                onNotesChange={updateNotes}
                techId={tech.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            {searchQuery || statusFilter !== 'all' ? '🔍' : '📋'}
          </div>
          <h3>Технологии не найдены</h3>
          <p>
            {searchQuery 
              ? `По запросу "${searchQuery}" ничего не найдено`
              : statusFilter !== 'all'
              ? `В категории "${statusFilter}" пока нет технологий`
              : 'Технологий пока нет. Добавьте первую!'
            }
          </p>
          <div className="empty-actions">
            {(searchQuery || statusFilter !== 'all') && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange('all');
                }}
              >
                Сбросить фильтры
              </button>
            )}
            <Link to="/add-technology" className="btn btn-primary">
              ➕ Добавить технологию
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnologyList;