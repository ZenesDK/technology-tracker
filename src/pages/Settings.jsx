// pages/Settings.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import DataExporter from '../components/DataExporter';
import DataImporter from '../components/DataImporter';
import './Settings.css';

function Settings() {
  const { 
    technologies, 
    markAllCompleted, 
    resetAllStatuses,
    addTechnology,
    removeAllTechnologies
  } = useTechnologiesApi();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Функция для обработки импорта
  const handleImport = (importedTechnologies) => {
    importedTechnologies.forEach(tech => {
      addTechnology(tech);
    });
  };

  // Функция для удаления всех технологий
  const handleDeleteAll = () => {
    removeAllTechnologies();
    setShowDeleteAllConfirm(false);
  };

  const handleMarkAllCompleted = () => {
    markAllCompleted();
  };

  const handleResetAllStatuses = () => {
    resetAllStatuses();
    setShowResetConfirm(false);
  };

  const getCategoryStats = () => {
    const stats = {};
    technologies.forEach(tech => {
      if (!stats[tech.category]) {
        stats[tech.category] = 0;
      }
      stats[tech.category]++;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Функция для получения русских названий категорий
  const getCategoryName = (category) => {
    const categoryNames = {
      'frontend': 'Frontend',
      'backend': 'Backend', 
      'database': 'Базы данных',
      'devops': 'DevOps',
      'mobile': 'Мобильная разработка',
      'ai-ml': 'AI/ML',
      'cloud': 'Облачные технологии',
      'tools': 'Инструменты',
      'language': 'Языки программирования',
      'other': 'Другое'
    };
    return categoryNames[category] || category;
  };

  // Функция для получения иконок категорий
  const getCategoryIcon = (category) => {
    const icons = {
      'frontend': '🌐',
      'backend': '⚙️',
      'database': '🗄️',
      'devops': '🔧',
      'mobile': '📱',
      'ai-ml': '🤖',
      'cloud': '☁️',
      'tools': '🛠️',
      'language': '💬',
      'other': '📦'
    };
    return icons[category] || '📦';
  };

  // Сортируем категории по количеству технологий (по убыванию)
  const sortedCategories = Object.entries(categoryStats)
    .sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <h1>⚙️ Настройки</h1>
          <p>Управление вашим трекером технологий</p>
        </div>
        <Link to="/technologies" className="btn btn-secondary">
          ← Назад к списку
        </Link>
      </div>

      {/* Статистика */}
      <div className="settings-section">
        <h2>📊 Общая статистика</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{technologies.length}</div>
              <div className="stat-label">Всего технологий</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">
                {technologies.filter(t => t.status === 'completed').length}
              </div>
              <div className="stat-label">Изучено</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">
                {technologies.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="stat-label">В процессе</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <div className="stat-value">{Object.keys(categoryStats).length}</div>
              <div className="stat-label">Категорий</div>
            </div>
          </div>
        </div>

        {/* Статистика по категориям */}
        {sortedCategories.length > 0 && (
          <div className="category-stats">
            <h4>📈 Распределение по категориям:</h4>
            <div className="category-bars">
              {sortedCategories.map(([category, count]) => (
                <div key={category} className="category-bar">
                  <div className="category-info">
                    <div className="category-name-wrapper">
                      <span className="category-icon">
                        {getCategoryIcon(category)}
                      </span>
                      <span className="category-name">
                        {getCategoryName(category)}
                      </span>
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${(count / technologies.length) * 100}%` 
                      }}
                      title={`${count} технологий (${Math.round((count / technologies.length) * 100)}%)`}
                    ></div>
                  </div>
                  <div className="category-percentage">
                    {Math.round((count / technologies.length) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Управление статусами */}
      <div className="settings-section">
        <h2>🎯 Управление прогрессом</h2>
        <p>Массовые операции с статусами изучения</p>
        
        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">✅</div>
            <div className="action-content">
              <h4>Отметить все как изучено</h4>
              <p>Установит статус "Изучено" для всех технологий</p>
            </div>
            <button 
              onClick={handleMarkAllCompleted}
              className="btn btn-primary"
              disabled={technologies.length === 0}
            >
              Применить
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">🔄</div>
            <div className="action-content">
              <h4>Сбросить все статусы</h4>
              <p>Вернет все технологии к статусу "Не начато"</p>
            </div>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-secondary"
              disabled={technologies.length === 0}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Экспорт данных */}
      <div className="settings-section">
        <h2>📤 Экспорт данных</h2>
        <p>Сохраните ваши технологии в файл для резервного копирования или переноса</p>
        <DataExporter technologies={technologies} />
      </div>

      {/* Импорт данных */}
      <div className="settings-section">
        <h2>📥 Импорт данных</h2>
        <p>Загрузите технологии из файла экспорта</p>
        <DataImporter 
          onImport={handleImport}
          existingTechnologies={technologies}
        />
      </div>

      {/* Опасная зона */}
      <div className="settings-section danger-zone">
        <h2>🚨 Опасная зона</h2>
        <p>Действия, которые нельзя отменить</p>
        
        <div className="action-cards">
          <div className="action-card danger">
            <div className="action-icon">🗑️</div>
            <div className="action-content">
              <h4>Удалить все технологии</h4>
              <p>Полностью очистит ваш трекер. Это действие нельзя отменить!</p>
            </div>
            <button 
              onClick={() => setShowDeleteAllConfirm(true)}
              className="btn btn-danger"
              disabled={technologies.length === 0}
            >
              Удалить всё
            </button>
          </div>
        </div>
      </div>

      {/* Модальные окна подтверждения */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>🔄 Сбросить все статусы?</h3>
            </div>
            <div className="modal-content">
              <p>Это действие установит статус "Не начато" для всех {technologies.length} технологий.</p>
              <p>Вы уверены, что хотите продолжить?</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="btn btn-secondary"
              >
                Отмена
              </button>
              <button 
                onClick={handleResetAllStatuses}
                className="btn btn-primary"
              >
                Да, сбросить
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAllConfirm && (
        <div className="modal-overlay">
          <div className="modal danger">
            <div className="modal-header">
              <h3>🚨 Удалить все технологии?</h3>
            </div>
            <div className="modal-content">
              <p>Это действие удалит все {technologies.length} технологий из вашего трекера.</p>
              <p><strong>Это действие нельзя отменить!</strong></p>
              <p>Вы уверены, что хотите продолжить?</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteAllConfirm(false)}
                className="btn btn-secondary"
              >
                Отмена
              </button>
              <button 
                onClick={handleDeleteAll}
                className="btn btn-danger"
              >
                Да, удалить всё
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;