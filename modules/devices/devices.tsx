import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const DevicesPageContent = dynamic(() => import('./devices-page/DevicesPage'), {
  ssr: false
});

const DevicesPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <DevicesPageContent />
    </MainLayout>
  );
};

export default DevicesPage;
