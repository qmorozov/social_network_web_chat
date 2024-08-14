import React, { FC } from 'react';
import AppSide from '../../../../component/app-side/AppSide';
import AppContent from '../../../../component/app-content/AppContent';
import PrivacyList from '../privacy-list/PrivacyList';
import PageTitle from '../../../../component/page-title/PageTitle';

const PrivacyPage: FC = () => {
  return (
    <>
      <AppSide type="left" className="-ls" />
      <AppContent padding="wide">
        <PageTitle title={'privacy-policy.title'} />
        <div className="page-content-size">
          <PrivacyList />
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default PrivacyPage;
