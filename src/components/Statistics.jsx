// components/Statistics.jsx
import React from 'react';
import './Statistics.css';

const Statistics = ({ technologies = [] }) => {
  // Расчет статистики
  const totalTechnologies = technologies.length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
  
  // Процент завершения
  const completionPercentage = totalTechnologies > 0 
    ? Math.round((completedCount / totalTechnologies) * 100)
    : 0;

  // Самая популярная категория (по статусу)
  const statusCounts = {
    completed: completedCount,
    'in-progress': inProgressCount,
    'not-started': notStartedCount
  };

  const mostPopularStatus = Object.keys(statusCounts).reduce((a, b) => 
    statusCounts[a] > statusCounts[b] ? a : b
  );

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'изучено',
      'in-progress': 'в процессе',
      'not-started': 'не начато'
    };
    return labels[status] || status;
  };

  // Прогресс изучения
  const getStudyProgress = () => {
    if (totalTechnologies === 0) return 'Нет данных';
    
    const studied = completedCount + (inProgressCount * 0.5); // В процессе считаем как 50%
    const progress = (studied / totalTechnologies) * 100;
    return Math.round(progress);
  };

  // Скорость изучения (если бы были даты)
  const getStudyPace = () => {
    if (completedCount === 0) return 'Еще не начато';
    if (completedCount <= 2) return 'Начальный уровень';
    if (completedCount <= totalTechnologies / 2) return 'Стабильный прогресс';
    return 'Быстрый темп';
  };

  return (
    <div className="statistics-panel">
      <h3 className="statistics-title">📊 Статистика в реальном времени</h3>
      
      <div className="statistics-grid">
        {/* Основная статистика */}
        <div className="stat-card main-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{completionPercentage}%</div>
            <div className="stat-label">Общий прогресс</div>
            <div className="stat-subtext">
              {completedCount} из {totalTechnologies} технологий
            </div>
          </div>
        </div>

        {/* Детальная статистика по статусам */}
        <div className="stat-card detailed-stat">
          <h4>Распределение по статусам</h4>
          <div className="status-bars">
            <div className="status-bar completed">
              <div className="bar-label">
                <span>Изучено</span>
                <span>{completedCount}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${(completedCount / totalTechnologies) * 100}%` }}
                ></div>
              </div>
              <div className="bar-percentage">
                {totalTechnologies > 0 ? Math.round((completedCount / totalTechnologies) * 100) : 0}%
              </div>
            </div>

            <div className="status-bar in-progress">
              <div className="bar-label">
                <span>В процессе</span>
                <span>{inProgressCount}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${(inProgressCount / totalTechnologies) * 100}%` }}
                ></div>
              </div>
              <div className="bar-percentage">
                {totalTechnologies > 0 ? Math.round((inProgressCount / totalTechnologies) * 100) : 0}%
              </div>
            </div>

            <div className="status-bar not-started">
              <div className="bar-label">
                <span>Не начато</span>
                <span>{notStartedCount}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${(notStartedCount / totalTechnologies) * 100}%` }}
                ></div>
              </div>
              <div className="bar-percentage">
                {totalTechnologies > 0 ? Math.round((notStartedCount / totalTechnologies) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Аналитика */}
        <div className="stat-card analytics-stat">
          <h4>Аналитика прогресса</h4>
          <div className="analytics-list">
            <div className="analytics-item">
              <span className="analytics-label">Самая частая категория:</span>
              <span className="analytics-value {mostPopularStatus}">
                {getStatusLabel(mostPopularStatus)}
              </span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Прогресс изучения:</span>
              <span className="analytics-value">{getStudyProgress()}%</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Темп изучения:</span>
              <span className="analytics-value">{getStudyPace()}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Осталось изучить:</span>
              <span className="analytics-value">
                {totalTechnologies - completedCount} технологий
              </span>
            </div>
          </div>
        </div>

        {/* Мини-достижения */}
        <div className="stat-card achievements-stat">
          <h4>🎖️ Достижения</h4>
          <div className="achievements-list">
            <div className={`achievement ${completedCount >= 1 ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">
                {completedCount >= 1 ? '✅' : '🔒'}
              </span>
              <span className="achievement-text">Первая технология</span>
            </div>
            <div className={`achievement ${completedCount >= 3 ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">
                {completedCount >= 3 ? '✅' : '🔒'}
              </span>
              <span className="achievement-text">Начальный уровень</span>
            </div>
            <div className={`achievement ${completionPercentage >= 50 ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">
                {completionPercentage >= 50 ? '✅' : '🔒'}
              </span>
              <span className="achievement-text">Половина пути</span>
            </div>
            <div className={`achievement ${completionPercentage === 100 ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">
                {completionPercentage === 100 ? '✅' : '🔒'}
              </span>
              <span className="achievement-text">Мастер технологий</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;