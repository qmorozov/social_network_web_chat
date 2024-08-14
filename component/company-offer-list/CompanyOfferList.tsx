import React, { FC } from 'react';
import { ProfileType } from '../../modules/chat/models/Sender';
import { CompanyDTO } from '../../modules/company/dto/company';
import CompanyOffer from '../company-offer/CompanyOffer';
import Style from './CompanyOfferList.module.scss';
import CompanyOfferListHeader from './components/company-offer-list-header/CompanyOfferListHeader';
import CompanyOfferListTabs from './components/company-offer-list-tabs/CompanyOfferListTabs';

interface ICompanyOfferList {
  company: CompanyDTO | null;
  closeOffers: () => void;
}

const CompanyOfferList: FC<ICompanyOfferList> = ({
  company,
  closeOffers
}: ICompanyOfferList) => {
  const avatarOptions = {
    url: company?.photoFileName,
    background: company?.avatarFillColor,
    name: company?.name,
    type: ProfileType.business
  };
  return (
    <>
      <CompanyOfferListHeader
        options={avatarOptions}
        offersCount={company?.offers.length || 0}
        companyId={company?.id!}
        closeOffers={closeOffers}
      />
      <CompanyOfferListTabs />
      <ul className={Style.OffterList}>
        {company?.offers.map((offer, idx) => (
          <li key={idx}>
            <CompanyOffer
              offer={offer}
              isInPopup={true}
              companyId={company.id}
              chatId={company?.chatId}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default CompanyOfferList;
