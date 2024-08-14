import React, { FC, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Route, route } from '../../../../config/route';
import { useActions } from '../../../../hooks/useActions';
import { MapSlice } from '../../../map/store/map';
import { CompanyDTO } from '../../dto/company';
import MenuDots from '../../../../component/menu-dots/MenuDots';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Style from './CompanyMenuDropdown.module.scss';
import ShareModal from '../../../../component/share-modal/ShareModal';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useDropDown } from '../../../../hooks/useDropDown';
import { ConfirmBtn } from '../confirm-btn/ConfirmBtn';
import { useService } from '../../../../hooks/useService';
import { CompanyLikeProvider } from '../../services/company-like.service';
import { MeServiceProvider } from '../../../me/me.service';

enum CompanyMenuDropdownConfig {
  similarCompanies = 'similarCompanies',
  showOnMap = 'showOnMap',
  share = 'share',
  delete = 'delete'
}

interface ICompanyMenuDropdown {
  company: CompanyDTO;
}

const CompanyMenuDropdown: FC<ICompanyMenuDropdown> = ({
  company
}: ICompanyMenuDropdown) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [location, setLocation] = useState('');

  const { signed } = useTypedSelector((state) => state.user);
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);

  const { open, opened, close } = useDropDown();
  const { setCategoryId } = useActions(MapSlice);
  const CompanyProvider = useService(CompanyLikeProvider);
  const MeService = useService(MeServiceProvider);

  const deleteCompany = async () => {
    await CompanyProvider.deleteCompany(company.id);
  };
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const logOutHandler = (e: React.MouseEvent<HTMLElement> | undefined) => {
    e && e.preventDefault();
    setShowConfirmDelete(true);
  };

  const isBusinessesUser = businesses?.find((business) => {
    return business?.id === company.id;
  });

  const onDecline = () => {
    setShowConfirmDelete(false);
  };

  const onAccept = () => {
    deleteCompany();
    router.push({
      pathname: route(Route.account).link()
    });
    MeService.setSelectedCompany(null);
  };

  useEffect(() => {
    setLocation(window.location.href);
  }, [router])

  const shareData = {
    title: company.name,
    url: location
  };

  const options = [
    {
      id: CompanyMenuDropdownConfig.similarCompanies,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('companyMenu.similarCompanies')}
          <Icon id="companies" width={20} height={19} />
        </div>
      ),
      url: '/'
    },
    {
      id: CompanyMenuDropdownConfig.showOnMap,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('companyMenu.showOnMap')}
          <Icon id="map-mark" width={21} height={21} />
        </div>
      ),
      url: '/'
    }
  ];

  if (signed) {
    options.push({
      id: CompanyMenuDropdownConfig.share,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('companyMenu.share')}
          <Icon id="share" width={19} height={18} />
        </div>
      ),
      url: '/'
    });
  }

  if (isBusinessesUser) {
    options.push({
      id: CompanyMenuDropdownConfig.delete,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('companyMenu.delete')}
          {showConfirmDelete ? (
            <ConfirmBtn onAccept={onAccept} onCancel={onDecline} />
          ) : (
            <Icon id="delete" width={21} height={21} />
          )}
        </div>
      ),
      url: '/'
    });
  }

  const [isContextOpen, setIsContextOpen] = useState(false);

  const onOptionSelectHandler = (
    id: number | string,
    e: React.MouseEvent<HTMLElement> | undefined
  ) => {
    if (id === CompanyMenuDropdownConfig.similarCompanies) {
      setCategoryId(company.businessCategoryId);
      router.push({
        pathname: route(Route.map).link(),
        query: {
          categoryId: company.businessCategoryId
        }
      });
    }
    if (id === CompanyMenuDropdownConfig.showOnMap) {
      router.push({
        pathname: route(Route.map).link(),
        query: {
          lat: company.lat,
          lng: company.lng
        }
      });
    }
    if (id === CompanyMenuDropdownConfig.share) {
      opened ? close() : open();
    }
    if (id === CompanyMenuDropdownConfig.delete) {
      logOutHandler(e);
      return;
    }
    setIsContextOpen(false);
  };

  return (
    <>
      <Modal
        position="bottom-end"
        open={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        options={options}
        offsetY={28}
        classNameModalBody={Style.ModalBody}
        onOptionSelect={(idx, e) => {
          onOptionSelectHandler(idx, e);
        }}
      >
        <div onClick={() => setIsContextOpen(true)}>
          <MenuDots />
        </div>
      </Modal>
      {opened && (
        <ShareModal isActive={opened} close={close} shareData={shareData} />
      )}
    </>
  );
};

export default CompanyMenuDropdown;
