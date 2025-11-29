// pages/TechnologyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { 
    technologies, 
    updateStatus, 
    updateNotes,
    removeTechnology,
    fetchAdditionalResources 
  } = useTechnologiesApi();
  
  const [tech, setTech] = useState(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    const technology = technologies.find(t => t.id === parseInt(techId));
    if (technology) {
      setTech(technology);
      setEditedNotes(technology.notes || '');
    }
  }, [techId, technologies]);

  const handleStatusChange = (newStatus) => {
    if (tech) {
      updateStatus(tech.id, newStatus);
      setTech(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveNotes = () => {
    if (tech) {
      updateNotes(tech.id, editedNotes);
      setTech(prev => prev ? { ...prev, notes: editedNotes } : null);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (tech && window.confirm(`Вы уверены, что хотите удалить технологию "${tech.title}"?`)) {
      removeTechnology(tech.id);
      navigate('/technologies');
    }
  };

  const handleLoadMoreResources = async () => {
    if (!tech) return;
    
    setLoadingResources(true);
    try {
      const newResources = await fetchAdditionalResources(tech.id);
      if (newResources.length > 0) {
        alert(`Загружено ${newResources.length} дополнительных ресурсов!`);
        // Обновляем локальное состояние
        setTech(prev => prev ? { 
          ...prev, 
          resources: [...(prev.resources || []), ...newResources] 
        } : null);
      } else {
        alert('Дополнительные ресурсы не найдены');
      }
    } catch (error) {
      alert('Ошибка при загрузке ресурсов');
    } finally {
      setLoadingResources(false);
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

  if (!tech) {
    return (
      <div className="page">
        <div className="error-state">
          <div className="error-icon">🔍</div>
          <h1>Технология не найдена</h1>
          <p>Запрошенная технология не существует или была удалена.</p>
          <Link to="/technologies" className="btn btn-primary">
            ← Назад к списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Хедер */}
      <div className="page-header">
        <div className="header-content">
          <Link to="/technologies" className="back-link">
            ← Назад к списку
          </Link>
          <h1>{tech.title}</h1>
          <p>Детальная информация о технологии</p>
        </div>
        <div className="header-actions">
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Удалить
          </button>
        </div>
      </div>

      <div className="tech-detail-content">
        {/* Основная информация */}
        <div className="detail-card main-info-card">
          <div className="card-header">
            <h2>📋 Основная информация</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Описание:</span>
              <p className="info-value description">{tech.description}</p>
            </div>
            
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Категория:</span>
                <span className="info-value">
                  {getCategoryIcon(tech.category)} {tech.category}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Сложность:</span>
                <span className="info-value">
                  {getDifficultyIcon(tech.difficulty)} {getDifficultyText(tech.difficulty)}
                </span>
              </div>
            </div>

            {tech.estimatedHours && (
              <div className="info-item">
                <span className="info-label">Ориентировочное время изучения:</span>
                <span className="info-value">⏱️ {tech.estimatedHours} часов</span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">Текущий статус:</span>
              <div className="info-value">
                <span className={`status-badge status-${tech.status}`}>
                  {getStatusIcon(tech.status)} {getStatusText(tech.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ресурсы для изучения */}
        <div className="detail-card resources-card">
          <div className="card-header">
            <h2>📚 Ресурсы для изучения</h2>
            <button 
              onClick={handleLoadMoreResources}
              disabled={loadingResources}
              className="btn btn-secondary btn-small"
            >
              {loadingResources ? '🔄 Загрузка...' : '📥 Загрузить ещё ресурсы'}
            </button>
          </div>
          
          {tech.resources && tech.resources.length > 0 ? (
            <div className="resources-list">
              {tech.resources.map((resource, index) => (
                <div key={index} className="resource-item">
                  <a 
                    href={resource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="resource-icon">🔗</span>
                    <div className="resource-content">
                      <span className="resource-title">
                        {resource.replace(/^https?:\/\//, '').split('/')[0]}
                      </span>
                      <span className="resource-url">{resource}</span>
                    </div>
                    <span className="external-icon">↗</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-resources">
              <div className="empty-icon">📚</div>
              <p>Ресурсы для изучения пока не добавлены</p>
              <button 
                onClick={handleLoadMoreResources}
                disabled={loadingResources}
                className="btn btn-primary"
              >
                {loadingResources ? '🔄 Загрузка...' : '📥 Загрузить ресурсы'}
              </button>
            </div>
          )}
        </div>

        {/* Управление статусом */}
        <div className="detail-card status-card">
          <div className="card-header">
            <h2>🎯 Управление изучением</h2>
          </div>
          <div className="status-controls">
            <div className="status-buttons">
              <button
                onClick={() => handleStatusChange('not-started')}
                className={`status-btn ${tech.status === 'not-started' ? 'active' : ''}`}
              >
                <span className="status-icon">⏳</span>
                <span className="status-text">Не начато</span>
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`status-btn ${tech.status === 'in-progress' ? 'active' : ''}`}
              >
                <span className="status-icon">🔄</span>
                <span className="status-text">В процессе</span>
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`status-btn ${tech.status === 'completed' ? 'active' : ''}`}
              >
                <span className="status-icon">✅</span>
                <span className="status-text">Изучено</span>
              </button>
            </div>
            <div className="current-status-display">
              <span className="current-status-label">Текущий статус:</span>
              <span className={`current-status status-${tech.status}`}>
                {getStatusIcon(tech.status)} {getStatusText(tech.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Заметки */}
        <div className="detail-card notes-card">
          <div className="card-header">
            <h2>📝 Мои заметки</h2>
            <div className="notes-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSaveNotes} className="btn btn-primary btn-small">
                    💾 Сохранить
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedNotes(tech.notes || '');
                    }} 
                    className="btn btn-secondary btn-small"
                  >
                    ❌ Отмена
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-small"
                >
                  ✏️ Редактировать
                </button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Добавьте ваши заметки по изучению этой технологии..."
              className="notes-textarea"
              rows="6"
            />
          ) : (
            <div className="notes-content">
              {tech.notes ? (
                <p>{tech.notes}</p>
              ) : (
                <div className="empty-notes">
                  <span>💡 Заметок пока нет. Добавьте свои мысли по изучению этой технологии.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;