'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Screen from '@/components/Screen';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onExpandChange={setIsSidebarExpanded}
        />

        {/* Main Content */}
        <Screen isSidebarExpanded={isSidebarExpanded}>
          {/* Top Navigation */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 w-full">
                {/* Aqui você pode adicionar um campo de busca ou outros elementos */}
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Aqui você pode adicionar notificações, perfil, etc */}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="py-6">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </Screen>
      </div>
    </ProtectedRoute>
  );
} 