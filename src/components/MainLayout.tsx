import React from 'react';
import { MainLayout as NewLayout } from '@/components/ui/dashboard-with-collapsible-sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return <NewLayout>{children}</NewLayout>;
}
