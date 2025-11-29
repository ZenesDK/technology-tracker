// pages/AddTechnology.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { addTechnology, technologies } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    notes: ''
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание технологии обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    // Проверка на дубликаты
    const isDuplicate = technologies.some(
      tech => tech.title.toLowerCase() === formData.title.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      newErrors.title = 'Технология с таким названием уже существует';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addTechnology(formData);
      setShowSuccessModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/technologies');
  };

  const handleAddAnother = () => {
    setFormData({
      title: '',
      description: '',
      category: 'frontend',
      status: 'not-started',
      notes: ''
    });
    setShowSuccessModal(false);
    setErrors({});
  };

  return (
    <div className="page add-technology-page">
      <div className="page-header">
        <h1>➕ Добавить технологию</h1>
        <p>Заполните информацию о новой технологии для изучения</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="tech-form">
          <div className="form-section">
            <h3>Основная информация</h3>
            
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
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Например: React Hooks, Node.js Express, MongoDB"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Опишите, что представляет собой эта технология, для чего используется..."
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
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
                  <option value="frontend">🌐 Frontend</option>
                  <option value="backend">⚙️ Backend</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Начальный статус
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="not-started">⏳ Не начато</option>
                  <option value="in-progress">🔄 В процессе</option>
                  <option value="completed">✅ Изучено</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Дополнительная информация</h3>
            
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Первоначальные заметки
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
                placeholder="Можете добавить начальные заметки, ссылки на документацию или план изучения..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/technologies')}
              className="btn btn-secondary"
            >
              ← Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              ➕ Добавить технологию
            </button>
          </div>
        </form>
      </div>

      {/* Модальное окно успеха */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="✅ Технология добавлена!"
        size="md"
      >
        <div className="success-modal-content">
          <p>Технология <strong>"{formData.title}"</strong> успешно добавлена в ваш трекер!</p>
          
          <div className="success-details">
            <div className="success-detail">
              <strong>Категория:</strong> 
              {formData.category === 'frontend' ? '🌐 Frontend' : '⚙️ Backend'}
            </div>
            <div className="success-detail">
              <strong>Статус:</strong> 
              {formData.status === 'not-started' ? '⏳ Не начато' : 
               formData.status === 'in-progress' ? '🔄 В процессе' : '✅ Изучено'}
            </div>
          </div>

          <div className="success-actions">
            <button 
              onClick={handleSuccessClose}
              className="btn btn-primary"
            >
              📋 К списку технологий
            </button>
            <button 
              onClick={handleAddAnother}
              className="btn btn-outline"
            >
              ➕ Добавить еще
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddTechnology;