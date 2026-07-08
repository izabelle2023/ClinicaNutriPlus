import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_URL });

// Sem JWT: identificamos o usuario logado enviando o id dele
// no header "x-user-id" em toda requisicao.
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('nutriplus_user');
  if (storedUser && config.headers) {
    const user = JSON.parse(storedUser);
    config.headers['x-user-id'] = user.id;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('nutriplus_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
