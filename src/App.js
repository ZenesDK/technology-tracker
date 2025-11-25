// App.js
import React, { useState, useEffect, useRef } from 'react';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import Statistics from './components/Statistics';
import QuickActions from './components/QuickActions';
import './App.css';

const App = () => {
  // Состояние для хранения массива технологий
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'HTML & CSS', 
      description: 'Изучение базовой разметки и стилей для создания веб-страниц.', 
      status: 'not-started' 
    },
    { 
      id: 2, 
      title: 'JavaScript Basics', 
      description: 'Освоение основ JavaScript: переменные, функции, циклы, условия.', 
      status: 'not-started' 
    },
    { 
      id: 3, 
      title: 'React Components', 
      description: 'Изучение функциональных компонентов, JSX и пропсов.', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов через useState hook.', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'React Hooks', 
      description: 'Изучение основных хуков: useEffect, useContext, useReducer.', 
      status: 'not-started' 
    }
  ]);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Состояние для подсветки выбранной технологии
  const [highlightedTech, setHighlightedTech] = useState(null);
  
  // Ref для хранения таймера подсветки
  const highlightTimerRef = useRef(null);

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

  // Функция для обновления статуса конкретной технологии по id
  const updateTechnologyStatus = (technologyId, newStatus) => {
    console.log(`🔄 Обновление технологии ${technologyId} на статус: ${newStatus}`);
    
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => 
        technology.id === technologyId 
          ? { 
              ...technology, 
              status: newStatus,
              lastUpdated: new Date().toISOString()
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

  // Функции для быстрых действий
  const handleMarkAllCompleted = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'completed'
      }))
    );
  };

  const handleResetAllStatuses = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'not-started'
      }))
    );
  };

  // Функция для случайного выбора технологии
  const handleRandomSelect = (technologyId) => {
    console.log(`🎲 Обработка случайного выбора: ${technologyId}`);
    
    // Сбрасываем предыдущую подсветку
    setHighlightedTech(null);
    
    // Очищаем предыдущий таймер
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    
    // Устанавливаем новую подсветку
    setHighlightedTech(technologyId);
    
    // Прокручиваем к выбранной технологии
    const element = document.querySelector(`[data-tech-id="${technologyId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Добавляем класс анимации
      element.classList.add('highlight-pulse');
      
      // Убираем класс анимации через 2 секунды
      setTimeout(() => {
        element.classList.remove('highlight-pulse');
      }, 2000);
    }
    
    // Автоматически меняем статус на "в процессе", если он "не начат"
    const tech = technologies.find(t => t.id === technologyId);
    if (tech && tech.status === 'not-started') {
      setTimeout(() => {
        updateTechnologyStatus(technologyId, 'in-progress');
      }, 1000);
    }
    
    // Сбрасываем подсветку через 3 секунды
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedTech(null);
    }, 3000);
  };

  // Функция для фильтрации технологий
  const getFilteredTechnologies = () => {
    switch (activeFilter) {
      case 'not-started':
        return technologies.filter(tech => tech.status === 'not-started');
      case 'in-progress':
        return technologies.filter(tech => tech.status === 'in-progress');
      case 'completed':
        return technologies.filter(tech => tech.status === 'completed');
      default:
        return technologies;
    }
  };

  // Получаем отфильтрованные технологии
  const filteredTechnologies = getFilteredTechnologies();

  // Статистика для фильтров
  const filterStats = {
    all: technologies.length,
    'not-started': technologies.filter(t => t.status === 'not-started').length,
    'in-progress': technologies.filter(t => t.status === 'in-progress').length,
    'completed': technologies.filter(t => t.status === 'completed').length
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Интерактивная дорожная карта разработчика</h1>
          <p>Управляйте прогрессом изучения технологий с помощью фильтров и быстрых действий</p>
        </div>
      </header>

      <main className="app-main">
        {/* ProgressHeader с актуальными данными */}
        <ProgressHeader technologies={technologies} />

        {/* Статистика */}
        <Statistics technologies={technologies} />

        {/* Быстрые действия */}
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={handleMarkAllCompleted}
          onResetAllStatuses={handleResetAllStatuses}
          onRandomSelect={handleRandomSelect}
        />

        {/* Фильтры */}
        <div className="filters-panel">
          <h3 className="filters-title">🔍 Фильтры технологий</h3>
          <div className="filters-grid">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span className="filter-icon">📋</span>
              <span className="filter-text">Все технологии</span>
              <span className="filter-count">{filterStats.all}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => setActiveFilter('not-started')}
            >
              <span className="filter-icon">⏳</span>
              <span className="filter-text">Не начатые</span>
              <span className="filter-count">{filterStats['not-started']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              <span className="filter-icon">🔄</span>
              <span className="filter-text">В процессе</span>
              <span className="filter-count">{filterStats['in-progress']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              <span className="filter-icon">✅</span>
              <span className="filter-text">Выполненные</span>
              <span className="filter-count">{filterStats.completed}</span>
            </button>
          </div>
        </div>

        {/* Отфильтрованные технологии */}
        <div className="technologies-section">
          <h2 className="main-section-title">
            {activeFilter === 'all' && '📋 Все технологии'}
            {activeFilter === 'not-started' && '⏳ Технологии к изучению'}
            {activeFilter === 'in-progress' && '🔄 Технологии в процессе'}
            {activeFilter === 'completed' && '✅ Изученные технологии'}
            <span className="filtered-count"> ({filteredTechnologies.length})</span>
          </h2>

          {filteredTechnologies.length > 0 ? (
            <div className="technologies-grid">
              {filteredTechnologies.map(tech => (
                <TechnologyCard
                  key={tech.id}
                  id={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                  onStatusChange={handleCardClick}
                  isHighlighted={highlightedTech === tech.id}
                />
              ))}
            </div>
          ) : (
            <div className="empty-filter-message">
              <div className="empty-icon">🔍</div>
              <h3>Технологии не найдены</h3>
              <p>
                {activeFilter === 'not-started' && 'Все технологии начаты или уже изучены!'}
                {activeFilter === 'in-progress' && 'Нет технологий в процессе изучения.'}
                {activeFilter === 'completed' && 'Пока нет изученных технологий.'}
                {activeFilter === 'all' && 'Дорожная карта пуста. Добавьте технологии!'}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveFilter('all')}
              >
                Показать все технологии
              </button>
            </div>
          )}
        </div>

        {/* Отладочная информация */}
        <details className="debug-info">
          <summary>🔍 Отладочная информация</summary>
          <div>
            <h4>Активный фильтр: {activeFilter}</h4>
            <h4>Отфильтровано: {filteredTechnologies.length} из {technologies.length}</h4>
            <h4>Подсвеченная технология: {highlightedTech || 'нет'}</h4>
            <pre>{JSON.stringify(technologies, null, 2)}</pre>
          </div>
        </details>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Интерактивная дорожная карта • 
            Технологий: {technologies.length} • 
            Фильтр: {activeFilter} •
            Обновлено: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;