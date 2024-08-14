import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const AddVacancyPagePageContent = dynamic(
  () => import('../../modules/account/add-cv/AddCVPage'),
  {
    ssr: false
  }
);

const AddCvPage: NextPage = () => {
  return (
    <MainLayout>
      <AddVacancyPagePageContent />
    </MainLayout>
  );
};

export default AddCvPage;
