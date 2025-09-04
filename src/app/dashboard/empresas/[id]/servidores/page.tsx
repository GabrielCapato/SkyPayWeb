'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import api from '@/service/SkypassApi';

interface Servidor {
  id: number;
  nome: string;
  ip: string;
  status: 'Ativo' | 'Inativo';
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

export default function ServidoresEmpresa({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [servidores, setServidores] = useState<Servidor[]>([]);


  useEffect(() => {
    const fetchServidores = async () => {
      const response = await api.get(`/servidores/empresa/${params.id}`);
      console.log(response.data.servidores)
      setServidores(response.data.servidores ?? []);
    };
    fetchServidores();
  }, [params.id]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Servidores da Empresa
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie os servidores desta empresa
          </p>
        </div>
        <div className="flex space-x-2">
          <CustomButton
            variant="outline"
            onClick={() => router.push(`/dashboard/empresas`)	}
          >
            Voltar
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={() => router.push(`/dashboard/empresas/${params.id}/servidores/cadastro`)}
          >
            Novo Servidor
          </CustomButton>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {servidores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {servidores.map((servidor) => (
                  <tr key={servidor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {servidor.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {servidor.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        servidor.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {servidor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <CustomButton
                          variant="outline"
                          buttonSize="SM"
                          onClick={() => router.push(`/dashboard/empresas/${params.id}/servidores/${servidor.id}/editar`)}
                        >
                          Editar
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Nenhum servidor cadastrado
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 