import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Avatar, { IAvatar } from '../../../../component/avatar/Avatar';
import DotsLoader from '../../../../component/dots-loader/DotsLoader';
import Loader from '../../../../component/loader/Loader';
import { Route, route } from '../../../../config/route';
import { useService } from '../../../../hooks/useService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ProfileType } from '../../../chat/models/Sender';
import { BusinessApi } from '../../../company/company.api';
import { CompanyDTO } from '../../../company/dto/company';
import { OfferBusinessesnDTO } from '../../dto/feed';
import { FeedProvider } from '../../feed.service';

import Style from './Subscriptions.module.scss';

export const AvatarName = ({ avatarOptions, companyId }: any) => {
  const router = useRouter();

  return (
    <a
      className={Style.BlockAvatarName}
      href={`${route(Route.company).link()}/${companyId}`}
    >
      <div className={Style.BlockAvatar}>
        <Avatar options={avatarOptions} />
      </div>
      <span className={Style.NameBusiness}>{avatarOptions.name}</span>
    </a>
  );
};

const ItemBusiness = ({ item }: any) => {
  const { t } = useTranslation();
  const [company, setCompany] = useState<CompanyDTO | null>(null);
  const getCompany = async () => {
    await BusinessApi.getCompanyById(item.id).then((res) => {
      setCompany(res);
    });
  };
  useEffect(() => {
    getCompany();
  }, []);

  const { putUnsubscribe, postSubscribe } = useService(FeedProvider);

  const avatarOptions: IAvatar['options'] = {
    url: company?.photoFileName,
    background: company?.avatarFillColor,
    name: company?.name,
    type: ProfileType.business
  };

  const isUserSubscribed = company?.isUserSubscribedOnBusinessOffers;

  const clickSubscribe = () => {
    if (isUserSubscribed) {
      putUnsubscribe(item.id);
    } else {
      postSubscribe(item.id);
    }
    getCompany();
  };

  return (
    company && (
      <div className={Style.BlockBusiness}>
        <>
          <AvatarName avatarOptions={avatarOptions} companyId={company.id} />
          {!Object.values(company).length ? (
            <DotsLoader />
          ) : (
            <button
              className={`${Style.Btn}  ${
                isUserSubscribed ? Style.BtnUnsubscribe : Style.BtnSubscribe
              }`}
              onClick={clickSubscribe}
            >
              {isUserSubscribed
                ? t('feed.unsubscribe-btn')
                : t('feed.subscribe-btn')}
            </button>
          )}
        </>
      </div>
    )
  );
};

const Subscriptions = ({ searchResult }: { searchResult: string }) => {
  const { offerBusinesses, loading } = useTypedSelector((state) => state.feed);
  const { getOfferBusinesses } = useService(FeedProvider);

  const [filterSubscriptions, setFilterSubscriptions] = useState<
    OfferBusinessesnDTO[]
  >([]);

  useEffect(() => {
    getOfferBusinesses();
  }, []);

  useEffect(() => {
    const newSubscriptions = offerBusinesses.filter((el) => {
      return el.name.toLowerCase().includes(searchResult.toLowerCase().trim());
    });
    setFilterSubscriptions(newSubscriptions);
  }, [searchResult]);

  const subscriptions =
    searchResult.length > 0 ? filterSubscriptions : offerBusinesses;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={Style.OfferBusinesses}>
      {subscriptions?.map((item: OfferBusinessesnDTO) => {
        return <ItemBusiness item={item} key={item.id} />;
      })}
    </div>
  );
};

export default Subscriptions;
