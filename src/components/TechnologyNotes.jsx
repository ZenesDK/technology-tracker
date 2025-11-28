// components/TechnologyNotes.jsx
import React, { useState } from 'react';
import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    onNotesChange(techId, newNotes);
    
    // Показываем индикатор сохранения
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="notes-section">
      <div className="notes-header" onClick={toggleExpanded}>
        <h4 className="notes-title">
          <span className="notes-icon">📝</span>
          Мои заметки
          {notes && notes.length > 0 && (
            <span className="notes-badge">{notes.length} симв.</span>
          )}
        </h4>
        <span className="expand-icon">
          {isExpanded ? '▼' : '►'}
        </span>
      </div>

      {isExpanded && (
        <div className="notes-content">
          <textarea
            value={notes || ''}
            onChange={handleNotesChange}
            placeholder="Записывайте сюда важные моменты, ссылки на документацию, примеры кода..."
            rows="4"
            className="notes-textarea"
          />
          <div className="notes-footer">
            <div className="notes-hint">
              {notes && notes.length > 0 ? (
                <span className={`notes-status ${isSaved ? 'saved' : ''}`}>
                  {isSaved ? '✅ Сохранено' : `Заметка сохранена (${notes.length} символов)`}
                </span>
              ) : (
                'Добавьте заметку...'
              )}
            </div>
            <div className="notes-actions">
              <button 
                className="notes-clear-btn"
                onClick={() => onNotesChange(techId, '')}
                disabled={!notes || notes.length === 0}
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnologyNotes;