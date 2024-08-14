import { FC, MouseEvent, useState, useEffect } from 'react';
import { Account } from '../account.service';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Route, route } from '../../../config/route';
import { useTranslation } from 'react-i18next';
import { useService } from '../../../hooks/useService';
import { useRouter } from 'next/router';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import PageTitle from '../../../component/page-title/PageTitle';
import AddCVForm from '../components/add-cv-form/AddCVForm';
import Icon from '../../../component/icon/Icon';

import Style from './AddCVPage.module.scss';
import { VacancieProvider } from '../../vacancie/vacancie.service';

const AddCvPage: FC = () => {
  const { t } = useTranslation();
  const { push, pathname, query } = useRouter();
  const { resume } = useTypedSelector((state) => state.account);
  const isAddSV = pathname === `/${Route.addCV}`;

  const title = query.id
    ? t('company.breadcrumbs.edit-a-vacancy')
    : pathname === `/${Route.companyAddingVacancy}`
    ? t('company.breadcrumbs.adding-a-vacancy')
    : isAddSV
    ? t('account.add-cv')
    : t('account.edit-cv');

  const isVacancy = pathname.split('/')[1] === Route.company;
  const breadcrumbs = [
    {
      route: route(Route.account).link(),
      title: isVacancy ? route(Route.company).title : route(Route.account).title
    },
    { route: '/', title }
  ];
  const AddResume = useService(Account);
  const AddVacancy = useService(VacancieProvider);
  const [checkResume, setCheckResume] = useState(false);

  useEffect(() => {
    !Object.values(resume).some((el) => !el) &&
    resume.salaryTo &&
    resume.salaryFrom &&
    +resume.salaryTo >= +resume.salaryFrom
      ? setCheckResume(false)
      : setCheckResume(true);
  }, [resume]);

  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );

  const addResume = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!checkResume) {
      if (isVacancy) {
        if (query.vacancyId) {
          await AddVacancy.putJob(query.vacancyId);
        } else {
          await AddVacancy.postVacancie(selectedCompanyId);
        }
        push(`${route(Route.company).link()}/${selectedCompanyId}`);
      } else {
        if (isAddSV) {
          await AddResume.postResume();
        } else {
          await AddResume.editResume();
        }
        push(route(Route.account).link());
      }
    }
  };

  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <PageTitle title={title}>
          <button
            className={`${Style.addButton} ${
              checkResume ? Style.disabled : ''
            }`}
            onClick={(e) => addResume(e)}
          >
            <span>{t('account.add-cv-button')}</span>
            <Icon id="a-right" width={13} height={13} />
          </button>
        </PageTitle>
        <div className="page-content-size">
          <AddCVForm />
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default AddCvPage;
