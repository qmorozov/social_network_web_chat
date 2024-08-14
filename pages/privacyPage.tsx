import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const PrivacyPageContent = dynamic(
  () => import('../modules/privacy/components/privacy-page/PrivacyPage'),
  {
    ssr: false
  }
);

const PrivacyPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <PrivacyPageContent />
    </MainLayout>
  );
};

export default PrivacyPage;
