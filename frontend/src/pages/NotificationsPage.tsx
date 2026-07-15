import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { NotificationCenter } from '@/components/Notifications/NotificationCenter';

export const NotificationsPage: React.FC = () => {
  return (
    <Layout
      title="Notifications"
      subtitle="Manage all system and bin status notifications"
      maxWidth="md"
    >
      <NotificationCenter />
    </Layout>
  );
};
