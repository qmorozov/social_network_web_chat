import Link from 'next/link';
import { route, Route } from '../../../../config/route';
import { ProfileType } from '../../../chat/models/Sender';
import { CompanyDTO } from '../../dto/company';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import CompanyEditModal from '../company-edit-modal/CompanyEditModal';
import Avatar from '../../../../component/avatar/Avatar';
import AccountInfo, {
  AccountInfoType
} from '../../../../component/account-info/AccountInfo';

import Style from './CompanyInfo.module.scss';

interface ICompany {
  company: CompanyDTO;
  clickLike: () => void;
}

const CompanyInfo = ({ company, clickLike }: ICompany) => {
  const { t } = useTranslation();
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const avatarOptions = {
    url: company?.photoFileName,
    background: company?.avatarFillColor,
    name: company?.name,
    type: ProfileType.business
  };

  return (
    <AccountInfo
      avatar={
        <div className={Style.AvatarWrapper}>
          {company?.photoFileName || company.id !== selectedCompanyId ? (
            <Avatar options={avatarOptions} classes={Style.Logo} />
          ) : (
            <Link href={route(Route.CompanyAddingLogo).link()}>
              <a className={Style.Content}>
                <Avatar options={avatarOptions} classes={Style.Logo} />
                <span>{t('account.add-photo')}</span>
              </a>
            </Link>
          )}
          {company.id === selectedCompanyId ? (
            <div className={Style.Button}>
              <CompanyEditModal />
            </div>
          ) : null}
        </div>
      }
      account={company}
      type={AccountInfoType.company}
      clickLike={clickLike}
    />
  );
};

export default CompanyInfo;
