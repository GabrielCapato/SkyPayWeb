'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  link?: {
    href: string;
    text: string;
  };
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100 dark:bg-blue-900',
  link,
  className = ''
}) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {link && (
        <div className="mt-4">
          <Link 
            href={link.href} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {link.text} →
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard; 