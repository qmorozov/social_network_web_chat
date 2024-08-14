import React from 'react';
import Style from '../../../../styles/page/AuthPage.module.scss';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Validation from '../../../../config/validation';
import { useService } from '../../../../hooks/useService';
import { MeServiceProvider } from '../../../me/me.service';
import Button from '../../../../component/button/Button';

interface IAuthSetName {
  onSetName: (name: string) => any;
}

const AuthSetName: React.FC<IAuthSetName> = ({ onSetName }) => {
  const MeService = useService(MeServiceProvider);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, setError } = useForm();

  async function onSubmit(e: Record<string, any>) {
    return MeService.setName(e.name)
      .then(() => onSetName(e.name))
      .catch(() => {
        setError(
          'name',
          {
            message: 'validation.full-name'
          },
          { shouldFocus: true }
        );
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <header className={Style.AuthFormHeader}>
        <h1>{t('auth.auth-name.title')}</h1>
        <h2>{t('auth.auth-name.sub-title')}</h2>
      </header>

      <fieldset disabled={formState.isSubmitting}>
        <div className="form-control">
          <input
            autoFocus
            className="control -center -single"
            {...register('name', {
              validate: {
                required: Validation.required(),
                fullName: Validation.fullName()
              }
            })}
            placeholder={t('auth.auth-name.i-name-placeholder')}
          />
          <ControlValidation field="name" state={formState} />
        </div>

        <div className="form-footer">
          <Button
            type="submit"
            disabled={formState.isSubmitted && !formState.isValid}
          >
            {t('_.next')}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default AuthSetName;
