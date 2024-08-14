import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../../../config/route';
import { useActions } from '../../../../hooks/useActions';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { ProfileType } from '../../../chat/models/Sender';
import { CompanyDTO } from '../../../company/dto/company';
import { MapSlice } from '../../store/map';
import Avatar, { IAvatar } from '../../../../component/avatar/Avatar';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Shedule from '../../../../component/shedule/Shedule';
import MapSearchResultOfferList from '../map-search-result-offer-list/MapSearchResultOfferList';
import Style from '../MapSearchResults.module.scss';
import { useService } from '../../../../hooks/useService';
import { FeedProvider } from '../../../feed/feed.service';
import Snackbar, {
  SnackbarType
} from '../../../../component/snackbar/Snackbar';

interface IMapSearchResultBusinessListItem {
  business: CompanyDTO;
}

enum DropdownEnum {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
  showOnMap = 'showOnMap',
  similarCompanies = 'similarCompanies'
}

const MapSearchResultBusinessListItem: FC<IMapSearchResultBusinessListItem> = ({
  business
}: IMapSearchResultBusinessListItem) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { hoveredCompany } = useTypedSelector((state) => state.map);
  const { signed } = useTypedSelector((state) => state.user);
  const { setHoveredCompany, setShowOnMap, setCategoryId } =
    useActions(MapSlice);

  const handleCompanyOpen = (id: string) => {
    router.push(`${route(Route.company).link()}/${id}`);
  };

  const handleOptionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const { putUnsubscribe, postSubscribe } = useService(FeedProvider);

  const [isSubscribed, setIsSubscribed] = useState(
    business.isUserSubscribedOnBusinessOffers
  );
  const snackbarRef = useRef<any>(null);
  const clickSubscribe = () => {
    if (signed) {
      if (isSubscribed) {
        putUnsubscribe(business.id);
      } else {
        postSubscribe(business.id);
      }
      setIsSubscribed(!isSubscribed);
      snackbarRef.current.show();
    }
  };

  const dropdownItems = [
    {
      id: DropdownEnum.subscribe,
      render: () => (
        <div className={Style.DropdownOption} onClick={clickSubscribe}>
          <p>
            {isSubscribed
              ? t(`mapCompanyDropdown.${DropdownEnum.unsubscribe}`)
              : t(`mapCompanyDropdown.${DropdownEnum.subscribe}`)}
          </p>
          <Icon id="person" width={16} height={16} />
        </div>
      )
    },
    {
      id: DropdownEnum.showOnMap,
      render: () => (
        <div
          className={Style.DropdownOption}
          onClick={() => {
            setShowOnMap({
              show: true,
              coords: {
                lat: business.lat,
                lng: business.lng
              }
            });
          }}
        >
          {' '}
          <p>{t(`mapCompanyDropdown.${DropdownEnum.showOnMap}`)}</p>
          <Icon id="map-mark" width={16} height={16} />
        </div>
      )
    },
    {
      id: DropdownEnum.similarCompanies,
      render: () => (
        <div
          className={Style.DropdownOption}
          onClick={() => setCategoryId(business.businessCategoryId)}
        >
          {' '}
          <p>{t(`mapCompanyDropdown.${DropdownEnum.similarCompanies}`)}</p>
          <Icon id="diplomat" width={16} height={16} />
        </div>
      )
    }
  ];

  const { close, open, opened } = useDropDown();

  const listItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (
      hoveredCompany?.type === 'map' &&
      hoveredCompany?.id === business.id &&
      listItemRef.current
    ) {
      listItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [hoveredCompany]);

  const avatarOptions = {
    url: business?.photoFileName,
    background: business?.avatarFillColor,
    name: business?.name,
    type: ProfileType.business
  } as IAvatar['options'];

  return (
    <li
      ref={listItemRef}
      onMouseEnter={() => {
        setHoveredCompany({
          id: business.id,
          lat: business.lat,
          lng: business.lng,
          type: 'list'
        });
      }}
      onMouseLeave={() => {
        setHoveredCompany(null);
      }}
    >
      <Snackbar
        ref={snackbarRef}
        message="Successfully!"
        type={SnackbarType.success}
      />
      <div
        className={[
          Style.SearchResultInfo,
          hoveredCompany?.id === business.id ? Style.HoveredCompany : ''
        ].join(' ')}
        onClick={() => handleCompanyOpen(business.id)}
      >
        <div className={Style.BusinessLogo}>
          <Avatar options={avatarOptions} />
        </div>
        <div className={Style.BusinessInfo}>
          <div className={`trim-text ${Style.BusinessName}`}>
            {business.name}
          </div>
          <Shedule
            shedules={business.schedules}
            classNames={Style.BusinessSchedule}
          ></Shedule>
        </div>

        <Modal
          position="bottom-left"
          open={opened}
          onClose={close}
          options={dropdownItems}
          classNameModalBody={Style.ModalBody}
          onOptionSelect={(idx, e) => {
            handleOptionClick(e as React.MouseEvent);
            close();
          }}
          offsetY={30}
        >
          <button
            className={['pill', Style.BusinessOptions].join(' ')}
            onClick={(e) => {
              handleOptionClick(e);
              open();
            }}
          >
            <Icon id="dots" width={12} height={12} />
          </button>
        </Modal>
      </div>
      {business?.offers?.length > 0 && (
        <MapSearchResultOfferList business={business} />
      )}
    </li>
  );
};

export default MapSearchResultBusinessListItem;
