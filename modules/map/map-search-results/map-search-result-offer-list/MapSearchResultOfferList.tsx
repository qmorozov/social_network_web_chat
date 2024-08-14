import Link from 'next/link';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyOfferList from '../../../../component/company-offer-list/CompanyOfferList';
import Popup from '../../../../component/popup/Popup';
import { Route, route } from '../../../../config/route';
import { useDropDown } from '../../../../hooks/useDropDown';
import { CompanyDTO } from '../../../company/dto/company';
import MapSearchResultOffer from '../map-search-result-offer/MapSearchResultOffer';
import Style from '../MapSearchResults.module.scss';

interface IMapSearchResultOfferList {
  business: CompanyDTO;
}

const OFFERS_TO_SHOW = 3 as const;

const MapSearchResultOfferList: FC<IMapSearchResultOfferList> = ({
  business
}: IMapSearchResultOfferList) => {
  const { t } = useTranslation();
  const { open, opened, close } = useDropDown();

  const [companyPopupWithOffers, setCompanyPopupWithOffers] =
    useState<CompanyDTO | null>(null);

  return (
    <>
      <ul className={Style.SearchResultOffers}>
        {business.offers.map((offer, idx) => {
          if (idx < OFFERS_TO_SHOW) {
            return (
              <li key={offer.id}>
                <Link
                  href={{
                    pathname: `${route(Route.offer).link()}/${offer.id}`,
                    query: {
                      businessId: business.id
                    }
                  }}
                >
                  <div>
                    <MapSearchResultOffer offer={offer} />
                  </div>
                </Link>
              </li>
            );
          }
        })}
        <li>
          {business?.offers.length > OFFERS_TO_SHOW ? (
            <a
              className={Style.AllOffersButton}
              onClick={() => {
                setCompanyPopupWithOffers(business);
                open();
              }}
            >
              {`${t('button.allOffers')}: ${business?.offers.length}`}
            </a>
          ) : null}
        </li>
      </ul>
      <Popup opened={opened} onClose={close}>
        {opened ? (
          <CompanyOfferList
            company={companyPopupWithOffers}
            closeOffers={close}
          />
        ) : null}
      </Popup>
    </>
  );
};

export default MapSearchResultOfferList;
