import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#007bff',
    primaryLight: '#66b3ff',
    primaryDark: '#0056b3',
    secondary: '#6c757d',
    secondaryDark: '#545b62',
    background: '#ffffff',
    backgroundLight: '#f8f9fa',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    error: '#dc3545',
    errorBg: '#f8d7da',
    errorDark: '#bd2130',
    warning: '#ffc107',
    success: '#28a745',
    successDark: '#1e7e34',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};