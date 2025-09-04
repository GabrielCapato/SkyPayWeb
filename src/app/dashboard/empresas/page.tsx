'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import EmpresaRow from '@/components/EmpresaRow';
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
      ease: "easeOut"
    }
  }
};

interface Empresa {
  id: number;
  razaoSocial: string;
  cnpj: string;
  servidores: number;
}

export default function Empresas() {
  const router = useRouter();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const response = await api.get('/empresa');
      setEmpresas(response.data.clientes ?? [])
    };
    fetchEmpresas();
  }, []);


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Empresas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie as empresas e seus servidores
          </p>
        </div>
        <CustomButton
          variant="primary"
          onClick={() => router.push('/dashboard/empresas/cadastro')}
        >
          Nova Empresa
        </CustomButton>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {empresas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Razão Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Servidores
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {empresas.map((empresa) => (
                  <EmpresaRow key={empresa.id} empresa={empresa} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Nenhuma empresa cadastrada
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 