import { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const QRCodePageContent = dynamic(
  () => import('../modules/qr-code/QRCodePage'),
  {
    ssr: false
  }
);

const QRCodePage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <QRCodePageContent />
    </MainLayout>
  );
};

export default QRCodePage;
