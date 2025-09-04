'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScreenProps {
  children: React.ReactNode;
  isSidebarExpanded: boolean;
}

const Screen: React.FC<ScreenProps> = ({ children, isSidebarExpanded }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-0"
      animate={{
        marginLeft: isMobile ? 0 : (isSidebarExpanded ? '256px' : '80px'),
        width: isMobile ? '100%' : (isSidebarExpanded ? 'calc(100% - 256px)' : 'calc(100% - 80px)')
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Screen; 