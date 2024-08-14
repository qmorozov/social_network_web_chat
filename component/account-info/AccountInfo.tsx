import Link from 'next/link';
import router from 'next/router';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { route, Route } from '../../config/route';
import { useService } from '../../hooks/useService';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import UserInfoTabs from '../../modules/account/components/tabs/Tabs';
import { Sender } from '../../modules/chat/models/Sender';
import AccountTabs from '../../modules/company/components/company-tabs/AccountTabs';
import OpenChat from '../../modules/company/components/open-chat/OpenChat';
import { CompanyDTO } from '../../modules/company/dto/company';
import { FeedProvider } from '../../modules/feed/feed.service';
import { CompanyContext } from '../../pages/company/[id]';
import DotsLoader from '../dots-loader/DotsLoader';
import Icon from '../icon/Icon';
import Like from '../like/Like';
import Shedule from '../shedule/Shedule';
import Snackbar, { SnackbarType } from '../snackbar/Snackbar';
import Style from './AccountInfo.module.scss';

export enum AccountInfoType {
  user = 'user',
  company = 'company'
}

interface IAccountInfo {
  avatar: ReactElement;
  account: Sender | CompanyDTO | any;
  clickLike: () => void;
  clickSubscribe?: () => void;
  type: keyof typeof AccountInfoType;
  showChatButton?: boolean;
}

const AccountInfo: FC<IAccountInfo> = ({
  avatar,
  account,
  clickLike,
  clickSubscribe,
  type,
  showChatButton = true
}: IAccountInfo) => {
  const { t } = useTranslation();
  const { getCompany } = useContext<any>(CompanyContext);

  const { signed } = useTypedSelector((state) => state.user);

  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const { putUnsubscribe, postSubscribe } = useService(FeedProvider);

  const snackbarRef = useRef<any>(null);

  const clickOfferSubscription = async () => {
    if (signed) {
      snackbarRef.current.show();

      if ((account as CompanyDTO).isUserSubscribedOnBusinessOffers) {
        await putUnsubscribe(account.id);
      } else {
        await postSubscribe(account.id);
      }
      clickSubscribe ? clickSubscribe() : getCompany;
    }
  };

  return (
    <>
      <Snackbar
        ref={snackbarRef}
        message="Successfully!"
        type={SnackbarType.success}
      />
      <div className={Style.Info}>
        {avatar}
        <div className={Style.Description}>
          <h2 className={Style.Name}>{account.name}</h2>
          {type === AccountInfoType.user && (
            <div className={Style.UserInfoLinks}>
              <div className={Style.UserDescription}>{account.description}</div>
              <a
                href={account?.website || ''}
                target="_blank"
                className={Style.UserWebsite}
                rel="noopener noreferrer"
              >
                {account?.website}
              </a>
              <a href={`mailto:${account?.email}`} className={Style.UserEmail}>
                {account?.email}
              </a>
            </div>
          )}
          {type === AccountInfoType.company && (
            <>
              <p className={Style.Category}>
                {(account as CompanyDTO).businessCategory?.name}
              </p>
              <p className={Style.Address}>{(account as CompanyDTO).address}</p>
              <Shedule
                shedules={(account as CompanyDTO).schedules}
                classNames={Style.Shedule}
              />
            </>
          )}
        </div>
        <div className={Style.Actions}>
          {type === AccountInfoType.company && (
            <>
              <div onClick={clickOfferSubscription}>
                <Icon id="person" />
                {(account as CompanyDTO).offerSubscriptionCount > 0
                  ? (account as CompanyDTO).offerSubscriptionCount
                  : null}
              </div>
              <Like
                onClick={clickLike}
                isLiked={account?.isLiked}
                likesCount={account.likesCount}
                onlyLikesCount={account.id === selectedCompanyId}
              />
            </>
          )}

          {signed && account.id !== selectedCompanyId && showChatButton ? (
            <OpenChat
              companyId={account?.id}
              chatId={account?.ownChatId ? account?.ownChatId : account?.chatId}
              callback={() => {
                router.push(`${route(Route.messages).link()}`);
              }}
            >
              <>
                <Icon id="chat" />
                {t('company.chat')}
              </>
            </OpenChat>
          ) : null}
        </div>
      </div>
      {type === AccountInfoType.company && (
        <AccountTabs company={account as CompanyDTO} />
      )}
      {type === AccountInfoType.user && <UserInfoTabs accountId={account.id} />}
    </>
  );
};

export default AccountInfo;
