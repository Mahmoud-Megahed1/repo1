'use client';
import { useHeaderTitle } from '@/components/header-title-provider';
import { useSidebarItems } from '@/components/sidebar-items-provider';
import React, { useEffect } from 'react';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { setTitle } = useHeaderTitle();
  const { setItems } = useSidebarItems();
  useEffect(() => {
    setTitle('CMS');
  }, [setItems, setTitle]);
  return children;
};

export default Wrapper;
