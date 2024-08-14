import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import PageTitle from '../../../component/page-title/PageTitle';
import FaqQuestions from '../faq-questions/FaqQuestions';
import Style from '../../../styles/page/FAQPage.module.scss';

const FaqPage: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <AppSide type="left" className="-ls" />
      <AppContent padding="wide">
        <PageTitle title={'faq.title'} classes={Style.PageTitle}>
          <button className={Style.Btn}>{t('faq.btn-text')}</button>
        </PageTitle>
        <div className="page-content-size">
          <div className={Style.wrapper}>
            <h2 className={Style.FaqContentTitle}>{t('faq.content.title')}</h2>
            <h4 className={Style.FaqContentSubTitle}>
              {t('faq.content.sub-title')}
            </h4>
            <FaqQuestions />
          </div>
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default FaqPage;
