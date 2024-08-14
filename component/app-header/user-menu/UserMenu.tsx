import React, { FC, useEffect, useState } from 'react';
import { UserDTO } from '../../../modules/auth/dto/user';
import { Route, route } from '../../../config/route';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { ProfileType } from '../../../modules/chat/models/Sender';
import { CompanyDTO } from '../../../modules/company/dto/company';
import Link from 'next/link';
import UserMenuDropdown from './user-menu-dropdown/UserMenuDropdown';
import Avatar, { IAvatar } from '../../avatar/Avatar';
import Style from './UserMenu.module.scss';

interface IUserMenu {
  user: UserDTO;
}

const UserMenu: FC<IUserMenu> = ({ user }) => {
  const [company, setCompany] = useState<CompanyDTO>();
  const [avatarOptions, setAvatarOptions] = useState<IAvatar['options']>();
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  useEffect(() => {
    businesses?.map((business) => {
      if (business.id === selectedCompanyId) {
        setCompany(business);
        setAvatarOptions({
          url: business?.photoFileName,
          background: business?.avatarFillColor,
          name: business?.name,
          type: ProfileType.business
        });
      }
    });

    if (!selectedCompanyId) {
      setAvatarOptions({
        url: user?.photoFileName,
        background: user?.defaultAvatarBackground,
        name: user?.name,
        type: ProfileType.user
      });
    }
  }, [selectedCompanyId]);
  return (
    <div className={Style.UserMenuMain}>
      <Link href={route(Route.account).link()}>
        <a>
          {avatarOptions ? (
            <Avatar options={avatarOptions} classes={Style.Avatar} />
          ) : null}
          <strong className={Style.Name}>
            {selectedCompanyId ? company?.name : user.name}
          </strong>
        </a>
      </Link>
      <UserMenuDropdown />
    </div>
  );
};

export default UserMenu;
