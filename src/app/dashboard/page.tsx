'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';

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

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo ao Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Aqui está um resumo das suas atividades
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Sales Card */}
        <StatCard
          title="Total de Vendas"
          value="R$ 12.345"
          iconBgColor="bg-blue-100 dark:bg-blue-900"
          icon={
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          link={{
            href: "/dashboard/vendas",
            text: "Ver detalhes"
          }}
        />

        {/* Empresas Card */}
        <StatCard
          title="Empresas"
          value="0"
          iconBgColor="bg-indigo-100 dark:bg-indigo-900"
          icon={
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          link={{
            href: "/dashboard/empresas",
            text: "Gerenciar empresas"
          }}
        />

        {/* Active Customers Card */}
        <StatCard
          title="Clientes Ativos"
          value="1.234"
          iconBgColor="bg-green-100 dark:bg-green-900"
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          link={{
            href: "#",
            text: "Ver detalhes"
          }}
        />

        {/* Pending Orders Card */}
        <StatCard
          title="Pedidos Pendentes"
          value="23"
          iconBgColor="bg-yellow-100 dark:bg-yellow-900"
          icon={
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          link={{
            href: "#",
            text: "Ver detalhes"
          }}
        />

        {/* Conversion Rate Card */}
        <StatCard
          title="Taxa de Conversão"
          value="3.2%"
          iconBgColor="bg-purple-100 dark:bg-purple-900"
          icon={
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          link={{
            href: "#",
            text: "Ver detalhes"
          }}
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Atividade Recente</h2>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  className="py-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700">
                        <span className="text-sm font-medium leading-none text-gray-600 dark:text-gray-300">
                          {item}
                        </span>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Venda #{item} - Cliente {item}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        R$ {(item * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Concluído
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              Ver todas as atividades
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 