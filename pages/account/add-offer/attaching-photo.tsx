import { NextPage } from 'next';
import MainLayout from '../../../layouts/main';
import dynamic from 'next/dynamic';

const AttachingPhotoPageContent = dynamic(
  () => import('../../../modules/account/attaching-photo/AttachingPhoto'),
  {
    ssr: false
  }
);

const AddOfferPage: NextPage = () => {
  return (
    <MainLayout>
      <AttachingPhotoPageContent />
    </MainLayout>
  );
};

export default AddOfferPage;
