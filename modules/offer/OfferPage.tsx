import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../config/route';
import { useDropDown } from '../../hooks/useDropDown';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UserDTO } from '../auth/dto/user';
import { ProfileType } from '../chat/models/Sender';
import { CompanyDTO, IOffer } from '../company/dto/company';
import { ChatixService } from '../chatix/chatix.service';
import AppContent from '../../component/app-content/AppContent';
import AppSide from '../../component/app-side/AppSide';
import Avatar from '../../component/avatar/Avatar';
import Icon from '../../component/icon/Icon';
import Popup from '../../component/popup/Popup';
import PillButtonBack from '../chat/components/pill-button-back/PillButtonBack';
import OpenChat from '../company/components/open-chat/OpenChat';
import dynamic from 'next/dynamic';
import OfferPageHeader from './components/offer-page-header/OfferPageHeader';
import CompanyOffer from '../../component/company-offer/CompanyOffer';

import Style from './OfferPage.module.scss';

const Chat = dynamic(() => import('../chat/components/chat/Chat'), {
  ssr: false
});

interface IOfferPage {
  offer: IOffer;
  company: CompanyDTO | UserDTO;
}

const OfferPage: FC<IOfferPage> = ({ offer, company }: IOfferPage) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { opened, open, close } = useDropDown();
  const [isOnline, setIsOnline] = useState(false);
  const [windowLocation, setWindowLocation] = useState('');

  const { user } = useTypedSelector((state) => state.user);

  const userBusinessesIds =
    (user?.businesses && user?.businesses.map((b) => b.id)) || [];

  const {
    searchInput,
    selectedCategoryGroupId,
    selectedCategoryId,
    companiesFilter
  } = useTypedSelector((state) => state.map);

  const isSearchResults =
    searchInput.length ||
    selectedCategoryGroupId ||
    selectedCategoryId ||
    companiesFilter;

  const avatarOptions = {
    url: company?.photoFileName,
    background:
      (company as CompanyDTO)?.avatarFillColor ||
      (company as UserDTO)?.defaultAvatarBackground,
    name: company?.name,
    type: ProfileType.business
  };

  useEffect(() => {
    if (company.id) {
      ChatixService.isOnline(company.id).then((s) => setIsOnline(!!s));
    }

    setWindowLocation(window.location.href);
  }, [company]);

  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const CustomChatHeader = () => (
    <div className={Style.PopupCustomHeader}>
      <div className={Style.PopupCompanyInfo}>
        <div className={Style.PopupAvatar}>
          <Avatar options={avatarOptions} />
        </div>
        <div className={Style.PopupHeaderInfo}>
          <p
            onClick={() => {
              if (user?.id !== company?.id) {
                router.push(`${route(Route.company).link()}/${company.id}`);
              } else {
                router.push(`${route(Route.account).link()}`);
              }
            }}
          >
            {company.name}
          </p>
          <div>
            <span>{company.name}</span>
            {isOnline ? t('chat.status.isOnline') : t('chat.status.isOffline')}
          </div>
        </div>
      </div>
      <div className={Style.PopupHeaderButtons}>
        <div
          onClick={() => {
            router.push(route(Route.messages).link());
          }}
        >
          <Icon id="expand" height={16} width={16} />
        </div>
        <div onClick={close}>
          <Icon id="close-with-circle" height={24} width={24} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AppSide type="left">
        {!!isSearchResults && (
          <PillButtonBack
            onClick={() => router.push(route(Route.main).link())}
          />
        )}
      </AppSide>
      <AppContent padding="normal">
        <div className={Style.OfferContainer}>
          <OfferPageHeader company={company} offer={offer} />
          <CompanyOffer offer={offer} companyId={company.id} />
        </div>
      </AppContent>
      <AppSide type="right">
        {![...userBusinessesIds, user?.id].includes(company.id) && (
          <OpenChat
            popupChat
            companyId={company.id}
            chatId={
              (company as CompanyDTO)?.chatId || (company as UserDTO)?.chatixId
            }
            callback={() => {
              open();
            }}
          >
            <button className={Style.OpenChatButton}>{t('chat.title')}</button>
          </OpenChat>
        )}
      </AppSide>
      <Popup
        opened={opened}
        onClose={close}
        classNames={Style.CustomPopupStyle}
      >
        <div className={Style.PopupChat}>
          <Chat
            customHeader={<CustomChatHeader />}
            link={isFirstMessage ? windowLocation : undefined}
            setIsFirstMessage={setIsFirstMessage}
          />
        </div>
      </Popup>
    </>
  );
};

export default OfferPage;
