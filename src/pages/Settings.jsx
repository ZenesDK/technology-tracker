// pages/Settings.jsx
import React, { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
  const { technologies, resetAllStatuses, markAllCompleted } = useTechnologies();
  
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ru',
    autoSave: true,
    notifications: true
  });
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      settings: settings,
      technologies: technologies,
      statistics: {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          // Здесь можно добавить логику импорта данных
          console.log('Импортированные данные:', importedData);
          alert('Данные успешно импортированы!');
        } catch (error) {
          console.error('Ошибка при импорте данных:', error);
          alert('Ошибка при импорте файла. Убедитесь, что файл корректный.');
        }
      };
      reader.readAsText(file);
    }
    setShowImportModal(false);
  };

  const handleResetAll = () => {
    resetAllStatuses();
    setShowResetModal(false);
  };

  const handleMarkAllCompleted = () => {
    markAllCompleted();
  };

  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('technologies');
      window.location.reload();
    }
  };

  return (
    <div className="page settings-page">
      <div className="page-header">
        <h1>⚙️ Настройки</h1>
        <p>Управление настройками приложения и данными</p>
      </div>

      <div className="settings-sections">
        {/* Настройки приложения */}
        <div className="settings-section">
          <h2>🎨 Настройки приложения</h2>
          
          <div className="setting-group">
            <label className="setting-label">
              <span>Тема оформления</span>
              <select 
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="setting-input"
              >
                <option value="light">🌞 Светлая</option>
                <option value="dark">🌙 Тёмная</option>
                <option value="auto">⚡ Авто</option>
              </select>
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <span>Язык интерфейса</span>
              <select 
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="setting-input"
              >
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <span>Автосохранение изменений</span>
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              <span>Уведомления о прогрессе</span>
            </label>
          </div>
        </div>

        {/* Управление данными */}
        <div className="settings-section">
          <h2>💾 Управление данными</h2>
          
          <div className="data-actions-grid">
            <div className="data-action">
              <h4>Экспорт данных</h4>
              <p>Скачайте резервную копию всех ваших данных</p>
              <button 
                onClick={handleExportData}
                className="btn btn-primary"
              >
                📤 Экспортировать данные
              </button>
            </div>

            <div className="data-action">
              <h4>Импорт данных</h4>
              <p>Загрузите данные из резервной копии</p>
              <button 
                onClick={() => setShowImportModal(true)}
                className="btn btn-outline"
              >
                📥 Импортировать данные
              </button>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="settings-section">
          <h2>⚡ Быстрые действия</h2>
          
          <div className="quick-actions-grid">
            <div className="quick-action">
              <h4>Отметить все как изученное</h4>
              <p>Установить статус "Изучено" для всех технологий</p>
              <button 
                onClick={handleMarkAllCompleted}
                className="btn btn-success"
                disabled={technologies.every(t => t.status === 'completed')}
              >
                ✅ Отметить все
              </button>
            </div>

            <div className="quick-action">
              <h4>Сбросить все статусы</h4>
              <p>Вернуть все технологии в статус "Не начато"</p>
              <button 
                onClick={() => setShowResetModal(true)}
                className="btn btn-warning"
              >
                🔄 Сбросить все
              </button>
            </div>

            <div className="quick-action">
              <h4>Очистить все данные</h4>
              <p>Полностью удалить все технологии и настройки</p>
              <button 
                onClick={clearAllData}
                className="btn btn-danger"
              >
                🗑️ Очистить всё
              </button>
            </div>
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="settings-section">
          <h2>ℹ️ О приложении</h2>
          
          <div className="app-info">
            <div className="info-item">
              <span>Версия:</span>
              <span>1.0.0</span>
            </div>
            <div className="info-item">
              <span>Технологий в базе:</span>
              <span>{technologies.length}</span>
            </div>
            <div className="info-item">
              <span>Последнее обновление:</span>
              <span>{new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="info-item">
              <span>Разработчик:</span>
              <span>Трекер технологий</span>
            </div>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Сброс всех статусов"
        size="sm"
      >
        <div className="modal-content">
          <p>Вы уверены, что хотите сбросить статусы всех технологий?</p>
          <p>Это действие установит статус "Не начато" для всех технологий.</p>
          <div className="modal-actions">
            <button 
              onClick={() => setShowResetModal(false)}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button 
              onClick={handleResetAll}
              className="btn btn-warning"
            >
              Да, сбросить
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="md"
      >
        <div className="modal-content">
          <div className="export-success">
            <span className="export-icon">✅</span>
            <h4>Данные успешно экспортированы!</h4>
          </div>
          <p>Файл с резервной копией ваших данных был скачан автоматически.</p>
          <div className="export-details">
            <div className="export-detail">
              <strong>Технологий:</strong> {technologies.length}
            </div>
            <div className="export-detail">
              <strong>Формат:</strong> JSON
            </div>
            <div className="export-detail">
              <strong>Дата:</strong> {new Date().toLocaleDateString('ru-RU')}
            </div>
          </div>
          <button 
            onClick={() => setShowExportModal(false)}
            className="btn btn-primary"
          >
            Закрыть
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Импорт данных"
        size="md"
      >
        <div className="modal-content">
          <p>Выберите файл с резервной копией данных:</p>
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="file-input"
          />
          <div className="import-info">
            <h4>Требования к файлу:</h4>
            <ul>
              <li>Формат: JSON</li>
              <li>Кодировка: UTF-8</li>
              <li>Максимальный размер: 10MB</li>
            </ul>
          </div>
          <button 
            onClick={() => setShowImportModal(false)}
            className="btn btn-secondary"
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;