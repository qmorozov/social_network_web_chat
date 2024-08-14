import React, { FC, useState } from 'react';
import { Route, route } from '../../../../config/route';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Style from './CompanyEditModal.module.scss';

enum CompanyEditModalConfig {
  addAnOffer = 'addAnOffer',
  addAVacancy = 'AddAVacancy',
  addAPhoto = 'AddAPhoto'
}

const CompanyEditModal: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const options = [
    {
      id: CompanyEditModalConfig.addAnOffer,
      render: () => (
        <div className={Style.CompanyEditModalItem}>
          {t('companyEditModal.addAnOffer')}
          <Icon id="add-an-offer" width={18} height={18} />
        </div>
      ),
      url: route(Route.addOffer).link()
    },
    {
      id: CompanyEditModalConfig.addAVacancy,
      render: () => (
        <div className={Style.CompanyEditModalItem}>
          {t('companyEditModal.addAVacancy')}
          <Icon id="add-a-vacancy" width={17} height={19} />
        </div>
      ),
      url: route(Route.companyAddingVacancy).link()
    },
    {
      id: CompanyEditModalConfig.addAPhoto,
      render: () => (
        <div className={Style.CompanyEditModalItem}>
          {t('companyEditModal.addAPhoto')}
          <Icon id="add-a-photo" width={17} height={18} />
        </div>
      ),
      url: route(Route.CompanyAddingLogo).link()
    }
  ];
  const onOptionSelectHandler = (id: number | string) => {
    const url = options.find((o) => o.id === id)?.url || '/';
    router.push(url);
  };
  return (
    <Modal
      position="bottom-start"
      open={isContextOpen}
      onClose={() => setIsContextOpen(false)}
      options={options}
      classNameModalBody={Style.CompanyEditModalBody}
      onOptionSelect={(id) => onOptionSelectHandler(id)}
      offsetY={15}
    >
      <div
        className={`${Style.Button} ${isContextOpen ? Style.ModalOpen : ''}`}
        onClick={() => setIsContextOpen(!isContextOpen)}
      >
        <Icon id="plus" width={12} height={12} />
      </div>
    </Modal>
  );
};

export default CompanyEditModal;
