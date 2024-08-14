import React, { FC } from 'react';
import Link from 'next/link';
import { ICurrency } from '../../dto/Account';

import Style from './Resumes.module.scss';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../../../config/route';
import { useRouter } from 'next/router';

interface IResume {
  address: string | undefined;
  currency: ICurrency;
  description: string;
  lat: number;
  lng: number;
  salaryFrom: number;
  salaryTo: number;
  title: string;
  id?: string;
}

interface IAccountResume {
  resume: IResume;
  companyId?: string;
  userId?: string;
  chatId?: string | null;
}

const Resumes: FC<IAccountResume> = ({ resume, companyId, userId }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const isUser = pathname === `/${Route.account}`;

  return (
    <div className={Style.Resume}>
      <div className={Style.ResumeTitle}>
        {resume.title},{resume.currency.symbol}
        {resume.salaryFrom} - {resume.salaryTo}
      </div>
      <div className={Style.Address}>{resume.address}</div>
      <div className={Style.Description}>{resume.description}</div>
      <div className={Style.Footer}>
        <Link
          href={
            isUser || userId
              ? `${route(Route.account).link()}/${userId}${route(
                  Route.resume
                ).link()}`
              : `${route(Route.company).link()}/${companyId}/vacancy/${
                  resume.id
                }`
          }
        >
          {t('popup.readFullDescription')}
        </Link>
      </div>
    </div>
  );
};

export default Resumes;
