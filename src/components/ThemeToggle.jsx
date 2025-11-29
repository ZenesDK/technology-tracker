// components/ThemeToggle.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <Tooltip title={darkMode ? 'Светлая тема' : 'Тёмная тема'}>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        size="large"
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;