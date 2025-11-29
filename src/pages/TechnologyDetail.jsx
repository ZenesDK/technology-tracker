// pages/TechnologyDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import TechnologyNotes from '../components/TechnologyNotes';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { technologies, updateStatus, updateNotes } = useTechnologies();
  
  const technology = technologies.find(t => t.id === parseInt(techId));

  if (!technology) {
    return (
      <div className="page">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h1>Технология не найдена</h1>
          <p>Технология с ID {techId} не существует или была удалена.</p>
          <div className="error-actions">
            <Link to="/technologies" className="btn btn-primary">
              ← Назад к списку
            </Link>
            <Link to="/" className="btn btn-secondary">
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateStatus(technology.id, newStatus);
  };

  const getNextStatus = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
  };

  const getStatusText = (status) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Изучено'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'not-started': '#6b7280',
      'in-progress': '#f59e0b',
      'completed': '#10b981'
    };
    return colorMap[status] || '#6b7280';
  };

  return (
    <div className="page technology-detail-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/technologies" className="back-link">
            ← Назад к списку
          </Link>
        </div>
        <div className="header-content">
          <h1>{technology.title}</h1>
          <div className="tech-category">
            <span className={`category-badge category-${technology.category}`}>
              {technology.category === 'frontend' ? '🌐 Frontend' : '⚙️ Backend'}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* Левая колонка - основная информация */}
        <div className="detail-main">
          <div className="detail-section">
            <h3>📝 Описание</h3>
            <p className="tech-description">{technology.description}</p>
          </div>

          <div className="detail-section">
            <h3>🎯 Статус изучения</h3>
            <div className="status-section">
              <div className="current-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(technology.status) }}
                ></span>
                <span className="status-text">
                  Текущий статус: <strong>{getStatusText(technology.status)}</strong>
                </span>
              </div>
              
              <ProgressBar 
                progress={technology.status === 'completed' ? 100 : technology.status === 'in-progress' ? 50 : 0}
                label="Прогресс изучения"
                color={getStatusColor(technology.status)}
                height={12}
                showPercentage={true}
              />

              <div className="status-actions">
                <p>Следующий статус: <strong>{getStatusText(getNextStatus())}</strong></p>
                <button 
                  onClick={() => handleStatusChange(getNextStatus())}
                  className="btn btn-primary"
                >
                  Перейти к {getStatusText(getNextStatus())}
                </button>
              </div>

              <div className="status-buttons">
                <button
                  onClick={() => handleStatusChange('not-started')}
                  className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                >
                  Не начато
                </button>
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                >
                  В процессе
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                >
                  Изучено
                </button>
              </div>
            </div>
          </div>

          {/* Заметки */}
          <div className="detail-section">
            <TechnologyNotes
              notes={technology.notes}
              onNotesChange={updateNotes}
              techId={technology.id}
              expandedByDefault={true}
            />
          </div>
        </div>

        {/* Правая колонка - метаданные */}
        <div className="detail-sidebar">
          <div className="meta-card">
            <h4>📊 Информация</h4>
            <div className="meta-list">
              <div className="meta-item">
                <span className="meta-label">Категория:</span>
                <span className="meta-value">
                  {technology.category === 'frontend' ? 'Frontend' : 'Backend'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ID:</span>
                <span className="meta-value">{technology.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Статус:</span>
                <span className={`meta-value status-${technology.status}`}>
                  {getStatusText(technology.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="action-card">
            <h4>⚡ Действия</h4>
            <div className="action-buttons">
              <Link to="/technologies" className="btn btn-outline">
                📋 Все технологии
              </Link>
              <Link to="/add-technology" className="btn btn-outline">
                ➕ Добавить новую
              </Link>
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                ← Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;