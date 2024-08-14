import React, { FC, useEffect } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import Loader from '../../../../component/loader/Loader';
import { useService } from '../../../../hooks/useService';
import { PrivacyPolicy } from '../../privacy.service';
import { useAuth } from '../../../../hooks/useAuth';
import Style from '../../../../styles/page/PrivacyPolicy.module.scss';

const PrivacyList: FC = () => {
  const { t } = useTranslation();
  const { selectedLanguage } = useAuth();
  const { privacyPolicy, loading, language } = useTypedSelector(
    (state) => state.privacyPolicy
  );
  const { getPrivacyPolicy } = useService(PrivacyPolicy);

  useEffect(() => {
    if (language !== selectedLanguage || (!privacyPolicy && !loading)) {
      getPrivacyPolicy(selectedLanguage);
    }
  }, []);
  return (
    <>
      {!loading ? (
        <div className={Style.wrapper}>
          <h2 className={Style.listTitle}>{t('privacy-policy.sub-title')}</h2>
          <div className={Style.list}>
            <ReactMarkdown>{privacyPolicy}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default PrivacyList;
