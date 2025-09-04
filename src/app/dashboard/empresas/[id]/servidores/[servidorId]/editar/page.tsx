'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import IpInput from '@/components/IpInput';
import CustomButton from '@/components/CustomButton';
import { Row, Col } from '@/components/Grid';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import api from '@/service/SkypassApi';

interface Token {
  id: number;
  token: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  dataCriacao: string;
}

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

export default function EditarServidor() {

  const { id, servidorId } = useParams<{ id: string; servidorId: string }>();
  const empresa = id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    ip: '',
    porta: '',
    licencas: 0,
    descricao: ''
  });

  const [newAlias, setNewAlias] = useState('');
  const [aliases, setAliases] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchServidor = async () => {
      try {
        const response = await api.get(`/servidores/dadosUpdateServidor/${servidorId}`);
        const { servidor , tokens, dns} = response.data || {};
        console.log(servidor)
        if(!servidor || servidor.empresa_id !== parseInt(empresa)){
          await Swal.fire({
            title: 'Servidor não encontrado',
            text: 'O servidor não foi encontrado ou não pertence à empresa selecionada.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          router.push(`/dashboard/empresas/${empresa}/servidores`);
        }
        setFormData({
          nome: servidor.nome ?? '',
          ip: servidor.ip ?? '',
          porta: String(servidor.porta ?? ''),
          licencas: Number(servidor.licencas ?? 0),
          descricao: servidor.descricao ?? ''
        });
        setAliases(Array.isArray(dns) ? dns : []);
        setTokens(
          Array.isArray(tokens)
            ? tokens.map((t: any, index: number) => ({
                id: t.id ?? index + 1,
                token: t.token ?? '',
                status: (t.status as Token['status']) ?? 'inativo',
                dataCriacao: t.dataCriacao ?? new Date().toISOString().split('T')[0]
              }))
            : []
        );
      } catch (error) {
        // Mantém estados padrão em caso de falha
      } finally {
        setLoading(false);
      }
    };
    fetchServidor();
  }, [servidorId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inativo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'bloqueado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleFilterClick = async () => {
    const { value: status } = await Swal.fire({
      title: 'Filtrar por Status',
      input: 'select',
      inputOptions: {
        'todos': 'Todos',
        'ativo': 'Ativos',
        'inativo': 'Inativos',
        'bloqueado': 'Bloqueados'
      },
      inputValue: statusFilter || 'todos',
      showCancelButton: true,
      inputPlaceholder: 'Selecione um status',
      confirmButtonText: 'Filtrar',
      cancelButtonText: statusFilter ? 'Limpar Filtro' : 'Cancelar',
      showDenyButton: statusFilter ? true : false,
      denyButtonText: 'Cancelar',
      denyButtonColor: '#6B7280',
      cancelButtonColor: '#EF4444'
    });

    if (status) {
      setStatusFilter(status === 'todos' ? null : status);
    } else if (statusFilter) {
      setStatusFilter(null);
    }
  };

  const getTokenStats = () => {
    const ativos = tokens.filter(token => token.status === 'ativo').length;
    const total = tokens.length;
    return `${ativos}/${total}`;
  };

  const filteredTokens = statusFilter 
    ? tokens.filter(token => token.status === statusFilter)
    : tokens;

  const generateNewToken = async () => {
    const licencas = formData.licencas || 0;
    const tokensAtuais = tokens.length;

    if (tokensAtuais >= licencas) {
      await Swal.fire({
        title: 'Limite de Licenças',
        text: `Você já atingiu o limite de ${licencas} tokens permitidos pelas licenças cadastradas.`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const { value: quantidade } = await Swal.fire({
      title: 'Quantidade de Tokens',
      input: 'number',
      inputLabel: `Quantos tokens deseja gerar? (Máximo: ${licencas - tokensAtuais})`,
      inputValue: 1,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, insira um número';
        }
        const num = parseInt(value);
        if (num < 1) {
          return 'A quantidade deve ser maior que 0';
        }
        if (num > licencas - tokensAtuais) {
          return `A quantidade máxima permitida é ${licencas - tokensAtuais}`;
        }
      }
    });

    if (quantidade) {
      const novosTokens = Array.from({ length: parseInt(quantidade) }, (_, index) => ({
        id: tokens.length + index + 1,
        token: uuidv4(),
        status: 'inativo' as const,
        dataCriacao: new Date().toISOString().split('T')[0]
      }));

      setTokens(prev => [...prev, ...novosTokens]);
    }
  };

  const handleTokenAction = async (tokenId: number, action: string) => {
    let confirmConfig = {
      title: '',
      text: '',
      icon: 'question' as 'success' | 'error' | 'warning' | 'info' | 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    };

    switch (action) {
      case 'excluir':
        confirmConfig = {
          ...confirmConfig,
          title: 'Excluir Token',
          text: 'Tem certeza que deseja excluir este token?',
          icon: 'warning',
        };
        break;
      case 're-gerar':
        confirmConfig = {
          ...confirmConfig,
          title: 'Re-gerar Token',
          text: 'Tem certeza que deseja re-gerar este token?',
          icon: 'question',
        };
        break;
      case 'ativar':
        confirmConfig = {
          ...confirmConfig,
          title: 'Ativar Token',
          text: 'Tem certeza que deseja ativar este token?',
          icon: 'question',
        };
        break;
      case 'inativar':
        confirmConfig = {
          ...confirmConfig,
          title: 'Inativar Token',
          text: 'Tem certeza que deseja inativar este token?',
          icon: 'warning',
        };
        break;
      case 'bloquear':
        confirmConfig = {
          ...confirmConfig,
          title: 'Bloquear Token',
          text: 'Tem certeza que deseja bloquear este token?',
          icon: 'warning',
        };
        break;
    }

    const result = await Swal.fire(confirmConfig);

    if (!result.isConfirmed) {
      throw new Error('Ação cancelada pelo usuário');
    }

    switch (action) {
      case 'excluir':
        setTokens(prevTokens => prevTokens.filter(token => token.id !== tokenId));
        await Swal.fire('Excluído!', 'Token excluído com sucesso.', 'success');
        break;
      case 're-gerar':
        setTokens(prevTokens => 
          prevTokens.map(token => {
            if (token.id === tokenId) {
              return { ...token, token: uuidv4() };
            }
            return token;
          })
        );
        await Swal.fire('Re-gerado!', 'Token re-gerado com sucesso.', 'success');
        break;
      case 'ativar':
        setTokens(prevTokens => 
          prevTokens.map(token => {
            if (token.id === tokenId) {
              return { ...token, status: 'ativo' };
            }
            return token;
          })
        );
        await Swal.fire('Ativado!', 'Token ativado com sucesso.', 'success');
        break;
      case 'inativar':
        setTokens(prevTokens => 
          prevTokens.map(token => {
            if (token.id === tokenId) {
              return { ...token, status: 'inativo' };
            }
            return token;
          })
        );
        await Swal.fire('Inativado!', 'Token inativado com sucesso.', 'success');
        break;
      case 'bloquear':
        setTokens(prevTokens => 
          prevTokens.map(token => {
            if (token.id === tokenId) {
              return { ...token, status: 'bloqueado' };
            }
            return token;
          })
        );
        await Swal.fire('Bloqueado!', 'Token bloqueado com sucesso.', 'success');
        break;
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'ip') {
      const sanitized = value.replace(/[^\d.]/g, '').replace(/\.+/g, '.').replace(/^\./, '');
      const parts = sanitized.split('.').slice(0, 4);
      const normalizedParts = parts.map(p => p.replace(/\D/g, '').slice(0, 3));
      const endsWithDot = sanitized.endsWith('.') && normalizedParts.length < 4;
      const maskedValue = normalizedParts.join('.') + (endsWithDot ? '.' : '');
      setFormData(prev => ({
        ...prev,
        [field]: maskedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNewAliasChange = (value: string) => {
    setNewAlias(value);
    if (errors.newAlias) {
      setErrors(prev => ({
        ...prev,
        newAlias: ''
      }));
    }
  };

  const addAlias = () => {
    if (newAlias.trim() !== '') {
      setAliases(prev => [...prev, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const removeAlias = (index: number) => {
    setAliases(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.ip) newErrors.ip = 'IP é obrigatório';
    if (!formData.porta) newErrors.porta = 'Porta é obrigatória';

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (formData.ip) {
      if (!ipRegex.test(formData.ip)) {
        newErrors.ip = 'IP inválido';
      } else {
        const octets = formData.ip.split('.');
        const isValidOctet = octets.every(octet => {
          const num = parseInt(octet);
          return num >= 0 && num <= 255;
        });
        if (!isValidOctet) {
          newErrors.ip = 'IP inválido (cada número deve estar entre 0 e 255)';
        }
      }
    }

    const porta = parseInt(formData.porta);
    if (formData.porta && (isNaN(porta) || porta < 1 || porta > 65535)) {
      newErrors.porta = 'Porta inválida';
    }

    aliases.forEach((alias, index) => {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/.test(alias)) {
        newErrors[`alias${index}`] = 'Alias inválido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const body = { ...formData, empresa_id: parseInt(empresa), aliases, tokens };
        await api.patch(`/servidores/${servidorId}`, body);
        router.push(`/dashboard/empresas/${empresa}/servidores`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">Carregando...</div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Editar Servidor
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Atualize os dados do servidor abaixo
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Dados do Servidor
          </h2>
          <Row className="gap-y-4">
            <Col xs={12} md={6} lg={3}>
              <CustomInput
                label="Nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                error={errors.nome}
                required
              />
            </Col>
            <Col xs={12} md={4} lg={4}>
              <IpInput
                label="IP"
                value={formData.ip}
                onChange={(val) => handleChange('ip', val)}
                error={errors.ip}
                required
              />
            </Col>
            <Col xs={12} md={4} lg={1}>
              <CustomInput
                label="Porta"
                value={formData.porta}
                onChange={(e) => handleChange('porta', e.target.value)}
                error={errors.porta}
                required
                min="1"
                max="65535"
              />
            </Col>
            <Col xs={12} md={4} lg={2}>
              <CustomInput
                label="Qtde. licenças"
                value={formData.licencas}
                onChange={(e) => handleChange('licencas', e.target.value)}
                error={errors.licencas}
                required
                type="number"
                min="1"
                max="65535"
              />
            </Col>
            <Col xs={12}>
              <CustomInput
                label="Descrição"
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              DNS da empresa
            </h2>
          </div>

          <Row className="gap-y-4">
            <Col xs={12} md={10}>
              <CustomInput
                label="Novo DNS"
                value={newAlias}
                onChange={(e) => handleNewAliasChange(e.target.value)}
                error={errors.newAlias}
                placeholder="exemplo.com.br"
              />
            </Col>
            <Col xs={12} md={2}>
              <div className="flex items-end h-full">
                <CustomButton
                  variant="outline"
                  buttonSize="SM"
                  onClick={addAlias}
                  className="w-full"
                >
                  Adicionar
                </CustomButton>
              </div>
            </Col>

            {aliases.length > 0 && (
              <Col xs={12}>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    DNS Adicionados
                  </h3>
                  <Row className="gap-y-2">
                    {aliases.map((alias, index) => (
                      <Col sm={12} md={8} lg={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group h-full"
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {alias}
                              </span>
                            </div>
                            {errors[`alias${index}`] && (
                              <span className="text-xs text-red-500 mt-1 block">
                                {errors[`alias${index}`]}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeAlias(index)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            )}
          </Row>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Tokens do servidor
            </h2>
            <div className="flex items-center gap-4">
              {tokens.length > 0 && (
                <button
                  onClick={handleFilterClick}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>{getTokenStats()}</span>
                  {statusFilter ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </span>
                      <svg
                        className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  )}
                </button>
              )}
              <CustomButton
                variant="primary"
                buttonSize="SM"
                onClick={generateNewToken}
              >
                Gerar Novo Token
              </CustomButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data de Criação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      {statusFilter 
                        ? `Nenhum token com status "${statusFilter}" encontrado.`
                        : 'Nenhum token cadastrado.'}
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((token) => (
                    <tr key={token.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {token.token}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(token.status)}`}>
                          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(token.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
                        <Row className="flex justify-end gap-1">
                          <Col xs={12} sm={6} md={2}>
                            <CustomButton
                              variant="outline"
                              buttonSize="SM"
                              onClick={() => handleTokenAction(token.id, 're-gerar')}
                              className="w-full p-2"
                            >
                              <svg
                                className="w-5 h-5 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </CustomButton>
                          </Col>
                          {token.status !== 'ativo' && (
                            <Col xs={12} sm={6} md={2}>
                              <CustomButton
                                variant="outline"
                                buttonSize="SM"
                                onClick={() => handleTokenAction(token.id, 'ativar')}
                                className="w-full"
                              >
                                Ativar
                              </CustomButton>
                            </Col>
                          )}
                          {token.status !== 'inativo' && (
                            <Col xs={12} sm={6} md={2}>
                              <CustomButton
                                variant="outline"
                                buttonSize="SM"
                                onClick={() => handleTokenAction(token.id, 'inativar')}
                                className="w-full"
                              >
                                Inativar
                              </CustomButton>
                            </Col>
                          )}
                          {token.status !== 'bloqueado' && (
                            <Col xs={12} sm={6} md={2}>
                              <CustomButton
                                variant="outline"
                                buttonSize="SM"
                                onClick={() => handleTokenAction(token.id, 'bloquear')}
                                className="w-full"
                              >
                                Bloquear
                              </CustomButton>
                            </Col>
                          )}
                          <Col xs={12} sm={6} md={2}>
                            <CustomButton
                              variant="outline"
                              buttonSize="SM"
                              onClick={() => handleTokenAction(token.id, 'excluir')}
                              className="w-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                            >
                              <svg
                                className="w-5 h-5 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </CustomButton>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-end space-x-4"
        >
          <CustomButton
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={handleSubmit}
          >
            Salvar Alterações
          </CustomButton>
        </motion.div>
      </div>
    </motion.div>
  );
}


