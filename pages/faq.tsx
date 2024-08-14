import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const FAQPageContent = dynamic(
  () => import('../modules/faq/faq-page/FAQPage'),
  {
    ssr: false
  }
);

const FAQPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <FAQPageContent />
    </MainLayout>
  );
};

export default FAQPage;
