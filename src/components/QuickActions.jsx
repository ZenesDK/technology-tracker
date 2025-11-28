// components/QuickActions.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

const QuickActions = ({ 
  onMarkAllCompleted, 
  onResetAll, 
  technologies,
  onExportData 
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      technologies: technologies,
      statistics: {
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleConfirmAction = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (confirmAction === 'markAllCompleted') {
      onMarkAllCompleted();
    } else if (confirmAction === 'resetAll') {
      onResetAll();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const getCompletedCount = () => technologies.filter(t => t.status === 'completed').length;
  const allCompleted = getCompletedCount() === technologies.length;

  return (
    <div className="quick-actions">
      <h3 className="quick-actions-title">⚡ Быстрые действия</h3>
      
      <div className="action-buttons">
        <button 
          onClick={() => handleConfirmAction('markAllCompleted')} 
          className="btn btn-success"
          disabled={allCompleted}
          title={allCompleted ? 'Все технологии уже изучены' : 'Отметить все технологии как изученные'}
        >
          <span className="btn-icon">✅</span>
          Отметить все как выполненные
          {allCompleted && <span className="action-badge">Готово</span>}
        </button>
        
        <button 
          onClick={() => handleConfirmAction('resetAll')} 
          className="btn btn-warning"
          title="Сбросить статусы всех технологий"
        >
          <span className="btn-icon">🔄</span>
          Сбросить все статусы
        </button>
        
        <button 
          onClick={handleExport} 
          className="btn btn-info"
          title="Экспортировать данные в JSON файл"
        >
          <span className="btn-icon">📤</span>
          Экспорт данных
        </button>
      </div>

      {/* Модальное окно подтверждения */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Подтверждение действия"
        size="sm"
      >
        <div className="confirm-modal-content">
          <p>
            {confirmAction === 'markAllCompleted' 
              ? 'Вы уверены, что хотите отметить все технологии как выполненные?'
              : 'Вы уверены, что хотите сбросить статусы всех технологий?'
            }
          </p>
          <div className="confirm-actions">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button 
              onClick={executeAction}
              className={confirmAction === 'markAllCompleted' ? 'btn btn-success' : 'btn btn-warning'}
            >
              {confirmAction === 'markAllCompleted' ? 'Да, отметить все' : 'Да, сбросить'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="md"
      >
        <div className="export-modal-content">
          <div className="export-success">
            <span className="export-icon">✅</span>
            <h4>Данные успешно экспортированы!</h4>
          </div>
          <p>Файл с вашими данными был скачан автоматически.</p>
          <div className="export-details">
            <div className="export-detail">
              <strong>Технологий:</strong> {technologies.length}
            </div>
            <div className="export-detail">
              <strong>Изучено:</strong> {getCompletedCount()}
            </div>
            <div className="export-detail">
              <strong>Формат:</strong> JSON
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
    </div>
  );
};

export default QuickActions;