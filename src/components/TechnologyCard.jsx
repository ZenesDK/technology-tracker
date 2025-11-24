// TechnologyCard.jsx
import React from 'react';
import './TechnologyCard.css';

const TechnologyCard = ({ title, description, status }) => {
  // Функция для определения класса статуса
  const getStatusClass = (status) => {
    switch (status) {
      case 'изучено':
        return 'status-learned';
      case 'в процессе':
        return 'status-in-progress';
      case 'не изучено':
        return 'status-not-learned';
      default:
        return 'status-default';
    }
  };

  // Функция для получения случайного прогресса (для демонстрации)
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  return (
    <div className={`technology-card ${getStatusClass(status)}`}>
      <div className="technology-header">
        <h3 className="technology-title">{title}</h3>
        <span className="status-indicator">
          <span className="status-icon"></span>
          <span className="status-text">{status}</span>
        </span>
      </div>
      
      <div className="technology-description">
        <p>{description}</p>
      </div>
      
      {/* Прогресс-бар для статуса "в процессе" */}
      {status === 'в процессе' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getRandomProgress()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Прогресс изучения: {getRandomProgress()}%
          </div>
        </div>
      )}
      
      {/* Условное отображение дополнительной информации */}
      {status === 'изучено' && (
        <div className="completion-message">
          <span>✅</span>
          <span>Отлично! Эта технология полностью освоена!</span>
        </div>
      )}
      
      {status === 'в процессе' && (
        <div className="progress-message">
          <span>📚</span>
          <span>Продолжайте изучение! Вы на правильном пути.</span>
        </div>
      )}
      
      {status === 'не изучено' && (
        <div className="upcoming-message">
          <span>🗓️</span>
          <span>Запланировано к изучению в ближайшее время</span>
        </div>
      )}
    </div>
  );
};

export default TechnologyCard;