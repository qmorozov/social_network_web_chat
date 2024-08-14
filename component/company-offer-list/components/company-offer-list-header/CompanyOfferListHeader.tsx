import Link from 'next/link';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../../../config/route';
import Avatar, { IAvatar } from '../../../avatar/Avatar';
import Button from '../../../button/Button';
import Icon from '../../../icon/Icon';
import MenuDots from '../../../menu-dots/MenuDots';
import Style from './CompanyOfferListHeader.module.scss';

type CompanyOfferListProps = {
  offersCount: number;
  companyId: string;
  closeOffers: () => void;
};

type CompanyOfferListHeader = CompanyOfferListProps & IAvatar;

const CompanyOfferListHeader: FC<CompanyOfferListHeader> = ({
  options,
  offersCount,
  companyId,
  closeOffers
}: CompanyOfferListHeader) => {
  const { t } = useTranslation();
  return (
    <div className={Style.Header}>
      <div>
        <Link href={`${route(Route.company).link()}/${companyId}`}>
          <a>
            <div className={Style.Avatar}>
              <Avatar options={options} />
            </div>
          </a>
        </Link>
        <p>
          {t('company.noInfo')}: {offersCount}
        </p>
      </div>
      <div className={Style.HeaderButtons}>
        <div>
          <Icon id="search" height={14} width={14} />
        </div>
        <div className={Style.DotsIcon}>
          <Icon id="dots" height={14} width={14} />
        </div>
        <div onClick={closeOffers}>
          <Icon id="close-with-circle" height={24} width={24} />
        </div>
      </div>
    </div>
  );
};

export default CompanyOfferListHeader;
