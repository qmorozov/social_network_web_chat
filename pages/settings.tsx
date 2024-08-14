import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const SettingsPageContent = dynamic(
  () => import('../modules/settings/settings-page/SettingsPage'),
  {
    ssr: false
  }
);

const SettingsPage: NextPage = () => {
  return (
    <MainLayout>
      <SettingsPageContent />
    </MainLayout>
  );
};

export default SettingsPage;
