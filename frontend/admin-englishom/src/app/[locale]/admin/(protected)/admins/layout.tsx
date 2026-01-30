'use client';
import React from 'react';
import { withAdminsProvider } from '../_components/admins-provider';
import { withAccess } from '../_components/with-access';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default withAccess(withAdminsProvider(Layout), ['super']);
