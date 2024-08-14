import { NextPage } from 'next';
import MainLayout from '../../layouts/main';
import dynamic from 'next/dynamic';

const AddingPhotoPageContent = dynamic(
  () => import('../../modules/account/adding-a-photo/AddingAPhoto'),
  {
    ssr: false
  }
);

const AddingPhotoPage: NextPage = () => {
  return (
    <MainLayout>
      <AddingPhotoPageContent />
    </MainLayout>
  );
};

export default AddingPhotoPage;
