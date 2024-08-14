import { MouseEvent, useState, useEffect } from 'react';
import { Account } from '../account.service';
import { Route, route } from '../../../config/route';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useService } from '../../../hooks/useService';
import { useRouter } from 'next/router';
import { CompanyLikeProvider } from '../../company/services/company-like.service';
import { AppLocalStorage } from '../../../services/storage';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import PageTitle from '../../../component/page-title/PageTitle';
import Button from '../../../component/button/Button';
import AddDescriptionForm from '../components/add-description-form/AddDescriptionForm';
import Icon from '../../../component/icon/Icon';

import Style from './AddDescriptionPage.module.scss';

const AddDescriptionPage = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const breadcrumbs = [
    { route: route(Route.account).link(), title: route(Route.account).title },
    { route: '/', title: t('account.add-description.title') }
  ];
  const AddDescription = useService(Account);

  const [company, setCompany] = useState<any>([]);

  const CompanyLike = useService(CompanyLikeProvider);
  const companyId = AppLocalStorage.get('selectedCompany');

  const getCompany = async () => {
    const response = await CompanyLike.getCompany(companyId);
    setCompany(response);
  };

  useEffect(() => {
    if (companyId) {
      getCompany();
    }
  }, []);

  const { register, formState } = useForm({
    mode: 'onBlur'
  });
  const isDisabled = Boolean(Object.values(formState.errors).length);

  const addDescription = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await AddDescription.postDescription(company);
    if (AppLocalStorage.get('selectedCompany')) {
      push(`${route(Route.company).link()}/${companyId}`);
    } else {
      push(route(Route.account).link());
    }
  };

  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <PageTitle title={t('account.add-description.title')}>
          <Button
            classes={Style.addButton}
            onClick={(e) => addDescription(e)}
            disabled={isDisabled}
          >
            <span>{t('account.add-cv-button')}</span>
            {isDisabled ? (
              <Icon id="a-right" width={13} height={13} />
            ) : (
              <Icon id="a-right-white" width={13} height={13} />
            )}
          </Button>
        </PageTitle>
        <div className="page-content">
          <AddDescriptionForm
            company={company}
            register={register}
            formState={formState}
          />
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default AddDescriptionPage;
