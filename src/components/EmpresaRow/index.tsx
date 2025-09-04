'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';

interface Empresa {
  id: number;
  razaoSocial: string;
  cnpj: string;
  servidores: number;
}

interface EmpresaRowProps {
  empresa: Empresa;
}

export default function EmpresaRow({ empresa }: EmpresaRowProps) {
  const router = useRouter();

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {empresa.razaoSocial}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {empresa.cnpj}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {empresa.servidores > 0 ? (
          <span className="text-gray-900 dark:text-white">
            {empresa.servidores}
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400 italic">
            Nenhum servidor cadastrado
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <CustomButton
            variant="outline"
            buttonSize="SM"
            onClick={() => router.push(`/dashboard/empresas/${empresa.id}/servidores`)}
          >
            Servidores
          </CustomButton>
          <CustomButton
            variant="outline"
            buttonSize="SM"
            onClick={() => router.push(`/dashboard/empresas/cadastro?id=${empresa.id}`)}
          >
            Editar
          </CustomButton>
        </div>
      </td>
    </tr>
  );
} 