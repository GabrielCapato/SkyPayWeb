import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
} 