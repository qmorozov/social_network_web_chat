import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const FeedPageContent = dynamic(
  () => import('../modules/feed/components/feed-page/FeedPage'),
  {
    ssr: false
  }
);

const FeedPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={true}>
      <FeedPageContent />
    </MainLayout>
  );
};

export default FeedPage;
