// pages/Statistics.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './Statistics.css';

function Statistics() {
  const { 
    technologies, 
    progress, 
    completedCount, 
    inProgressCount 
  } = useTechnologiesApi();

  // Расчет статистики по категориям
  const categoryStats = useMemo(() => {
    const stats = {};
    
    technologies.forEach(tech => {
      if (!stats[tech.category]) {
        stats[tech.category] = { 
          total: 0, 
          completed: 0, 
          inProgress: 0, 
          notStarted: 0,
          totalHours: 0,
          completedHours: 0
        };
      }
      
      stats[tech.category].total++;
      
      if (tech.status === 'completed') {
        stats[tech.category].completed++;
        if (tech.estimatedHours) {
          stats[tech.category].completedHours += tech.estimatedHours;
        }
      } else if (tech.status === 'in-progress') {
        stats[tech.category].inProgress++;
      } else {
        stats[tech.category].notStarted++;
      }
      
      if (tech.estimatedHours) {
        stats[tech.category].totalHours += tech.estimatedHours;
      }
    });
    
    return stats;
  }, [technologies]);

  // Получаем все уникальные категории
  const allCategories = useMemo(() => {
    const categories = new Set(technologies.map(tech => tech.category));
    return Array.from(categories).sort();
  }, [technologies]);

  // Статистика по сложности
  const difficultyStats = useMemo(() => {
    const stats = { beginner: 0, intermediate: 0, advanced: 0 };
    
    technologies.forEach(tech => {
      if (stats[tech.difficulty] !== undefined) {
        stats[tech.difficulty]++;
      }
    });
    
    return stats;
  }, [technologies]);

  // Самые изучаемые технологии (в процессе)
  const mostInProgress = useMemo(() => {
    return technologies
      .filter(tech => tech.status === 'in-progress')
      .sort((a, b) => (b.estimatedHours || 0) - (a.estimatedHours || 0))
      .slice(0, 5);
  }, [technologies]);

  // Ближайшие к завершению
  const almostCompleted = useMemo(() => {
    return technologies
      .filter(tech => tech.status === 'in-progress')
      .sort((a, b) => (a.estimatedHours || 0) - (b.estimatedHours || 0))
      .slice(0, 5);
  }, [technologies]);

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

  const getCategoryName = (category) => {
    const names = {
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Базы данных',
      devops: 'DevOps',
      mobile: 'Мобильная разработка',
      'ai-ml': 'AI/ML',
      cloud: 'Облачные технологии', 
      tools: 'Инструменты',
      language: 'Языки программирования',
      other: 'Другое'
    };
    return names[category] || category;
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '👶';
      case 'intermediate': return '🚀';
      case 'advanced': return '🔥';
      default: return '📚';
    }
  };

  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Продвинутый';
      case 'advanced': return 'Эксперт';
      default: return 'Не указано';
    }
  };

  if (technologies.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="header-content">
            <h1>📊 Статистика</h1>
            <p>Анализ вашего прогресса в изучении технологий</p>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Данных для статистики пока нет</h3>
          <p>Добавьте технологии чтобы отслеживать ваш прогресс</p>
          <Link to="/add-technology" className="btn btn-primary">
            Добавить технологии
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <h1>📊 Статистика</h1>
          <p>Анализ вашего прогресса в изучении технологий</p>
        </div>
        <Link to="/technologies" className="btn btn-secondary">
          ← Назад к списку
        </Link>
      </div>

      {/* Основная статистика */}
      <div className="stats-overview">
        <div className="stat-card main-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{progress}%</div>
            <div className="stat-label">Общий прогресс</div>
            <div className="stat-subtext">
              {completedCount} из {technologies.length} технологий изучено
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Изучено</div>
            <div className="stat-subtext">Технологий</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-value">{inProgressCount}</div>
            <div className="stat-label">В процессе</div>
            <div className="stat-subtext">Изучения</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">
              {technologies.length - completedCount - inProgressCount}
            </div>
            <div className="stat-label">Осталось</div>
            <div className="stat-subtext">Начать изучение</div>
          </div>
        </div>
      </div>

      {/* Прогресс по категориям */}
      <div className="section">
        <h2>📈 Прогресс по категориям</h2>
        <div className="categories-grid">
          {allCategories.map(category => {
            const stat = categoryStats[category];
            const categoryProgress = stat.total > 0 
              ? Math.round((stat.completed / stat.total) * 100) 
              : 0;
            
            return (
              <div key={category} className="category-card">
                <div className="category-header">
                  <span className="category-icon">
                    {getCategoryIcon(category)}
                  </span>
                  <h3>{getCategoryName(category)}</h3>
                </div>
                
                <div className="category-stats">
                  <div className="progress-circle">
                    <div 
                      className="progress-ring"
                      style={{
                        background: `conic-gradient(#667eea ${categoryProgress * 3.6}deg, #e9ecef 0deg)`
                      }}
                    >
                      <div className="progress-text">
                        {categoryProgress}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="stats-details">
                    <div className="stat-row">
                      <span className="stat-label">Всего:</span>
                      <span className="stat-value">{stat.total}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label completed">✅ Изучено:</span>
                      <span className="stat-value">{stat.completed}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label in-progress">🔄 В процессе:</span>
                      <span className="stat-value">{stat.inProgress}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label not-started">⏳ Осталось:</span>
                      <span className="stat-value">{stat.notStarted}</span>
                    </div>
                    {stat.totalHours > 0 && (
                      <div className="stat-row">
                        <span className="stat-label">⏱️ Часов:</span>
                        <span className="stat-value">{stat.totalHours}ч</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-columns">
        {/* Статистика по сложности */}
        <div className="section">
          <h2>🎚️ Распределение по сложности</h2>
          <div className="difficulty-stats">
            {Object.entries(difficultyStats).map(([difficulty, count]) => (
              <div key={difficulty} className="difficulty-item">
                <div className="difficulty-header">
                  <span className="difficulty-icon">
                    {getDifficultyIcon(difficulty)}
                  </span>
                  <span className="difficulty-name">
                    {getDifficultyName(difficulty)}
                  </span>
                </div>
                <div className="difficulty-count">
                  {count} технологий
                </div>
                <div className="difficulty-percentage">
                  {Math.round((count / technologies.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Активное изучение */}
        <div className="section">
          <h2>🔥 В активном изучении</h2>
          <div className="active-learning">
            {mostInProgress.length > 0 ? (
              mostInProgress.map(tech => (
                <div key={tech.id} className="learning-item">
                  <div className="tech-info">
                    <h4>{tech.title}</h4>
                    <span className="tech-category">
                      {getCategoryIcon(tech.category)} {getCategoryName(tech.category)}
                    </span>
                  </div>
                  {tech.estimatedHours && (
                    <div className="tech-hours">
                      ⏱️ {tech.estimatedHours}ч
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-learning">
                <p>Нет технологий в процессе изучения</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Близкие к завершению */}
      <div className="section">
        <h2>🏁 Близкие к завершению</h2>
        <div className="completion-list">
          {almostCompleted.length > 0 ? (
            almostCompleted.map(tech => (
              <div key={tech.id} className="completion-item">
                <div className="tech-main">
                  <h4>{tech.title}</h4>
                  <p>{tech.description}</p>
                </div>
                <div className="tech-meta">
                  <span className="category">
                    {getCategoryIcon(tech.category)} {getCategoryName(tech.category)}
                  </span>
                  {tech.estimatedHours && (
                    <span className="hours">⏱️ {tech.estimatedHours}ч</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-completion">
              <p>Нет технологий близких к завершению</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;