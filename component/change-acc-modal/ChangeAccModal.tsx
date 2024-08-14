import React, { FC, useEffect, useState } from 'react';
import { ProfileType } from '../../modules/chat/models/Sender';
import { route, Route } from '../../config/route';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDropDown } from '../../hooks/useDropDown';
import { useService } from '../../hooks/useService';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { MeServiceProvider } from '../../modules/me/me.service';
import Icon from '../icon/Icon';
import Modal, { Options } from '../modal/Modal';
import Avatar from '../avatar/Avatar';
import Style from './ChangeAccModal.module.scss';

interface IDropdownItem {
  id: string | number | undefined;
  type: ProfileType | undefined;
  isSelected: boolean;
  name: string | undefined;
  subtitle: string;
  url: string | undefined;
  background: string | undefined;
  onOptionSelect: (id: any, type: any) => void;
}

const DropdownItem = ({
  id,
  type,
  isSelected,
  name,
  subtitle,
  url,
  background,
  onOptionSelect
}: IDropdownItem) => {
  const avatarOptions = {
    url,
    background,
    name,
    type
  };

  return (
    <div
      className={Style.DropdownItem}
      onClick={() => onOptionSelect(id, type)}
    >
      <div className={Style.DropdownItemAvatar}>
        {typeof type !== 'undefined' ? (
          <Avatar options={avatarOptions} />
        ) : (
          <div className={Style.DropdownItemAdd}>+</div>
        )}
      </div>
      <div className={Style.DropdownItemBody}>
        <h4>{name}</h4>
        <p>{subtitle}</p>
      </div>
      {isSelected ? (
        <div className={Style.DropdownItemSelected}>
          <Icon id="selected" />
        </div>
      ) : null}
    </div>
  );
};

const ChangeAccModal: FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const { t } = useTranslation();
  const { open, opened, close } = useDropDown();
  const [companyName, setCompanyName] = useState<string>();
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);
  const MeService = useService(MeServiceProvider);

  useEffect(() => {
    businesses!.map((business) => {
      business.id === selectedCompanyId && setCompanyName(business.name);
    });
  }, [selectedCompanyId]);

  const userCompanies = () =>
    user?.businesses!.map((company) => ({
      id: company.id as string,
      selectedType: ProfileType.business,
      render: () => (
        <DropdownItem
          id={company.id}
          type={ProfileType.business}
          isSelected={selectedCompanyId === company.id}
          name={company.name || undefined}
          subtitle={t('account.headerDropdown.company')}
          url={company?.photoFileName || undefined}
          background={company?.avatarFillColor}
          onOptionSelect={(id, type) => {}}
        />
      )
    })) || [];

  const dropdownItems = [
    {
      id: user?.id as string,
      selectedType: ProfileType.user,
      render: () => (
        <DropdownItem
          id={user?.id}
          type={ProfileType.user}
          isSelected={!selectedCompanyId}
          name={user?.name || undefined}
          subtitle={t('account.headerDropdown.mainUser')}
          url={user?.photoFileName || undefined}
          background={user?.defaultAvatarBackground}
          onOptionSelect={(id, type) => {}}
        />
      )
    },
    ...userCompanies()
  ] as Options[];

  if ((user?.businesses?.length || 0) < 2) {
    dropdownItems.push({
      id: 'add-company' as string,
      selectedType: '',
      render: () => (
        <DropdownItem
          id="add-company"
          type={undefined}
          isSelected={false}
          name={t('account.headerDropdown.create')}
          subtitle={t('account.headerDropdown.createInfo')}
          url={user?.photoFileName || undefined}
          background={user?.defaultAvatarBackground}
          onOptionSelect={(id, type) => {}}
        />
      )
    });
  }

  const onOptionSelect = (idx: string | number, type?: number | string) => {
    if (type === ProfileType.user) {
      push(`/${Route.account}`);
      MeService.setSelectedCompany(null);
    }
    if (type === ProfileType.business) {
      push(`/${Route.account}`);
      MeService.setSelectedCompany(idx as string | null);
    }
    if (idx === Route.addCompany) push(`/${Route.addCompany}`);
  };

  return (
    <Modal
      position="bottom-start"
      open={opened}
      onClose={close}
      options={dropdownItems}
      classNameModalBody={Style.ModalBody}
      onOptionSelect={(id, type, selectedType) => {
        onOptionSelect(id, selectedType);
        close();
      }}
      offsetY={30}
    >
      <div onClick={open}>
        <span className={[Style.name, opened ? 'arrowOpen' : ''].join(' ')}>
          <h2 className={Style.Title}>
            <span>{selectedCompanyId ? companyName : user?.name}</span>
            <Icon id="a-down" width={7} height={7} />
          </h2>
        </span>
      </div>
    </Modal>
  );
};

export default ChangeAccModal;
