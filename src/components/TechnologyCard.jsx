// components/TechnologyCard.jsx
import React, { useState } from 'react';
import './TechnologyCard.css';

const TechnologyCard = ({ 
  title, 
  description, 
  initialStatus = 'not-started',
  onStatusChange 
}) => {
  // Состояние для хранения текущего статуса
  const [status, setStatus] = useState(initialStatus);

  // Функция для переключения статусов по циклу
  const handleStatusClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];
    
    console.log(`Changing status from ${status} to ${newStatus}`);
    
    setStatus(newStatus);
    
    // Вызываем колбэк, если он передан
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // Функция для определения класса статуса
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'not-started':
        return 'status-not-started';
      default:
        return 'status-default';
    }
  };

  // Функция для отображения иконки статуса
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⏳';
      default:
        return '📝';
    }
  };

  // Функция для отображения текста статуса на русском
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'изучено';
      case 'in-progress':
        return 'в процессе';
      case 'not-started':
        return 'не изучено';
      default:
        return status;
    }
  };

  // Функция для получения следующего статуса (для подсказки)
  const getNextStatus = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  return (
    <div 
      className={`technology-card ${getStatusClass(status)} clickable`}
      onClick={handleStatusClick}
      title={`Кликните для изменения статуса. Следующий статус: ${getStatusText(getNextStatus())}`}
    >
      <div className="technology-header">
        <h3 className="technology-title">{title}</h3>
        <span className="status-indicator">
          {renderStatusIcon(status)}
          <span className="status-text">{getStatusText(status)}</span>
          <span className="click-hint">👆</span>
        </span>
      </div>
      
      <div className="technology-description">
        <p>{description}</p>
      </div>
      
      {/* Индикатор следующего действия */}
      <div className="next-action-hint">
        Кликните для перехода к статусу: <strong>{getStatusText(getNextStatus())}</strong>
      </div>
      
      {/* Условное отображение дополнительной информации */}
      {status === 'completed' && (
        <div className="completion-message">
          🎉 Отлично! Эта технология освоена!
        </div>
      )}
      
      {status === 'in-progress' && (
        <div className="progress-message">
          📚 Продолжайте изучение! Вы на правильном пути.
        </div>
      )}
      
      {status === 'not-started' && (
        <div className="upcoming-message">
          🗓️ Запланировано к изучению
        </div>
      )}
    </div>
  );
};

export default TechnologyCard;