export const environment = {
  production: true,
  apiKey: (import.meta as any).env?.['NG_APP_API_KEY'] || '',
  apiUrl: 'https://api.openweathermap.org/data/2.5'
};