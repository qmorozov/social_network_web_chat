import React, { FC, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import CompanyMenuDropdown from '../company-menu/CompanytMenuDropdown';
import ChangeAccModal from '../../../../component/change-acc-modal/ChangeAccModal';
import Icon from '../../../../component/icon/Icon';
import Style from './CompanyHeader.module.scss';
import { Route, route } from '../../../../config/route';
import { CompanyDTO } from '../../dto/company';

interface ITitle {
  company: CompanyDTO;
}

export const CompanyHeader: FC<ITitle> = ({ company }) => {
  const router = useRouter();
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const { push } = useRouter();
  const clickEdit = () => {
    push(route(Route.addDescription).link());
  };
  return (
    <div className={Style.CompanyHeader}>
      <div>
        {selectedCompanyId === company.id ? (
          <ChangeAccModal />
        ) : (
          <Fragment>
            <a className={Style.Back} onClick={() => router.back()}>
              <Icon id="a-back" />
            </a>
            <p className={Style.Name}>{company.name}</p>
          </Fragment>
        )}
        <div className={Style.ActionBtn}>
          {selectedCompanyId === company.id ? (
            <span className={Style.ActionBtnEdit} onClick={clickEdit}>
              <Icon id="edit" width={16} height={16} />
            </span>
          ) : null}
          <CompanyMenuDropdown company={company} />
        </div>
      </div>
    </div>
  );
};
