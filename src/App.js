// App.js
import React, { useState, useMemo } from 'react';
import useTechnologies from './hooks/useTechnologies';
import ProgressBar from './components/ProgressBar';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import ProgressHeader from './components/ProgressHeader';
import Statistics from './components/Statistics';
import TechnologyNotes from './components/TechnologyNotes';
import './App.css';

function App() {
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    progress,
    completedCount,
    inProgressCount,
    totalCount,
    categoryStats
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация технологий
  const filteredTechnologies = useMemo(() => {
    let filtered = technologies;

    // Применяем поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        (tech.notes && tech.notes.toLowerCase().includes(query)) ||
        tech.category.toLowerCase().includes(query)
      );
    }

    // Применяем фильтр по статусу
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tech => tech.status === activeFilter);
    }

    return filtered;
  }, [technologies, searchQuery, activeFilter]);

  // Статистика для фильтров
  const filterStats = useMemo(() => ({
    all: technologies.length,
    'not-started': technologies.filter(t => t.status === 'not-started').length,
    'in-progress': technologies.filter(t => t.status === 'in-progress').length,
    'completed': technologies.filter(t => t.status === 'completed').length
  }), [technologies]);

  const handleCardClick = (techId, currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    updateStatus(techId, statusOrder[nextIndex]);
  };

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Трекер изучения технологий</h1>
          <p>Отслеживайте свой прогресс в изучении frontend и backend технологий</p>
          
          <ProgressBar 
            progress={progress}
            label="Общий прогресс изучения"
            color="#10b981"
            animated={true}
            height={20}
            showPercentage={true}
            showInnerText={progress > 25}
            className="main-progress-bar"
            size="xxl"
          />
        </div>
      </header>

      <main className="app-main">
        {/* ProgressHeader с актуальными данными */}
        <ProgressHeader technologies={technologies} />

        {/* Статистика */}
        <Statistics technologies={technologies} />

        {/* Быстрые действия */}
        <QuickActions 
          onMarkAllCompleted={markAllCompleted}
          onResetAll={resetAllStatuses}
          technologies={technologies}
        />

        {/* Поиск технологий */}
        <div className="search-panel">
          <h3 className="search-title">🔍 Поиск технологий</h3>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Поиск по названию, описанию, заметкам или категории..."
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
            <div className="search-results-info">
              <span className="search-results-count">
                Найдено: <strong>{filteredTechnologies.length}</strong> из <strong>{technologies.length}</strong>
              </span>
              {searchQuery && (
                <span className="search-query">
                  По запросу: "<em>{searchQuery}</em>"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="filters-panel">
          <h3 className="filters-title">🎛️ Фильтры по статусу</h3>
          <div className="filters-grid">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span className="filter-icon">📋</span>
              <span className="filter-text">Все технологии</span>
              <span className="filter-count">{filterStats.all}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => setActiveFilter('not-started')}
            >
              <span className="filter-icon">⏳</span>
              <span className="filter-text">Не начатые</span>
              <span className="filter-count">{filterStats['not-started']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              <span className="filter-icon">🔄</span>
              <span className="filter-text">В процессе</span>
              <span className="filter-count">{filterStats['in-progress']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              <span className="filter-icon">✅</span>
              <span className="filter-text">Выполненные</span>
              <span className="filter-count">{filterStats.completed}</span>
            </button>
          </div>
        </div>

        {/* Прогресс по категориям */}
        <div className="category-progress-section">
          <h3 className="category-section-title">📊 Прогресс по категориям</h3>
          <div className="categories-grid">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const categoryProgress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              
              const getCategoryInfo = (category) => {
                switch(category) {
                  case 'frontend':
                    return {
                      label: '🌐 Frontend',
                      color: '#3b82f6',
                      icon: '🌐',
                      description: 'Клиентская часть приложений'
                    };
                  case 'backend':
                    return {
                      label: '⚙️ Backend', 
                      color: '#8b5cf6',
                      icon: '⚙️',
                      description: 'Серверная часть приложений'
                    };
                  default:
                    return {
                      label: category,
                      color: '#6b7280',
                      icon: '📁',
                      description: 'Другие технологии'
                    };
                }
              };

              const categoryInfo = getCategoryInfo(category);

              return (
                <div key={category} className="category-card">
                  <div className="category-header">
                    <div className="category-icon">{categoryInfo.icon}</div>
                    <div className="category-info">
                      <h4 className="category-name">{categoryInfo.label}</h4>
                      <p className="category-description">{categoryInfo.description}</p>
                    </div>
                  </div>

                  <div className="category-progress-container">
                    <div className="progress-stats">
                      <span className="progress-percentage">{categoryProgress}%</span>
                      <span className="progress-count">
                        {stats.completed} из {stats.total} изучено
                      </span>
                    </div>
                    
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill"
                          style={{ 
                            width: `${categoryProgress}%`,
                            backgroundColor: categoryInfo.color
                          }}
                        >
                          {categoryProgress > 25 && (
                            <span className="progress-bar-text">{categoryProgress}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="category-details">
                      <div className="status-item">
                        <span className="status-dot completed"></span>
                        <span>Изучено: {stats.completed}</span>
                      </div>
                      <div className="status-item">
                        <span className="status-dot in-progress"></span>
                        <span>В процессе: {stats.inProgress}</span>
                      </div>
                      <div className="status-item">
                        <span className="status-dot not-started"></span>
                        <span>Осталось: {stats.notStarted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Отфильтрованные технологии */}
        <div className="technologies-section">
          <h2 className="main-section-title">
            {activeFilter === 'all' && '📋 Все технологии'}
            {activeFilter === 'not-started' && '⏳ Технологии к изучению'}
            {activeFilter === 'in-progress' && '🔄 Технологии в процессе'}
            {activeFilter === 'completed' && '✅ Изученные технологии'}
            {searchQuery && ' 🔍 с поиском'}
            <span className="filtered-count"> ({filteredTechnologies.length})</span>
          </h2>

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
            <div className="empty-filter-message">
              <div className="empty-icon">
                {searchQuery ? '🔍' : '📋'}
              </div>
              <h3>Технологии не найдены</h3>
              <p>
                {searchQuery 
                  ? `По запросу "${searchQuery}" ничего не найдено`
                  : 'Попробуйте изменить фильтры или очистить поиск'
                }
              </p>
              <div className="empty-actions">
                {searchQuery && (
                  <button className="btn btn-secondary" onClick={clearSearch}>
                    Очистить поиск
                  </button>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveFilter('all')}
                >
                  Показать все технологии
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Трекер технологий • 
            Всего: {totalCount} • 
            Изучено: {completedCount} • 
            В процессе: {inProgressCount} •
            Прогресс: {progress}%
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;