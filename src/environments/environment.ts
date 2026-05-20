export const environment = {
  production: false,
  apiKey: (import.meta as any).env?.['NG_APP_API_KEY'] || '2a52fd0d95901348d2a981d314f729a8',
  apiUrl: 'https://api.openweathermap.org/data/2.5',
  authUrl: 'https://fakestoreapi.com/auth/login'
};