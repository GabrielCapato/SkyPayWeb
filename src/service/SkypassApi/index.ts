import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.0.214:55601',
  headers: {
    'Content-Type': 'application/json',
    cliente:"viacaosantacruz.skypass.com.br"
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor
      console.error('Erro na API:', error.response.data);
    } else if (error.request) {
      // Erro na requisição
      console.error('Erro na requisição:', error.request);
    } else {
      // Erro na configuração
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export const validarConexaoAPI = async () => {
  try {
    const response = await api.post('/usuario');
    return response.status === 200;
  } catch (error) {
    console.error('Falha ao validar conexão com a API:', error);
    return false;
  }
};

export default api;
