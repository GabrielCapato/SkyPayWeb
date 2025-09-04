import { useState, useEffect } from 'react';

export const useSidebarState = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        setIsSidebarExpanded(width > 80);
      }
    };

    checkSidebarState();

    const observer = new ResizeObserver(checkSidebarState);
    const sidebar = document.querySelector('[data-sidebar]');
    
    if (sidebar) {
      observer.observe(sidebar);
    }

    return () => {
      if (sidebar) {
        observer.unobserve(sidebar);
      }
    };
  }, []);

  return isSidebarExpanded;
}; 