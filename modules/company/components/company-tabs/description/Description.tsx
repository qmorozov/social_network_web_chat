import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyDTO } from '../../../dto/company';
import Shedule from '../../../../../component/shedule/Shedule';

import Style from './Description.module.scss';

interface IDescription {
  company: CompanyDTO;
}

enum Links {
  email = 'email',
  site = 'site'
}

interface IItemDescription {
  label: string;
  item: string | null | JSX.Element;
  type?: keyof typeof Links;
}

const Description: FC<IDescription> = ({ company }) => {
  const { t } = useTranslation();

  const ItemDescription: FC<IItemDescription> = ({ label, item, type }) => {
    return item ? (
      <div className={Style.ItemDescription}>
        <span className={Style.Label}>{label}</span>
        <span className={Style.Bold}>
          {type
            ? (type === Links.email && (
                <a href={`mailto:${company?.email}`}>{company?.email}</a>
              )) ||
              (type === Links.site && (
                <a
                  href={`//${company?.website}` || '/'}
                  target="_blank"
                  className={Style.UserWebsite}
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              ))
            : item}
        </span>
      </div>
    ) : (
      <></>
    );
  };

  return (
    <>
      <ItemDescription
        label={t('account.description.title')}
        item={company.description}
      />
      <ItemDescription
        type={Links.site}
        label={t('account.description.web-site')}
        item={company.website}
      />
      <ItemDescription
        type={Links.email}
        label={t('account.description.e-mail')}
        item={company.email}
      />
      <ItemDescription
        label={t('account.description.location')}
        item={company.address}
      />
      <ItemDescription
        label={t('account.description.working-hours')}
        item={
          <Shedule
            shedules={(company as CompanyDTO).schedules}
            classNames={Style.Shedule}
          />
        }
      />
    </>
  );
};

export default Description;
