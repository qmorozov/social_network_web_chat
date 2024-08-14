import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const AddOfferPagePageContent = dynamic(
  () => import('../../modules/account/add-offer/AddOfferPage'),
  {
    ssr: false
  }
);

const AddOfferPage: NextPage = () => {
  return (
    <MainLayout>
      <AddOfferPagePageContent />
    </MainLayout>
  );
};

export default AddOfferPage;
