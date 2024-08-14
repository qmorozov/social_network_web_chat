import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppSide from '../../../../component/app-side/AppSide';
import AppContent from '../../../../component/app-content/AppContent';
import PageTitle from '../../../../component/page-title/PageTitle';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import CompanyName from '../company-name/CompanyName';
import Style from '../../../../styles/page/AddCompanyPage.module.scss';
import { Route, route } from '../../../../config/route';
import Breadcrumbs from '../../../../component/breadcrumbs/Breadcrumbs';
import CategoryOfBusiness from '../category-of-business/CategoryOfBusiness';
import AddAnAdress from '../add-an-adress/AddAnAdress';
import SpecifyWorkingHours from '../specify-working-hours/SpecifyWorkingHours';
import { useService } from '../../../../hooks/useService';
import { AddCompanyServiceProvider } from '../../add-company.service';
import { MeServiceProvider } from '../../../me/me.service';
import { useActions } from '../../../../hooks/useActions';
import { AddCompanySlice } from '../../store/add-company';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import AddEmail, { validateEmail } from '../add-email/AddEmail';
import { useRouter } from 'next/router';

const AddCompanyPage: FC = () => {
  const { t } = useTranslation();
  const breadcrumbs = [
    { route: route(Route.account).link(), title: route(Route.account).title },
    { route: '/', title: t('account.add-a-company') }
  ];

  const { name, businessCategory, shedule, days, adress, email } =
    useTypedSelector((state) => state.addCompany);

  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const isAllDaysSelected = days.filter((d) => d.isSelected).length === 7;
    if (
      name.length &&
      businessCategory &&
      adress &&
      isAllDaysSelected &&
      validateEmail(email)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, businessCategory, shedule, days, adress, email]);

  const AddCompany = useService(AddCompanyServiceProvider);
  const MeService = useService(MeServiceProvider);
  const { setCategory, setAdress } = useActions(AddCompanySlice);

  const clickAdd = async () => {
    try {
      await AddCompany.postBusiness().then(() => {
        MeService.getCurrentUserInfo();
        router.push(route(Route.account).link());
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppSide type="left" className="-ls no-border">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent>
        <PageTitle title={t('add-company.title')}>
          <Button
            disabled={disabled}
            onClick={() => clickAdd()}
            classes={Style.Btn}
          >
            {t('add-company.add-btn')}
            <Icon id="a-right-white" width={12} />
          </Button>
        </PageTitle>
        <div className={Style.Content}>
          <CompanyName />
          <AddEmail />
          <CategoryOfBusiness onChangeCategory={setCategory} />
          <AddAnAdress setAdress={setAdress} adress={adress} />
          <SpecifyWorkingHours />
        </div>
      </AppContent>
      <AppSide type="right" className="no-border" />
    </>
  );
};

export default AddCompanyPage;
