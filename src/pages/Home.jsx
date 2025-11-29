// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import QuickActions from '../components/QuickActions';
import './Home.css';

function Home() {
  const { 
    technologies, 
    progress, 
    completedCount, 
    inProgressCount, 
    totalCount,
    markAllCompleted,
    resetAllStatuses 
  } = useTechnologies();

  const recentTechnologies = technologies.slice(0, 3);
  const inProgressTech = technologies.filter(tech => tech.status === 'in-progress');

  return (
    <div className="page home-page">
      <div className="page-header">
        <h1>📊 Обзор прогресса</h1>
        <p>Добро пожаловать в ваш трекер изучения технологий!</p>
      </div>

      {/* Основная статистика */}
      <div className="stats-overview">
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
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{progress}%</div>
            <div className="stat-label">Общий прогресс</div>
          </div>
        </div>
      </div>

      {/* Основной прогресс-бар */}
      <div className="main-progress-section">
        <ProgressBar 
          progress={progress}
          label="Общий прогресс изучения"
          color="#10b981"
          animated={true}
          height={25}
          showPercentage={true}
        />
      </div>

      {/* Быстрые действия */}
      <QuickActions 
        onMarkAllCompleted={markAllCompleted}
        onResetAll={resetAllStatuses}
        technologies={technologies}
      />

      {/* Технологии в процессе */}
      {inProgressTech.length > 0 && (
        <div className="section">
          <h2>🔄 Технологии в процессе изучения</h2>
          <div className="technologies-grid compact">
            {inProgressTech.slice(0, 3).map(tech => (
              <div key={tech.id} className="technology-card compact">
                <h3>{tech.title}</h3>
                <p className="tech-description">{tech.description}</p>
                <div className="tech-meta">
                  <span className={`status status-${tech.status}`}>
                    {tech.status === 'in-progress' ? 'В процессе' : tech.status}
                  </span>
                  <Link to={`/technology/${tech.id}`} className="btn-link">
                    Продолжить →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {inProgressTech.length > 3 && (
            <div className="section-footer">
              <Link to="/technologies?filter=in-progress" className="btn btn-outline">
                Показать все ({inProgressTech.length})
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Недавние технологии */}
      <div className="section">
        <h2>📋 Недавние технологии</h2>
        {recentTechnologies.length > 0 ? (
          <>
            <div className="technologies-grid compact">
              {recentTechnologies.map(tech => (
                <div key={tech.id} className="technology-card compact">
                  <h3>{tech.title}</h3>
                  <p className="tech-description">{tech.description}</p>
                  <div className="tech-meta">
                    <span className={`status status-${tech.status}`}>
                      {tech.status === 'not-started' ? 'Не начато' : 
                       tech.status === 'in-progress' ? 'В процессе' : 'Изучено'}
                    </span>
                    <Link to={`/technology/${tech.id}`} className="btn-link">
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-footer">
              <Link to="/technologies" className="btn btn-primary">
                Смотреть все технологии
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Технологий пока нет. Добавьте первую!</p>
            <Link to="/add-technology" className="btn btn-primary">
              ➕ Добавить технологию
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;