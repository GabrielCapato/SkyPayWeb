'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import CustomSelect from '@/components/CustomSelect';
import { Row, Col } from '@/components/Grid';
import api from '@/service/SkypassApi';

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

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
      ease: "easeOut"
    }
  }
};

export default function CadastroEmpresa() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empresaId = searchParams.get('id');

  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    nomeContato: '',
    emailContato: '',
    telefoneContato: '',
    URL: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa o erro do campo quando ele é alterado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações básicas
    if (!formData.razaoSocial) newErrors.razaoSocial = 'Razão Social é obrigatória';
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.inscricaoEstadual) newErrors.inscricaoEstadual = 'Inscrição Estadual é obrigatória';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.numero) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';

    // Validações de formato
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.emailContato && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailContato)) {
      newErrors.emailContato = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    try {
      if (validateForm()) {
        const response = await api.post('/empresa/create', formData);
        console.log('Formulário válido:', response);
        router.push(`/dashboard/empresas`);
      } else {
        console.log('Erros de validação:', errors);
      }
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cadastro de Empresa
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preencha os dados da empresa abaixo
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {/* Dados da Empresa */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Dados da Empresa
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} sm={12} md={6} lg={4}>
              <CustomInput
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
                error={errors.razaoSocial}
                required
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <CustomInput
                label="Nome Fantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleChange('nomeFantasia', e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={3}>
              <CustomInput
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                error={errors.cnpj}
                required
                mask="99.999.999/9999-99"
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={3}>
              <CustomInput
                label="Inscrição Estadual"
                value={formData.inscricaoEstadual}
                required
                onChange={(e) => handleChange('inscricaoEstadual', e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={3}>
              <CustomInput
                label="URL de acesso"
                value={formData.URL}
                required
                onChange={(e) => handleChange('URL', e.target.value)}
              />
            </Col>
          </Row>
        </motion.div>

        {/* Contato */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Contato
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} sm={12} md={8} lg={6}>
              <CustomInput
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)} />
            </Col>
            <Col xs={12} sm={12} md={4} lg={3}>
              <CustomInput
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                error={errors.telefone}
                required
                mask="(99) 9999-9999"
              />
            </Col>
          </Row>

        </motion.div>

        {/* Endereço */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Endereço
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} md={2}>
              <CustomInput
                label="CEP"
                value={formData.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                error={errors.cep}
                required
                mask="99999-999"
              />
            </Col>
            <Col xs={12} md={8}>
              <CustomInput
                label="Endereço"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                error={errors.endereco}
                required
              />
            </Col>
            <Col xs={12} md={2} lg={2}>
              <CustomInput
                label="Número"
                value={formData.numero}
                onChange={(e) => handleChange('numero', e.target.value)}
                error={errors.numero}
                maxLength={7}
                required
              />
            </Col>
            <Col xs={12} md={4}>
              <CustomInput
                label="Complemento"
                value={formData.complemento}
                onChange={(e) => handleChange('complemento', e.target.value)}
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <CustomInput
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                error={errors.bairro}
                required
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <CustomInput
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                error={errors.cidade}
                required
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <CustomSelect
                label="Estado"
                options={estados}
                value={formData.estado}
                onChange={(value) => handleChange('estado', value)}
                error={errors.estado}
                searchable
                required
              />
            </Col>
          </Row>
        </motion.div>

        {/* Contato Principal */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Contato Principal
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} lg={3}>
              <CustomInput
                label="Nome do Contato"
                value={formData.nomeContato}
                onChange={(e) => handleChange('nomeContato', e.target.value)}
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <CustomInput
                label="E-mail do Contato"
                type="email"
                value={formData.emailContato}
                onChange={(e) => handleChange('emailContato', e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} md={4} lg={3}>
              <CustomInput
                label="Telefone do Contato"
                value={formData.telefoneContato}
                onChange={(e) => handleChange('telefoneContato', e.target.value)}
                mask="(99) 99999-9999"
              />
            </Col>
          </Row>
        </motion.div>

        {/* Botões de Ação */}
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
            Salvar Empresa
          </CustomButton>
        </motion.div>
      </div>
    </motion.div>
  );
} 