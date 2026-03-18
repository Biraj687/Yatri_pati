import React from 'react';
import { Header, Footer } from '../components';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <div className="portal-layout">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
