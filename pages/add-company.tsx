import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const AddCompanyContent = dynamic(
  () =>
    import('../modules/add_company/components/add-company-page/AddCompanyPage'),
  {
    ssr: false
  }
);

const AddCompanyPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <AddCompanyContent />
    </MainLayout>
  );
};

export default AddCompanyPage;
