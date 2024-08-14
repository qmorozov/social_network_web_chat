import { useTranslation, Trans } from 'react-i18next';
import Button from '../../../../component/button/Button';
import Style from './FindContact.module.scss';

const FindContact = () => {
  const { t } = useTranslation();

  return (
    <div className={Style.FindContact}>
      <div className={Style.Content}>
        <h2 className={Style.Title}>
          <Trans i18nKey="multiline">{t('find-first-contact.title')}</Trans>
        </h2>
        <p className={Style.SubTitle}>{t('find-first-contact.subtitle')}</p>
        <Button>{t('find-first-contact.btn')}</Button>
        <a className={Style.AddFirstOffer}>{t('find-first-contact.link')}</a>
      </div>
    </div>
  );
};

export default FindContact;
