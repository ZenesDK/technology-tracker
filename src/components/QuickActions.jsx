// components/QuickActions.jsx
import React from 'react';
import './QuickActions.css';

const QuickActions = ({ 
  technologies = [], 
  onMarkAllCompleted, 
  onResetAllStatuses, 
  onRandomSelect 
}) => {
  // Проверяем, доступны ли действия
  const hasTechnologies = technologies.length > 0;
  const hasNotStarted = technologies.some(tech => tech.status === 'not-started');
  const hasInProgress = technologies.some(tech => tech.status === 'in-progress');
  const allCompleted = technologies.every(tech => tech.status === 'completed');

  // Получаем случайную невыполненную технологию
  const getRandomNotCompletedTech = () => {
    const notCompleted = technologies.filter(tech => 
      tech.status === 'not-started' || tech.status === 'in-progress'
    );
    if (notCompleted.length === 0) return null;
    const randomTech = notCompleted[Math.floor(Math.random() * notCompleted.length)];
    console.log('🎲 Случайно выбрана технология:', randomTech);
    return randomTech;
  };

  const handleRandomSelect = () => {
    const randomTech = getRandomNotCompletedTech();
    if (randomTech && onRandomSelect) {
      onRandomSelect(randomTech.id);
    } else {
      console.log('❌ Нет доступных технологий для случайного выбора');
    }
  };

  const randomTech = getRandomNotCompletedTech();

  return (
    <div className="quick-actions">
      <h3 className="actions-title">⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        <button 
          className={`action-btn mark-all-btn ${!hasTechnologies || allCompleted ? 'disabled' : ''}`}
          onClick={onMarkAllCompleted}
          disabled={!hasTechnologies || allCompleted}
          title={allCompleted ? 'Все технологии уже изучены' : 'Отметить все технологии как изученные'}
        >
          <span className="action-icon">✅</span>
          <span className="action-text">Отметить все как выполненные</span>
          {allCompleted && <span className="action-badge">Готово</span>}
        </button>

        <button 
          className={`action-btn reset-all-btn ${!hasTechnologies ? 'disabled' : ''}`}
          onClick={onResetAllStatuses}
          disabled={!hasTechnologies}
          title="Сбросить статусы всех технологий"
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Сбросить все статусы</span>
        </button>

        <button 
          className={`action-btn random-btn ${!hasNotStarted && !hasInProgress ? 'disabled' : ''}`}
          onClick={handleRandomSelect}
          disabled={!hasNotStarted && !hasInProgress}
          title={!hasNotStarted && !hasInProgress ? 'Все технологии изучены' : 'Выбрать случайную технологию для изучения'}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">Случайный выбор</span>
          {randomTech && (
            <span className="action-hint">Следующая: {randomTech.title}</span>
          )}
        </button>
      </div>

      {/* Статус действий */}
      <div className="actions-status">
        <div className="status-item">
          <span className="status-dot not-started"></span>
          <span>Не начато: {technologies.filter(t => t.status === 'not-started').length}</span>
        </div>
        <div className="status-item">
          <span className="status-dot in-progress"></span>
          <span>В процессе: {technologies.filter(t => t.status === 'in-progress').length}</span>
        </div>
        <div className="status-item">
          <span className="status-dot completed"></span>
          <span>Выполнено: {technologies.filter(t => t.status === 'completed').length}</span>
        </div>
      </div>

      {/* Отладочная информация */}
      {randomTech && (
        <div className="random-tech-info">
          <small>Случайный выбор: "{randomTech.title}" (ID: {randomTech.id})</small>
        </div>
      )}
    </div>
  );
};

export default QuickActions;