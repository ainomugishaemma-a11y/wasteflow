import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { BinList } from '@/components/Bins/BinList';

export const BinsPage: React.FC = () => {
  return (
    <Layout
      title="Smart Bin Monitoring"
      subtitle="Track and manage all healthcare waste bins in real-time"
    >
      <BinList />
    </Layout>
  );
};
