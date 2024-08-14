import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import AppContent from '../../../../component/app-content/AppContent';
import AppSide from '../../../../component/app-side/AppSide';
import MainLayout from '../../../../layouts/main';
import { Route, route } from '../../../../config/route';
import Breadcrumbs from '../../../../component/breadcrumbs/Breadcrumbs';
import { ResumeHeader } from '../../../../modules/resume/components/resume-header/ResumeHeader';
import ResumeDescription from '../../../../modules/resume/components/resume-description/ResumeDescription';

const Vacancie: NextPage = () => {
  const { t } = useTranslation();

  const breadcrumbs = [
    { route: route(Route.company).link(), title: route(Route.company).title },
    { route: '/', title: t('vacancy.title') }
  ];

  return (
    <MainLayout protectedRoute={false}>
      <AppSide type="left" className="-ls no-border">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <ResumeHeader />
        <ResumeDescription />
      </AppContent>
      <AppSide type="right" className="no-border" />
    </MainLayout>
  );
};

export default Vacancie;
