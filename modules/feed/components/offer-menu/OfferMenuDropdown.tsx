import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import MenuDots from '../../../../component/menu-dots/MenuDots';
import { OffersDTO } from '../../dto/feed';

import Style from './OfferMenuDropdown.module.scss';
import { useService } from '../../../../hooks/useService';
import { FeedProvider } from '../../feed.service';

enum OfferMenuDropdownConfig {
  save = 'save',
  unsubscribe = 'unsubscribe'
}

interface IOfferMenuDropdown {
  businessId: string;
  offer?: OffersDTO;
}

const OfferMenuDropdown: FC<IOfferMenuDropdown> = ({
  businessId
}: IOfferMenuDropdown) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { putUnsubscribe, getOffers } = useService(FeedProvider);

  const options = [
    {
      id: OfferMenuDropdownConfig.save,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('feed.offerMenu.save')}
          <Icon id="heart" width={20} height={19} />
        </div>
      ),
      url: '/'
    },
    {
      id: OfferMenuDropdownConfig.unsubscribe,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('feed.offerMenu.unsubscribe')}
          <Icon id="person" width={21} height={21} />
        </div>
      ),
      url: '/'
    }
  ];

  const onOptionSelectHandler = (id: number | string) => {
    if (id === OfferMenuDropdownConfig.save) {
      console.log(id);
    }
    if (id === OfferMenuDropdownConfig.unsubscribe) {
      putUnsubscribe(businessId);
      getOffers();
    }
  };
  const [isContextOpen, setIsContextOpen] = useState(false);

  return (
    <>
      <Modal
        position="bottom-end"
        open={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        options={options}
        offsetY={28}
        classNameModalBody={Style.ModalBody}
        onOptionSelect={(idx) => {
          onOptionSelectHandler(idx);
          setIsContextOpen(false);
        }}
      >
        <div onClick={() => setIsContextOpen(true)}>
          <MenuDots />
        </div>
      </Modal>
    </>
  );
};

export default OfferMenuDropdown;
