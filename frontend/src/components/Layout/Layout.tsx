import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
  headerRight?: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, maxWidth = '7xl', headerRight }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
              </div>
              {headerRight && <div className="shrink-0">{headerRight}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
