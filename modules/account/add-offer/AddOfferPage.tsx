import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '../account.service';
import { Route, route } from '../../../config/route';
import { useTranslation } from 'react-i18next';
import { useService } from '../../../hooks/useService';
import { useRouter } from 'next/router';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import PageTitle from '../../../component/page-title/PageTitle';
import AddOfferForm from '../components/add-offer-form/AddOfferForm';
import Icon from '../../../component/icon/Icon';

import Style from './AddOfferPage.module.scss';

const AddOfferPage: FC = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const breadcrumbs = [
    { route: route(Route.account).link(), title: route(Route.account).title },
    { route: '/', title: t('account.add-offer') }
  ];
  const AddOffer = useService(Account);

  const {
    register,
    formState,
    handleSubmit,
    setValue,
    setError,
    getValues,
    clearErrors
  } = useForm({
    defaultValues: {
      categoryId: '',
      attachment: ''
    },
    mode: 'all'
  });

  const isDisabled = Boolean(Object.values(formState.errors).length);

  const setErrors = (value: any) => {
    const data = getValues(value);
    if (!data) {
      setError(value, {
        type: 'required',
        message: 'This field is required'
      });
    }
  };

  const onError = () => {
    setErrors('categoryId');
    setErrors('attachment');
  };

  const addOffer = async (data: any, e: any) => {
    e.preventDefault();
    setErrors('categoryId');
    setErrors('attachment');
    await AddOffer.postOffer();
    push(route(Route.account).link());
  };

  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <form onSubmit={handleSubmit(addOffer, onError)}>
          <PageTitle title={t('account.add-offer')}>
            <button
              type="submit"
              className={`${Style.addButton} ${
                isDisabled ? Style.disabled : ''
              }`}
              disabled={isDisabled}
            >
              <span>{t('account.add-cv-button')}</span>
              <Icon id="a-right" width={13} height={13} />
            </button>
          </PageTitle>

          <div className="page-content-size">
            <AddOfferForm
              register={register}
              formState={formState}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          </div>
        </form>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default AddOfferPage;
