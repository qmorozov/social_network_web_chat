import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const EditCvPagePageContent = dynamic(
  () => import('../../modules/account/add-cv/AddCVPage'),
  {
    ssr: false
  }
);

const EditCvPage: NextPage = () => {
  return (
    <MainLayout>
      <EditCvPagePageContent />
    </MainLayout>
  );
};

export default EditCvPage;
