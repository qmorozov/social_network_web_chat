import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const AccountContent = dynamic(
  () => import('../modules/account/account-page/AccountPage'),
  {
    ssr: false
  }
);

const AccountPage: NextPage = () => {
  return (
    <MainLayout>
      <AccountContent />
    </MainLayout>
  );
};

export default AccountPage;
