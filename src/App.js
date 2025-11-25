// App.js
import React, { useState, useEffect } from 'react';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import Statistics from './components/Statistics';
import './App.css';

const App = () => {
  // Состояние для хранения массива технологий
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'HTML & CSS', 
      description: 'Изучение базовой разметки и стилей для создания веб-страниц. Основы семантической верстки, Flexbox, Grid и адаптивного дизайна.', 
      status: 'not-started' 
    },
    { 
      id: 2, 
      title: 'JavaScript Basics', 
      description: 'Освоение основ JavaScript: переменные, функции, циклы, условия. Работа с DOM, событиями и основными структурами данных.', 
      status: 'not-started' 
    },
    { 
      id: 3, 
      title: 'React Components', 
      description: 'Изучение функциональных компонентов, JSX и пропсов. Создание переиспользуемых компонентов и композиция.', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов через useState hook. Подъем состояния и управление данными между компонентами.', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'React Hooks', 
      description: 'Изучение основных хуков: useEffect, useContext, useReducer. Создание собственных хуков для переиспользования логики.', 
      status: 'not-started' 
    }
  ]);

  // Эффект для логирования изменений состояния
  useEffect(() => {
    const stats = {
      total: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length
    };
    
    console.log('📊 Обновленная статистика:', stats);
  }, [technologies]);

  // Шаг 3: Функция для обновления статуса конкретной технологии по id
  const updateTechnologyStatus = (technologyId, newStatus) => {
    console.log(`🔄 Обновление технологии ${technologyId} на статус: ${newStatus}`);
    
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => 
        technology.id === technologyId 
          ? { 
              ...technology, 
              status: newStatus,
              lastUpdated: new Date().toISOString() // Добавляем время обновления
            }
          : technology
      )
    );
  };

  // Функция для получения следующего статуса в цикле
  const getNextStatus = (currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  // Функция для обработки клика по карточке
  const handleCardClick = (technologyId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    updateTechnologyStatus(technologyId, nextStatus);
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'not-started'
      }))
    );
  };

  // Функция для отметки всех как изученных
  const markAllAsCompleted = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'completed'
      }))
    );
  };

  // Функция для добавления демо-прогресса
  const addDemoProgress = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map((technology, index) => {
        if (index === 0) return { ...technology, status: 'completed' };
        if (index === 1) return { ...technology, status: 'completed' };
        if (index === 2) return { ...technology, status: 'in-progress' };
        return technology;
      })
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Интерактивная дорожная карта разработчика</h1>
          <p>Кликайте на карточки для изменения статуса изучения технологий</p>
        </div>
      </header>

      <main className="app-main">
        {/* ProgressHeader с актуальными данными */}
        <ProgressHeader technologies={technologies} />
        <Statistics technologies={technologies} />

        {/* Панель управления */}
        <div className="control-panel">
          <h3>⚙️ Управление статусами</h3>
          <div className="control-buttons">
            <button 
              className="btn btn-demo"
              onClick={addDemoProgress}
            >
              🎯 Добавить демо-прогресс
            </button>
            <button 
              className="btn btn-success"
              onClick={markAllAsCompleted}
            >
              ✅ Отметить все как изучено
            </button>
            <button 
              className="btn btn-secondary"
              onClick={resetAllStatuses}
            >
              🔄 Сбросить все статусы
            </button>
          </div>
          <div className="instruction">
            <p>💡 <strong>Как использовать:</strong> Кликайте на любую карточку технологии для циклического переключения статусов</p>
            <div className="status-cycle-demo">
              <span className="status-badge not-started">не изучено</span>
              <span className="arrow">→</span>
              <span className="status-badge in-progress">в процессе</span>
              <span className="arrow">→</span>
              <span className="status-badge completed">изучено</span>
              <span className="arrow">→</span>
              <span className="status-badge not-started">не изучено</span>
            </div>
          </div>
        </div>

        {/* Все технологии в одном списке с возможностью изменения статуса */}
        <div className="technologies-section">
          <h2 className="main-section-title">
            📋 Все технологии ({technologies.length})
          </h2>
          <div className="technologies-grid">
            {technologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={handleCardClick}
              />
            ))}
          </div>
        </div>

        {/* Группировка по статусам для наглядности */}
        <div className="status-sections">
          {/* В процессе изучения */}
          <div className="technology-section">
            <h2 className="section-title in-progress">
              📚 В процессе изучения ({technologies.filter(t => t.status === 'in-progress').length})
            </h2>
            {technologies.filter(t => t.status === 'in-progress').length > 0 ? (
              <div className="technologies-grid">
                {technologies
                  .filter(tech => tech.status === 'in-progress')
                  .map(tech => (
                    <TechnologyCard
                      key={tech.id}
                      id={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      onStatusChange={handleCardClick}
                    />
                  ))}
              </div>
            ) : (
              <p className="empty-message">Нет технологий в процессе изучения</p>
            )}
          </div>

          {/* Изученные технологии */}
          <div className="technology-section">
            <h2 className="section-title completed">
              ✅ Изученные технологии ({technologies.filter(t => t.status === 'completed').length})
            </h2>
            {technologies.filter(t => t.status === 'completed').length > 0 ? (
              <div className="technologies-grid">
                {technologies
                  .filter(tech => tech.status === 'completed')
                  .map(tech => (
                    <TechnologyCard
                      key={tech.id}
                      id={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      onStatusChange={handleCardClick}
                    />
                  ))}
              </div>
            ) : (
              <p className="empty-message">Пока нет изученных технологий</p>
            )}
          </div>

          {/* Технологии к изучению */}
          <div className="technology-section">
            <h2 className="section-title not-started">
              🗓️ Технологии к изучению ({technologies.filter(t => t.status === 'not-started').length})
            </h2>
            {technologies.filter(t => t.status === 'not-started').length > 0 ? (
              <div className="technologies-grid">
                {technologies
                  .filter(tech => tech.status === 'not-started')
                  .map(tech => (
                    <TechnologyCard
                      key={tech.id}
                      id={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      onStatusChange={handleCardClick}
                    />
                  ))}
              </div>
            ) : (
              <p className="empty-message">Все технологии изучены! 🎉</p>
            )}
          </div>
        </div>

        {/* Отладочная информация */}
        <details className="debug-info">
          <summary>🔍 Отладочная информация (для разработки)</summary>
          <div>
            <h4>Текущее состояние технологий:</h4>
            <pre>{JSON.stringify(technologies, null, 2)}</pre>
          </div>
        </details>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Интерактивная дорожная карта • 
            Технологий: {technologies.length} • 
            Обновлено: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;