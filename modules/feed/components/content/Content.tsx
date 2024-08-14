import { FC, useEffect } from 'react';
import CompanyOffer from '../../../../component/company-offer/CompanyOffer';
import Loader from '../../../../component/loader/Loader';
import { useService } from '../../../../hooks/useService';
import { ProfileType } from '../../../chat/models/Sender';
import { FeedProvider } from '../../feed.service';
import { AvatarName } from '../subscriptions/Subscriptions';

import Style from './Content.module.scss';

interface IContent {
  offers: any[];
  loading: boolean;
}

const Content: FC<IContent> = ({ offers, loading }) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <div className={Style.Offers}>
      {offers.map((offer) => {
        const avatarOptions = {
          url: offer.businessImageUrl,
          background: offer.businessBackgroundColor,
          name: offer.businessName,
          type: ProfileType.business
        };

        return (
          <div className={Style.Offer} key={offer.offer.id}>
            <div className={Style.HeaderOffer}>
              <AvatarName
                avatarOptions={avatarOptions}
                companyId={offer.businessId}
              />
            </div>
            <CompanyOffer
              offer={offer.offer}
              isInPopup={true}
              companyId={offer.businessId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Content;
