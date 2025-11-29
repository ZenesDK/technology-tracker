// pages/Statistics.jsx
import React from 'react';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

function Statistics() {
  const { 
    technologies, 
    progress, 
    completedCount, 
    inProgressCount, 
    totalCount,
    categoryStats 
  } = useTechnologies();

  const notStartedCount = totalCount - completedCount - inProgressCount;

  // Статистика по статусам
  const statusStats = [
    { label: 'Изучено', count: completedCount, color: '#10b981', percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0 },
    { label: 'В процессе', count: inProgressCount, color: '#f59e0b', percentage: totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0 },
    { label: 'Не начато', count: notStartedCount, color: '#6b7280', percentage: totalCount > 0 ? (notStartedCount / totalCount) * 100 : 0 }
  ];

  // Самые изучаемые технологии (в процессе)
  const topInProgress = technologies
    .filter(tech => tech.status === 'in-progress')
    .slice(0, 5);

  // Недавно изученные технологии
  const recentlyCompleted = technologies
    .filter(tech => tech.status === 'completed')
    .slice(0, 5);

  return (
    <div className="page statistics-page">
      <div className="page-header">
        <h1>📈 Статистика прогресса</h1>
        <p>Анализ вашего прогресса в изучении технологий</p>
      </div>

      {/* Основная статистика */}
      <div className="stats-grid">
        <div className="stat-card main-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{progress}%</div>
            <div className="stat-label">Общий прогресс</div>
            <ProgressBar 
              progress={progress}
              height={8}
              showPercentage={false}
              color="#10b981"
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{totalCount}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Изучено</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-number">{inProgressCount}</div>
            <div className="stat-label">В процессе</div>
          </div>
        </div>
      </div>

      {/* Распределение по статусам */}
      <div className="section">
        <h2>📊 Распределение по статусам</h2>
        <div className="status-distribution">
          {statusStats.map((stat, index) => (
            <div key={index} className="status-stat">
              <div className="status-header">
                <span 
                  className="status-color" 
                  style={{ backgroundColor: stat.color }}
                ></span>
                <span className="status-label">{stat.label}</span>
                <span className="status-count">{stat.count}</span>
              </div>
              <ProgressBar 
                progress={stat.percentage}
                height={12}
                showPercentage={true}
                color={stat.color}
              />
              <div className="status-percentage">
                {Math.round(stat.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Прогресс по категориям */}
      <div className="section">
        <h2>🌐 Прогресс по категориям</h2>
        <div className="category-progress-grid">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const categoryProgress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            return (
              <div key={category} className="category-progress-card">
                <div className="category-header">
                  <span className="category-icon">
                    {category === 'frontend' ? '🌐' : '⚙️'}
                  </span>
                  <span className="category-name">
                    {category === 'frontend' ? 'Frontend' : 'Backend'}
                  </span>
                  <span className="category-stats">
                    {stats.completed}/{stats.total}
                  </span>
                </div>
                <ProgressBar 
                  progress={categoryProgress}
                  label={`${categoryProgress}% изучено`}
                  height={16}
                  showPercentage={false}
                  color={category === 'frontend' ? '#3b82f6' : '#8b5cf6'}
                  animated={true}
                />
                <div className="category-details">
                  <div className="detail-item">
                    <span>Изучено:</span>
                    <span>{stats.completed}</span>
                  </div>
                  <div className="detail-item">
                    <span>Всего:</span>
                    <span>{stats.total}</span>
                  </div>
                  <div className="detail-item">
                    <span>Прогресс:</span>
                    <span>{categoryProgress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-row">
        {/* Самые изучаемые технологии */}
        <div className="section half-width">
          <h2>🔥 В процессе изучения</h2>
          {topInProgress.length > 0 ? (
            <div className="tech-list">
              {topInProgress.map(tech => (
                <div key={tech.id} className="tech-list-item">
                  <span className="tech-name">{tech.title}</span>
                  <span className="tech-category">
                    {tech.category === 'frontend' ? '🌐' : '⚙️'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Нет технологий в процессе изучения</p>
          )}
        </div>

        {/* Недавно изученные */}
        <div className="section half-width">
          <h2>✅ Недавно изученные</h2>
          {recentlyCompleted.length > 0 ? (
            <div className="tech-list">
              {recentlyCompleted.map(tech => (
                <div key={tech.id} className="tech-list-item completed">
                  <span className="tech-name">{tech.title}</span>
                  <span className="tech-category">
                    {tech.category === 'frontend' ? '🌐' : '⚙️'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Пока нет изученных технологий</p>
          )}
        </div>
      </div>

      {/* Достижения */}
      <div className="section">
        <h2>🏆 Достижения</h2>
        <div className="achievements-grid">
          <div className={`achievement ${completedCount >= 1 ? 'unlocked' : 'locked'}`}>
            <span className="achievement-icon">
              {completedCount >= 1 ? '✅' : '🔒'}
            </span>
            <div className="achievement-content">
              <h4>Первые шаги</h4>
              <p>Изучите первую технологию</p>
            </div>
          </div>

          <div className={`achievement ${completedCount >= 3 ? 'unlocked' : 'locked'}`}>
            <span className="achievement-icon">
              {completedCount >= 3 ? '✅' : '🔒'}
            </span>
            <div className="achievement-content">
              <h4>Начальный уровень</h4>
              <p>Изучите 3 технологии</p>
            </div>
          </div>

          <div className={`achievement ${progress >= 50 ? 'unlocked' : 'locked'}`}>
            <span className="achievement-icon">
              {progress >= 50 ? '✅' : '🔒'}
            </span>
            <div className="achievement-content">
              <h4>Полпути</h4>
              <p>Достигните 50% прогресса</p>
            </div>
          </div>

          <div className={`achievement ${progress === 100 ? 'unlocked' : 'locked'}`}>
            <span className="achievement-icon">
              {progress === 100 ? '✅' : '🔒'}
            </span>
            <div className="achievement-content">
              <h4>Мастер технологий</h4>
              <p>Изучите все технологии</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;