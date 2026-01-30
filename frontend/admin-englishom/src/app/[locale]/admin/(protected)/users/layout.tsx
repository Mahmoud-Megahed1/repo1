'use client';
import React from 'react';
import { withUsersProvider } from '../_components/users-provider';
import { withAccess } from '../_components/with-access';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default withAccess(withUsersProvider(Layout), ['super', 'manager']);
