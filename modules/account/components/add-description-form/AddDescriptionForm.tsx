import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IDescription, DescriptionTypes } from '../../dto/Account';
import { useActions } from '../../../../hooks/useActions';
import { AccountSlice } from '../../store/account.store';
import Input from '../../../../component/input/Input';
import Textarea from '../../../../component/textarea/Textarea';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import Validation from '../../../../config/validation';

import Style from './AddDescriptionForm.module.scss';
import { AppLocalStorage } from '../../../../services/storage';
import { useAuth } from '../../../../hooks/useAuth';

const AddDescriptionForm: FC<any> = ({ company, register, formState }) => {
  const { t } = useTranslation();

  const { user } = useAuth();

  const { setDescription } = useActions(AccountSlice);
  const [descriptionData, setDescriptionData] = useState<IDescription>({
    description: '',
    website: '',
    email: '',
    name: ''
  });

  const isCompany = Boolean(AppLocalStorage.get('selectedCompany'));

  useEffect(() => {
    if (isCompany) {
      setDescriptionData({
        name: company.name,
        description: company.description,
        website: company.website,
        email: company.email
      });
    }
  }, [company]);

  useEffect(() => {
    if (!isCompany) {
      setDescriptionData({
        description: user?.description,
        website: user?.website,
        email: user?.email,
        name: user?.name
      });
    }
  }, [user]);

  useEffect(() => {
    setDescription(descriptionData);
  }, [descriptionData]);

  const handleDescriptionData = (
    name: string,
    value: number | string | undefined
  ) => {
    setDescriptionData({ ...descriptionData, [`${name}`]: value });
  };

  return (
    <form className={Style.Wrapper}>
      <fieldset className="form-control">
        <Input
          {...register(DescriptionTypes.name, {
            validate: {
              required: Validation.required()
            }
          })}
          value={descriptionData.name || ''}
          placeholder={t('account.add-description.name')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleDescriptionData(DescriptionTypes.name, e.target.value)
          }
        />
        <ControlValidation field="name" state={formState} />
      </fieldset>

      <fieldset className="form-control">
        <Textarea
          {...register(DescriptionTypes.description, {
            validate: {
              required: Validation.required()
            }
          })}
          value={descriptionData.description}
          placeholder={t('account.add-description.briefly-describe')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleDescriptionData(DescriptionTypes.description, e.target.value)
          }
        />
        <ControlValidation field="description" state={formState} />
      </fieldset>
      <fieldset className="form-control">
        <Input
          {...register(DescriptionTypes.website, {
            validate: {
              required: Validation.required()
            }
          })}
          value={descriptionData.website}
          placeholder={t('account.add-description.web-site')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleDescriptionData(DescriptionTypes.website, e.target.value)
          }
        />
        <ControlValidation field="website" state={formState} />
      </fieldset>
      <fieldset className="form-control">
        <Input
          {...register(DescriptionTypes.email, {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            },
            validate: {
              required: Validation.required()
            }
          })}
          value={descriptionData.email}
          placeholder={t('account.add-description.e-mail')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleDescriptionData(DescriptionTypes.email, e.target.value)
          }
        />
        <ControlValidation field="email" state={formState} />
      </fieldset>
    </form>
  );
};

export default AddDescriptionForm;
