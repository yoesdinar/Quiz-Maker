const environment = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  API_TOKEN: import.meta.env.VITE_API_TOKEN || 'dev-token',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
} as const;

export default environment;