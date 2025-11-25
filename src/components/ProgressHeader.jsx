// components/ProgressHeader.jsx
import React from 'react';
import './ProgressHeader.css';

const ProgressHeader = ({ technologies = [] }) => {
  // Рассчитываем статистику на основе актуальных данных
  const totalTechnologies = technologies.length;
  const learnedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressTechnologies = technologies.filter(tech => tech.status === 'in-progress').length;
  const notLearnedTechnologies = technologies.filter(tech => tech.status === 'not-started').length;
  
  // Рассчитываем процент выполнения
  const completionPercentage = totalTechnologies > 0 
    ? Math.round((learnedTechnologies / totalTechnologies) * 100)
    : 0;

  // Определяем цвет прогресс-бара в зависимости от процента
  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    if (percentage >= 20) return 'low';
    return 'very-low';
  };

  // Определяем текст в зависимости от прогресса
  const getProgressText = (percentage) => {
    if (percentage === 0) return 'Начните изучение первой технологии!';
    if (percentage === 100) return 'Поздравляем! Все технологии изучены! 🎉';
    if (percentage >= 80) return 'Отличный прогресс! Почти у цели!';
    if (percentage >= 50) return 'Хорошие результаты! Продолжайте в том же духе!';
    if (percentage >= 20) return 'Прогресс есть! Не останавливайтесь!';
    return 'Сделаны первые шаги! Впереди много интересного!';
  };

  const progressColor = getProgressBarColor(completionPercentage);
  const progressText = getProgressText(completionPercentage);

  return (
    <div className="progress-header">
      {/* Основная статистика */}
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-number">{totalTechnologies}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-item learned">
          <span className="stat-number">{learnedTechnologies}</span>
          <span className="stat-label">Изучено</span>
        </div>
        
        <div className="stat-item in-progress">
          <span className="stat-number">{inProgressTechnologies}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-item not-learned">
          <span className="stat-number">{notLearnedTechnologies}</span>
          <span className="stat-label">Осталось</span>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="progress-bar-section">
        <div className="progress-info">
          <span className="progress-percentage">{completionPercentage}%</span>
          <span className="progress-text">{progressText}</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className={`progress-bar ${progressColor}`}
            style={{ width: `${completionPercentage}%` }}
          >
            <div className="progress-fill"></div>
          </div>
        </div>
        
        <div className="progress-details">
          <span>
            Изучено: {learnedTechnologies} из {totalTechnologies} технологий
          </span>
          {inProgressTechnologies > 0 && (
            <span className="in-progress-count">
              В процессе изучения: {inProgressTechnologies}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;