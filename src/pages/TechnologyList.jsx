// pages/TechnologyList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './TechnologyList.css';

function TechnologyList() {
  const { 
    technologies, 
    updateStatus, 
    removeTechnology, 
    progress,
    completedCount,
    inProgressCount
  } = useTechnologiesApi();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const filteredTechnologies = technologies.filter(tech => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  const sortedTechnologies = [...filteredTechnologies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
      case 'hours':
        return (b.estimatedHours || 0) - (a.estimatedHours || 0);
      default:
        return 0;
    }
  });

  const handleStatusChange = (techId, newStatus) => {
    updateStatus(techId, newStatus);
  };

  const handleDelete = (techId, techTitle) => {
    if (window.confirm(`Вы уверены, что хотите удалить технологию "${techTitle}"?`)) {
      removeTechnology(techId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Изучено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '👶';
      case 'intermediate': return '🚀';
      case 'advanced': return '🔥';
      default: return '📚';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Продвинутый';
      case 'advanced': return 'Эксперт';
      default: return 'Не указано';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      frontend: '🌐',
      backend: '⚙️',
      database: '🗄️',
      devops: '🔧',
      mobile: '📱',
      'ai-ml': '🤖',
      cloud: '☁️',
      tools: '🛠️',
      language: '💬',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <h1>Мои технологии</h1>
          <p>Отслеживайте прогресс изучения технологий</p>
        </div>
        <Link to="/add-technology" className="btn btn-primary">
          ➕ Добавить технологию
        </Link>
      </div>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{progress}%</div>
            <div className="stat-label">Общий прогресс</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Изучено</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-value">{inProgressCount}</div>
            <div className="stat-label">В процессе</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{technologies.length}</div>
            <div className="stat-label">Всего</div>
          </div>
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <div className="controls-card">
        <div className="controls-row">
          <div className="filter-group">
            <label>Фильтр по статусу:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Все технологии</option>
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Изучено</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Сортировка:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="title">По названию</option>
              <option value="category">По категории</option>
              <option value="difficulty">По сложности</option>
              <option value="hours">По времени изучения</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список технологий */}
      <div className="technologies-grid">
        {sortedTechnologies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Технологий пока нет</h3>
            <p>Добавьте первую технологию чтобы начать отслеживать прогресс</p>
            <Link to="/add-technology" className="btn btn-primary">
              Добавить технологию
            </Link>
          </div>
        ) : (
          sortedTechnologies.map(tech => (
            <div key={tech.id} className="tech-card">
              <div className="tech-header">
                <h3 className="tech-title">{tech.title}</h3>
                <div className="tech-actions">
                  <Link 
                    to={`/technology/${tech.id}`} 
                    className="btn-icon"
                    title="Подробнее"
                  >
                    👁️
                  </Link>
                  <button 
                    onClick={() => handleDelete(tech.id, tech.title)}
                    className="btn-icon btn-danger"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="tech-description">{tech.description}</p>

              {/* Мета-информация */}
              <div className="tech-meta">
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span className="meta-value">
                    {getCategoryIcon(tech.category)} {tech.category}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Сложность:</span>
                  <span className="meta-value">
                    {getDifficultyIcon(tech.difficulty)} {getDifficultyText(tech.difficulty)}
                  </span>
                </div>

                {tech.estimatedHours && (
                  <div className="meta-item">
                    <span className="meta-label">Время изучения:</span>
                    <span className="meta-value">⏱️ {tech.estimatedHours} часов</span>
                  </div>
                )}

                {tech.resources && tech.resources.length > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">Ресурсы:</span>
                    <span className="meta-value">📚 {tech.resources.length} ссылок</span>
                  </div>
                )}
              </div>

              {/* Статус */}
              <div className="tech-status">
                <label>Статус изучения:</label>
                <div className="status-buttons">
                  <button
                    onClick={() => handleStatusChange(tech.id, 'not-started')}
                    className={`status-btn ${tech.status === 'not-started' ? 'active' : ''}`}
                  >
                    ⏳ Не начато
                  </button>
                  <button
                    onClick={() => handleStatusChange(tech.id, 'in-progress')}
                    className={`status-btn ${tech.status === 'in-progress' ? 'active' : ''}`}
                  >
                    🔄 В процессе
                  </button>
                  <button
                    onClick={() => handleStatusChange(tech.id, 'completed')}
                    className={`status-btn ${tech.status === 'completed' ? 'active' : ''}`}
                  >
                    ✅ Изучено
                  </button>
                </div>
                <div className="current-status">
                  {getStatusIcon(tech.status)} {getStatusText(tech.status)}
                </div>
              </div>

              {/* Комментарий */}
              {tech.notes && (
                <div className="tech-notes">
                  <strong>Мои заметки:</strong>
                  <p>{tech.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TechnologyList;