import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuDots from '../../../../component/menu-dots/MenuDots';
import Icon from '../../../../component/icon/Icon';
import Modal from '../../../../component/modal/Modal';
import Style from './ResumeMenuDropdown.module.scss';
import { useService } from '../../../../hooks/useService';
import { Account } from '../../../account/account.service';
import { useRouter } from 'next/router';
import { route, Route } from '../../../../config/route';
import { VacancieProvider } from '../../../vacancie/vacancie.service';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

enum ResumeMenuDropdownConfig {
  deleteResume = 'deleteResume'
}

const ResumeMenuDropdown: FC = () => {
  const { t } = useTranslation();
  const { push, query } = useRouter();
  const DeleteResume = useService(Account);
  const DeleteJob = useService(VacancieProvider);
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );

  const options = [
    {
      id: ResumeMenuDropdownConfig.deleteResume,
      render: () => (
        <div className={Style.UserMenuDropdownItem}>
          {t('resume.menu.delete')}
          <Icon id="delete" width={20} height={19} />
        </div>
      ),
      url: '/'
    }
  ];

  const onOptionSelectHandler = (id: number | string) => {
    if (id === ResumeMenuDropdownConfig.deleteResume) {
      if (query.id) {
        DeleteJob.deleteJob(query.vacancyId);
        push(`/company/${selectedCompanyId}`);
      } else {
        DeleteResume.deleteResume();
        push(route(Route.account).link());
      }
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

export default ResumeMenuDropdown;
