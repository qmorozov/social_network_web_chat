import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const MessagesPageContent = dynamic(
  () => import('../modules/chat/components/messages-page/MessagesPage'),
  {
    ssr: false
  }
);

const MessagesPage: NextPage = () => {
  return (
    <MainLayout>
      <MessagesPageContent />
    </MainLayout>
  );
};

export default MessagesPage;
