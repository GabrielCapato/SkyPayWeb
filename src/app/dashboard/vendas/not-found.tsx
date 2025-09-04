import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A página de vendas que você está procurando não existe.
        </p>
        <Link
          href="/dashboard/vendas"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Voltar para Vendas
        </Link>
      </div>
    </div>
  );
} 