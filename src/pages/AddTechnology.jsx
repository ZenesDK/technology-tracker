// pages/AddTechnology.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologySearch from '../components/TechnologySearch';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './AddTechnology.css';

function AddTechnology() {
  const { 
    addTechnology, 
    searchTechnologies, 
    searchResults, 
    searchLoading, 
    importTechnology,
    fetchTechnologiesFromApi,
    loading 
  } = useTechnologiesApi();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner',
    estimatedHours: '',
    resources: ''
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название технологии');
      return;
    }

    const techData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      resources: formData.resources 
        ? formData.resources.split('\n').filter(url => url.trim())
        : []
    };

    addTechnology(techData);
    
    // Показываем сообщение об успехе
    setShowSuccessMessage(true);
    
    // Сбрасываем форму
    setFormData({
      title: '',
      description: '',
      category: 'frontend',
      difficulty: 'beginner',
      estimatedHours: '',
      resources: ''
    });

    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleLoadFromApi = async () => {
    await fetchTechnologiesFromApi();
  };

  const categories = [
    { value: 'frontend', label: '🌐 Frontend' },
    { value: 'backend', label: '⚙️ Backend' },
    { value: 'database', label: '🗄️ Database' },
    { value: 'devops', label: '🔧 DevOps' },
    { value: 'mobile', label: '📱 Mobile' },
    { value: 'ai-ml', label: '🤖 AI/ML' },
    { value: 'cloud', label: '☁️ Cloud' },
    { value: 'tools', label: '🛠️ Tools' },
    { value: 'language', label: '💬 Language' },
    { value: 'other', label: '📦 Other' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: '👶 Начинающий' },
    { value: 'intermediate', label: '🚀 Продвинутый' },
    { value: 'advanced', label: '🔥 Эксперт' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <h1>Добавить технологию</h1>
          <p>Создайте новую технологию или импортируйте из базы знаний</p>
        </div>
        <Link to="/technologies" className="btn btn-secondary">
          ← Назад к списку
        </Link>
      </div>

      {/* Сообщение об успехе */}
      {showSuccessMessage && (
        <div className="success-message">
          <span>✅ Технология успешно добавлена!</span>
        </div>
      )}

      {/* Компонент поиска и импорта из API */}
      <TechnologySearch 
        onSearch={searchTechnologies}
        searchResults={searchResults}
        searchLoading={searchLoading}
        onImport={importTechnology}
      />

      <div className="add-tech-content">
        {/* Форма добавления вручную */}
        <div className="card manual-form-card">
          <div className="card-header">
            <h2>➕ Добавить вручную</h2>
            <p>Создайте пользовательскую технологию</p>
          </div>
          
          <form onSubmit={handleSubmit} className="tech-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название технологии *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Например: React, Docker, MongoDB..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Краткое описание технологии, что она делает и для чего используется..."
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty" className="form-label">
                  Сложность
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estimatedHours" className="form-label">
                Ориентировочное время изучения (часы)
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                placeholder="Например: 40"
                min="1"
                max="1000"
                className="form-input"
              />
              <small className="form-hint">
                Оставьте пустым, если не знаете точное время
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="resources" className="form-label">
                Ресурсы для изучения
              </label>
              <textarea
                id="resources"
                name="resources"
                value={formData.resources}
                onChange={handleInputChange}
                placeholder="Введите ссылки на ресурсы (каждая с новой строки):&#10;https://react.dev&#10;https://ru.reactjs.org"
                className="form-textarea"
                rows="4"
              />
              <small className="form-hint">
                Каждая ссылка должна быть на новой строке
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-large">
                ➕ Добавить технологию
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({
                  title: '',
                  description: '',
                  category: 'frontend',
                  difficulty: 'beginner',
                  estimatedHours: '',
                  resources: ''
                })}
                className="btn btn-secondary"
              >
                🗑️ Очистить форму
              </button>
            </div>
          </form>
        </div>

        {/* Блок загрузки стандартных технологий */}
        <div className="card api-actions-card">
          <div className="card-header">
            <h2>📥 Быстрая загрузка</h2>
            <p>Добавьте популярные технологии из нашей базы знаний</p>
          </div>
          
          <div className="api-actions">
            <button 
              onClick={handleLoadFromApi}
              disabled={loading}
              className="btn btn-primary btn-large load-api-btn"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Загрузка...
                </>
              ) : (
                <>
                  📚 Загрузить стандартные технологии
                </>
              )}
            </button>
            
            <div className="api-features">
              <h4>Что будет загружено:</h4>
              <ul>
                <li>✅ React - Frontend библиотека</li>
                <li>✅ Node.js - Серверный JavaScript</li>
                <li>✅ TypeScript - Типизированный JavaScript</li>
                <li>✅ MongoDB - NoSQL база данных</li>
                <li>✅ Docker - Контейнеризация приложений</li>
              </ul>
              <p className="feature-note">
                Все технологии будут добавлены со статусом "Не начато". 
                Вы можете изменить их статус в списке технологий.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Подсказки */}
      <div className="card tips-card">
        <div className="card-header">
          <h3>💡 Советы по добавлению технологий</h3>
        </div>
        <div className="tips-content">
          <div className="tip-item">
            <strong>Используйте поиск</strong>
            <p>Найдите технологию в нашей базе знаний - многие популярные технологии уже есть с готовыми описаниями и ресурсами.</p>
          </div>
          <div className="tip-item">
            <strong>Указывайте реалистичное время</strong>
            <p>Ориентировочное время изучения поможет лучше планировать ваш учебный процесс.</p>
          </div>
          <div className="tip-item">
            <strong>Добавляйте ресурсы</strong>
            <p>Ссылки на официальную документацию, туториалы и курсы помогут в изучении.</p>
          </div>
          <div className="tip-item">
            <strong>Выбирайте правильную категорию</strong>
            <p>Это поможет в фильтрации и анализе вашего прогресса по направлениям.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTechnology;