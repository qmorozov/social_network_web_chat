import React from 'react';
import Style from '../MapSearchResults.module.scss';

interface IMapSearchResultOffer {
  offer: Record<string, any>;
}

const MapSearchResultOffer: React.FC<IMapSearchResultOffer> = ({ offer }) => {
  return (
    <a className={Style.SearchResultOffer}>
      <div className={Style.SearchResultOfferPrice}>
        {offer.currency.symbol || offer.currency.code}
        {offer.price} {offer.unit.name}
      </div>
      <div className={Style.SearchResultOfferDescription}>
        {offer.description}
      </div>
      <div>→</div>
    </a>
  );
};

export default MapSearchResultOffer;
