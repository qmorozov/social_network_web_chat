import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../../../config/route';
import { useRouter } from 'next/router';
import Modal from '../../../../component/modal/Modal';
import Icon from '../../../../component/icon/Icon';
import Style from './AccountEditModal.module.scss';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

enum AccountEditModalConfig {
  addAPost = 'addAPost',
  AddACV = 'AddACV',
  addAPhoto = 'addAPhoto',
  addAnOffer = 'addAnOffer'
}

const AccountEditModal: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { resume } = useTypedSelector((state) => state.resume);

  const options = [
    // {
    //   id: AccountEditModalConfig.addAPost,
    //   render: () => (
    //     <div className={Style.AccountEditModalItem}>
    //       {t('accountEditMenu.addAPost')}
    //       <Icon id="add-an-offer" width={16} height={16} />
    //     </div>
    //   ),
    //   url: '/'
    // },
    {
      id: AccountEditModalConfig.AddACV,
      render: () => (
        <div className={Style.AccountEditModalItem}>
          {resume ? t('accountEditMenu.editACV') : t('accountEditMenu.addACV')}
          <Icon id="add-a-cv" width={15} height={16} />
        </div>
      ),
      url: resume ? route(Route.editCV).link() : route(Route.addCV).link()
    },
    {
      id: AccountEditModalConfig.addAPhoto,
      render: () => (
        <div className={Style.AccountEditModalItem}>
          {t('accountEditMenu.addAPhoto')}
          <Icon id="add-a-photo" width={16} height={13} />
        </div>
      ),
      url: route(Route.AccountAddingPhoto).link()
    },
    {
      id: AccountEditModalConfig.addAnOffer,
      render: () => (
        <div className={Style.AccountEditModalItem}>
          {t('accountEditMenu.addAnOffer')}
          <Icon id="add-an-offer" width={15} height={16} />
        </div>
      ),
      url: route(Route.addOffer).link()
    }
  ];

  const onOptionSelectHandler = (id: number | string) => {
    const url = options.find((o) => o.id === id)?.url || '/';
    router.push(url);
  };
  const [isContextOpen, setIsContextOpen] = useState(false);
  return (
    <Modal
      position="bottom-start"
      open={isContextOpen}
      onClose={() => setIsContextOpen(false)}
      options={options}
      classNameModalBody={Style.AccountEditModalBody}
      onOptionSelect={(id) => onOptionSelectHandler(id)}
    >
      <div
        className={`${Style.button} ${isContextOpen ? Style.ModalOpen : ''}`}
        onClick={() => setIsContextOpen(!isContextOpen)}
      >
        <Icon id="plus" width={12} height={12} />
      </div>
    </Modal>
  );
};

export default AccountEditModal;
