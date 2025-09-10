'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import CustomSelect from '@/components/CustomSelect';
import { Row, Col } from '@/components/Grid';
import api from '@/service/SkypassApi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

interface NivelAcesso {
  id: number;
  descricao: string;
}

interface Modulo {
  id: number;
  descricao: string;
}

export default function CadastroUsuario() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    ativo: '1',
    acessos: [] as string[],
    nivelAcesso: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nivelAcesso, setNivelAcesso] = useState<NivelAcesso[]>([]);
  const [todasTelas, setTodasTelas] = useState<Modulo[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    if (!formData.nivelAcesso) newErrors.nivelAcesso = 'Nível de acesso é obrigatório';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        const payload = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone || null,
          ativo: formData.ativo,
          acessos: formData.acessos,
          nivelAcesso: formData.nivelAcesso,
        };

        console.log(payload);
        
        // await api.post('/usuarios/create', payload);
        // router.push('/dashboard/usuarios');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNivelAcesso();
    fetchTodasTelas();
  }, []);

  const fetchNivelAcesso = async () => {
    const response = await api.get('/niveis-acesso');
    console.log(response.data);
    setNivelAcesso(response.data);
  };

  const fetchTodasTelas = async () => {
    const response = await api.get('/modulos');
    console.log(response.data);
    setTodasTelas(response.data);
  };


  const allSelected = todasTelas.every(key => formData.acessos.includes(String(key.id)));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cadastro de Usuário
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preencha os dados do usuário abaixo
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Dados do Usuário
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} md={6} lg={4}>
              <CustomInput
                label="Nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                error={errors.nome}
                required
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <CustomInput
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <CustomSelect
                label="Nível de Acesso"
                options={nivelAcesso?.length > 0 ? nivelAcesso.map((n) => ({ value: String(n.id), label: n.descricao })) : []}
                value={formData.nivelAcesso}
                onChange={(value) => handleChange('nivelAcesso', value)}
                error={errors.nivelAcesso}
                required
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <CustomInput
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                mask="(99) 99999-9999"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Acessos
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-200">Selecionar todos</span>
              <button
                type="button"
                aria-pressed={allSelected}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    acessos: allSelected ? [] : todasTelas.map((m) => String(m.id))
                  }));
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${allSelected ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${allSelected ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {todasTelas.map((tela) => {
              const id = String(tela.id);
              const checked = formData.acessos.includes(id);
              return (
                <div key={id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tela.descricao}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Permitir acesso à tela de {tela.descricao.toLowerCase()}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={checked}
                    onClick={() => {
                      setFormData(prev => {
                        const exists = prev.acessos.includes(id);
                        const next = exists
                          ? prev.acessos.filter(a => a !== id)
                          : [...prev.acessos, id];
                        return { ...prev, acessos: next };
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-end space-x-4"
        >
          <CustomButton
            variant="outline"
            onClick={async () => {
              await router.back();
            }}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            onClick={async () => {
              await handleSubmit();
            }}
          >
            Salvar Usuário
          </CustomButton>
        </motion.div>
      </div>
    </motion.div>
  );
}


