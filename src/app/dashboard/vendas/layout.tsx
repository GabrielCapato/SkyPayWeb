'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VendasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Vendas
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas vendas e pedidos
          </p>
        </div>

        {/* Content */}
        {children}
      </div>
    </ProtectedRoute>
  );
} 