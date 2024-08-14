import React, { FC } from 'react';
import Loader from '../../../../component/loader/Loader';
import { IOffer } from '../../dto/company';
import Style from '../../Company.module.scss';
import CompanyOffer from '../../../../component/company-offer/CompanyOffer';

type Offers = {
  offers: IOffer[];
  loading: boolean;
  company: {
    companyId: string;
    chatId: string | null;
  };
};

const Offers: FC<Offers> = ({ offers, loading, company }: Offers) => {
  return loading ? (
    <Loader relative={true} />
  ) : (
    <ul className={Style.SearchResultOffers}>
      {offers.map((offer) => (
        <li key={offer.id} className={Style.ListItem}>
          <CompanyOffer
            offer={offer}
            companyId={company.companyId}
            chatId={company.chatId}
            isInPopup={true}
            outline={true}
          />
        </li>
      ))}
    </ul>
  );
};

export default Offers;
