import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const AddingLogoPageContent = dynamic(
  () => import('../../modules/company/adding-a-logo/AddingALogo'),
  {
    ssr: false
  }
);

const AddingLogoPage: NextPage = () => {
  return (
    <MainLayout>
      <AddingLogoPageContent />
    </MainLayout>
  );
};

export default AddingLogoPage;
