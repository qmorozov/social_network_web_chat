import { NextPage } from 'next';
import MainLayout from '../../../../../layouts/main';
import dynamic from 'next/dynamic';

const EditVacancyPagePageContent = dynamic(
  () => import('../../../../../modules/account/add-cv/AddCVPage'),
  {
    ssr: false
  }
);

const EditVacancyPage: NextPage = () => {
  return (
    <MainLayout>
      <EditVacancyPagePageContent />
    </MainLayout>
  );
};

export default EditVacancyPage;
