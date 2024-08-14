import React, { FC, useEffect, useState } from 'react';
import AppSide from '../../../../component/app-side/AppSide';
import AppContent from '../../../../component/app-content/AppContent';
import PageTitle from '../../../../component/page-title/PageTitle';
import Subscriptions from '../subscriptions/Subscriptions';
import Style from './FeedPage.module.scss';
import Content from '../content/Content';
import SubscriptionsSearch from '../subscriptions-search/SubscriptionsSearch';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useService } from '../../../../hooks/useService';
import { FeedProvider } from '../../feed.service';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../../../../component/button/Button';
import Link from 'next/link';
import Icon from '../../../../component/icon/Icon';
import Empty from '../../../chat/components/empty-chat/EmptyChat.module.scss';
import { useRouter } from 'next/router';
import { Route, route } from '../../../../config/route';

const FeedPage: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchResult, setSearchResult] = useState('');
  const { offers, loading } = useTypedSelector((state) => state.feed);

  const { getOffers } = useService(FeedProvider);

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <>
      <AppSide type="left" className="-ls no-border">
        {!!offers.length && (
          <>
            <SubscriptionsSearch searchResult={(e) => setSearchResult(e)} />
            <Subscriptions searchResult={searchResult} />
          </>
        )}
      </AppSide>
      <AppContent>
        {offers.length ? (
          <>
            <PageTitle title={'feed.title'} classes={Style.PageTitle} />
            <div className="page-content-size">
              <Content loading={loading} offers={offers} />
            </div>
          </>
        ) : (
          <div className={Empty.wrapper}>
            <h1 className={Empty.title}>
              <Trans>{t('chat.empty.title')}</Trans>
            </h1>
            <p className={Empty.text}>{t('chat.empty.text')}</p>
            <Button
              classes={Empty.button}
              onClick={() => router.push(`${route(Route.map).link()}`)}
            >
              {t('chat.empty.button')}
            </Button>
            <div className={Empty.offer__button}>
              <Link href={route(Route.addOffer).link()}>
                <a>
                  <span>{t('chat.empty.offer-button')}</span>
                  <Icon id="a-right" />
                </a>
              </Link>
            </div>
          </div>
        )}
      </AppContent>
      <AppSide type="right" className="no-border" />
    </>
  );
};

export default FeedPage;
