// components/DataExporter.jsx
import { useState } from 'react';
import './DataExporter.css';

function DataExporter({ technologies }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeUserData, setIncludeUserData] = useState(true);

  // Функция для экспорта данных
  const exportData = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      technologies: includeUserData 
        ? technologies.map(tech => ({
            ...tech,
            userNotes: tech.notes || '',
            userStatus: tech.status || 'not-started',
            lastUpdated: tech.lastUpdated || new Date().toISOString()
          }))
        : technologies.map(({ notes, status, lastUpdated, ...tech }) => tech)
    };

    let dataStr, fileType, fileName;

    if (exportFormat === 'json') {
      dataStr = JSON.stringify(exportData, null, 2);
      fileType = 'application/json';
      fileName = `technology-tracker-${new Date().toISOString().split('T')[0]}.json`;
    }

    // Создаем и скачиваем файл
    const blob = new Blob([dataStr], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Валидация перед экспортом
  const canExport = technologies && technologies.length > 0;

  return (
    <div className="data-exporter">
      <div className="exporter-header">
        <h3>📤 Экспорт данных</h3>
        <p>Сохраните ваши технологии в файл</p>
      </div>
      
      <div className="export-options">
        <div className="form-group">
          <label htmlFor="export-format" className="form-label">
            Формат экспорта
          </label>
          <select
            id="export-format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="form-select"
          >
            <option value="json">JSON</option>
            <option value="csv" disabled>CSV (скоро)</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeUserData}
              onChange={(e) => setIncludeUserData(e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            Включить мои заметки и прогресс
          </label>
          <span className="help-text">
            При включении будут экспортированы ваши личные заметки и статусы изучения
          </span>
        </div>
      </div>

      {!canExport && (
        <div className="export-warning">
          <span className="warning-icon">⚠️</span>
          <div className="warning-content">
            <strong>Нет данных для экспорта</strong>
            <p>Добавьте технологии в трекер чтобы иметь возможность их экспортировать</p>
          </div>
        </div>
      )}

      <div className="export-actions">
        <button
          onClick={exportData}
          disabled={!canExport}
          className="btn btn-primary export-btn"
        >
          📥 Скачать файл экспорта
        </button>

        {canExport && (
          <div className="export-info">
            <p>Будет экспортировано: <strong>{technologies.length} технологий</strong></p>
            <p className="help-text">
              Файл будет сохранен в выбранном формате на вашем устройстве
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataExporter;