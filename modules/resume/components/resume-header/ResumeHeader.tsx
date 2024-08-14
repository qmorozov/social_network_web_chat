import { FC } from 'react';
import { useRouter } from 'next/router';
import ResumeMenuDropdown from '../resume-menu/ResumeMenuDropdown';
import Icon from '../../../../component/icon/Icon';
import Style from './ResumeHeader.module.scss';
import { Route, route } from '../../../../config/route';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';

export const ResumeHeader: FC = () => {
  const { t } = useTranslation();
  const { push, query, back } = useRouter();
  const user: any = useTypedSelector(({ user }) => user?.user);
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );

  const clickEdit = () => {
    if (query.id) {
      push(
        `${route(Route.company).link()}/${query.id}/vacancy/${
          query.vacancyId
        }/edit`
      );
    } else {
      push(route(Route.editCV).link());
    }
  };

  const isEditOrDelete =
    selectedCompanyId === query.id || query.accountId === user?.id;

  return (
    <div className={Style.CompanyHeader}>
      <div>
        <div className={Style.Title}>
          <a
            className={Style.Back}
            onClick={() => {
              query.id
                ? push(`${route(Route.company).link()}/${query.id}`)
                : back();
            }}
          >
            <Icon id="a-back" />
          </a>
          <p>{query.id ? t('vacancy.title') : t('resume.title')}</p>
        </div>
        {isEditOrDelete && (
          <div className={Style.ActionBtn}>
            <span className={Style.ActionBtnEdit} onClick={clickEdit}>
              <Icon id="edit" width={16} height={16} />
            </span>
            <ResumeMenuDropdown />
          </div>
        )}
      </div>
    </div>
  );
};
