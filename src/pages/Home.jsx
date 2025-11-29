// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import DailyQuote from '../components/DailyQuote';
import './Home.css';

function Home() {
  const { 
    technologies, 
    progress, 
    completedCount, 
    inProgressCount,
    dailyQuote,
    quoteLoading,
    fetchDailyQuote
  } = useTechnologiesApi();

  // Получаем последние добавленные технологии
  const recentTechnologies = technologies
    .sort((a, b) => new Date(b.importedAt || b.id) - new Date(a.importedAt || a.id))
    .slice(0, 3);

  // Получаем технологии в процессе изучения
  const inProgressTechs = technologies
    .filter(tech => tech.status === 'in-progress')
    .slice(0, 3);

  // Статистика по категориям для главной страницы
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
  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

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

  const getCategoryName = (category) => {
    const names = {
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
    return names[category] || category;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Изучено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  return (
    <div className="page">
      {/* Заголовок */}
      <div className="page-header">
        <div className="header-content">
          <h1>🚀 Добро пожаловать в TechTracker</h1>
          <p>Отслеживайте ваш прогресс в изучении технологий и становитесь лучше каждый день</p>
        </div>
        <div className="header-actions">
          <Link to="/add-technology" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
        </div>
      </div>

      {/* Ежедневная цитата */}
      <DailyQuote 
        quote={dailyQuote}
        loading={quoteLoading}
        onRefresh={fetchDailyQuote}
      />

      {/* Основная статистика */}
      <div className="stats-section">
        <h2>📊 Ваш прогресс</h2>
        <div className="stats-grid">
          <div className="stat-card main-stat">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{progress}%</div>
              <div className="stat-label">Общий прогресс</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Изучено</div>
              <div className="stat-subtext">технологий</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{inProgressCount}</div>
              <div className="stat-label">В процессе</div>
              <div className="stat-subtext">изучения</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{technologies.length}</div>
              <div className="stat-label">Всего</div>
              <div className="stat-subtext">в трекере</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Технологии в процессе изучения */}
        <div className="content-section">
          <div className="section-header">
            <h2>🔥 В активном изучении</h2>
            <Link to="/technologies" className="view-all-link">
              Все технологии →
            </Link>
          </div>
          
          {inProgressTechs.length > 0 ? (
            <div className="tech-cards">
              {inProgressTechs.map(tech => (
                <div key={tech.id} className="tech-card">
                  <div className="tech-header">
                    <h3>{tech.title}</h3>
                    <span className="status-badge in-progress">
                      {getStatusIcon(tech.status)} {getStatusText(tech.status)}
                    </span>
                  </div>
                  <p className="tech-description">{tech.description}</p>
                  <div className="tech-meta">
                    <span className="category">
                      {getCategoryIcon(tech.category)} {getCategoryName(tech.category)}
                    </span>
                    {tech.estimatedHours && (
                      <span className="hours">⏱️ {tech.estimatedHours}ч</span>
                    )}
                  </div>
                  <Link 
                    to={`/technology/${tech.id}`}
                    className="btn btn-secondary btn-small"
                  >
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>
              <h4>Нет активных технологий</h4>
              <p>Начните изучение какой-нибудь технологии чтобы увидеть её здесь</p>
              <Link to="/technologies" className="btn btn-primary">
                Перейти к технологиям
              </Link>
            </div>
          )}
        </div>

        {/* Последние добавленные */}
        <div className="content-section">
          <div className="section-header">
            <h2>🆕 Недавно добавленные</h2>
            <Link to="/add-technology" className="view-all-link">
              Добавить ещё →
            </Link>
          </div>
          
          {recentTechnologies.length > 0 ? (
            <div className="tech-cards">
              {recentTechnologies.map(tech => (
                <div key={tech.id} className="tech-card">
                  <div className="tech-header">
                    <h3>{tech.title}</h3>
                    <span className={`status-badge ${tech.status}`}>
                      {getStatusIcon(tech.status)} {getStatusText(tech.status)}
                    </span>
                  </div>
                  <p className="tech-description">{tech.description}</p>
                  <div className="tech-meta">
                    <span className="category">
                      {getCategoryIcon(tech.category)} {getCategoryName(tech.category)}
                    </span>
                    <span className="difficulty">
                      {tech.difficulty === 'beginner' && '👶'}
                      {tech.difficulty === 'intermediate' && '🚀'}
                      {tech.difficulty === 'advanced' && '🔥'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4>Пока нет технологий</h4>
              <p>Добавьте первую технологию чтобы начать отслеживать прогресс</p>
              <Link to="/add-technology" className="btn btn-primary">
                Добавить технологию
              </Link>
            </div>
          )}
        </div>

        {/* Популярные категории */}
        <div className="content-section">
          <div className="section-header">
            <h2>🏆 Популярные категории</h2>
            <Link to="/statistics" className="view-all-link">
              Вся статистика →
            </Link>
          </div>
          
          {topCategories.length > 0 ? (
            <div className="category-cards">
              {topCategories.map(([category, count]) => (
                <div key={category} className="category-card">
                  <div className="category-icon">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="category-content">
                    <h4>{getCategoryName(category)}</h4>
                    <p>{count} технологий</p>
                  </div>
                  <div className="category-percentage">
                    {Math.round((count / technologies.length) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h4>Нет данных по категориям</h4>
              <p>Добавьте технологии чтобы увидеть распределение по категориям</p>
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="content-section">
          <div className="section-header">
            <h2>⚡ Быстрые действия</h2>
          </div>
          <div className="quick-actions">
            <Link to="/add-technology" className="quick-action-card">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4>Добавить технологию</h4>
                <p>Создайте новую карточку технологии</p>
              </div>
            </Link>

            <Link to="/technologies" className="quick-action-card">
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h4>Все технологии</h4>
                <p>Просмотр и управление всеми технологиями</p>
              </div>
            </Link>

            <Link to="/statistics" className="quick-action-card">
              <div className="action-icon">📈</div>
              <div className="action-content">
                <h4>Статистика</h4>
                <p>Подробная аналитика вашего прогресса</p>
              </div>
            </Link>

            <Link to="/settings" className="quick-action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-content">
                <h4>Настройки</h4>
                <p>Управление данными и экспорт</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Мотивационная секция */}
      {technologies.length > 0 && (
        <div className="motivation-section">
          <div className="motivation-content">
            <h3>🎯 Продолжайте в том же духе!</h3>
            <p>
              Вы уже изучили {completedCount} из {technologies.length} технологий. 
              {inProgressCount > 0 ? ` Сейчас в работе: ${inProgressCount} технологий.` : ''}
              {progress < 50 ? ' Каждый маленький шаг приближает к большой цели!' : 
               progress < 80 ? ' Отличный прогресс! Продолжайте двигаться вперед!' :
               ' Почти у цели! Осталось совсем немного!'}
            </p>
            <div className="motivation-actions">
              <Link to="/technologies" className="btn btn-primary">
                Продолжить изучение
              </Link>
              <Link to="/add-technology" className="btn btn-secondary">
                Добавить ещё
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;