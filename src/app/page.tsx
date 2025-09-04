'use client';

import { useState, useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Image from 'next/image';
import api from '../service/SkypassApi';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('@Skypass:token');
    console.log(token);
    if (token) {
      // Configura o token no header
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      
      // Verifica se o token é válido
      api.get('/auth/validaToken')
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          // Se o token for inválido, limpa o localStorage
          // localStorage.removeItem('@Skypass:token');
          // localStorage.removeItem('@Skypass:usuario');
          // delete api.defaults.headers.common['Authorization'];
        });
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', formData);
      
      if (response.status === 200) {
        // Armazenando dados da sessão
        const { token, usuario } = response.data;
        localStorage.setItem('@Skypass:token', token);
        localStorage.setItem('@Skypass:usuario', JSON.stringify(usuario));
        
        // Configurando o token no header das requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success('Login realizado com sucesso!');
        console.log('Login realizado com sucesso:', response.data);
        
        // Redirecionando para o dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Falha na autenticação');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.mensagem || 'Erro ao fazer login. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full mx-4">
        <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Bem-vindo ao SkyPay
            </h2>
          </div>

          <form className="mt-8 space-y-6" >
            <div className="space-y-4">
              <CustomInput
                inputSize="FULL"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
              />

              <CustomInput
                inputSize="FULL"
                label="Senha"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
              />
            </div>


            <div className="text-sm flex justify-end">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <div>
              <CustomButton
                buttonSize="FULL"
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200"
              >
                Entrar
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 