import React, { SyntheticEvent, useRef, useState } from 'react';
import Style from '../../../../styles/page/AuthPage.module.scss';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Validation from '../../../../config/validation';
import { AuthServiceProvider } from '../../auth.service';
import { useService } from '../../../../hooks/useService';
import Button from '../../../../component/button/Button';

interface IAuthCodeForm {
  phone: string;
  onLogIn: (user: any) => any;
}

const AuthCodeForm: React.FC<IAuthCodeForm> = ({ phone, onLogIn }) => {
  const AuthService = useService(AuthServiceProvider);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, clearErrors, setValue, setError } =
    useForm();
  const [inputsStatus, setInputStatus] = useState<
    Record<number, Record<string, any>>
  >({});

  const controlCodeElement = useRef<HTMLDivElement>(null);
  const submitButtonElement = useRef<HTMLButtonElement>(null);

  const codeLength = 4;

  async function onSubmit(e: Record<string, any>) {
    return AuthService.authorize(phone, e?.code?.join(''))
      .then(onLogIn)
      .catch(() => {
        setError('code', {
          message: 'validation.code.invalid'
        });

        setValue('code', new Array(codeLength).fill(''));
      });
  }

  function onInput(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    const inputs = Array.from(controlCodeElement.current?.childNodes || []);
    const currentIndex =
      (target.parentElement && inputs.indexOf(target.parentElement)) ?? -1;
    const valueLength = target.value?.length || 0;

    if (formState?.errors?.code && !Array.isArray(formState?.errors?.code)) {
      clearErrors('code');
    }

    setInputStatus((s) => ({
      ...s,
      [currentIndex]: {
        hasValue: !!valueLength
      }
    }));

    if (valueLength === target.maxLength) {
      if (currentIndex >= inputs.length - 1) {
        return submitButtonElement.current?.focus();
      }

      const next = (
        inputs[currentIndex + 1] as HTMLDivElement
      )?.querySelector?.('.control') as HTMLInputElement;
      return next?.focus();
    }
  }

  const validate = (e: React.KeyboardEvent): void => {
    const regex = /[0-9]|\./;
    if (!regex.test(e.key)) e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <header className={Style.AuthFormHeader}>
        <h1>{t('auth.auth-code.title')}</h1>
        <h2>{t('auth.auth-code.sub-title')}</h2>
      </header>

      <fieldset disabled={formState.isSubmitting}>
        <div
          className={[
            'form-control-code',
            formState.isSubmitted && !formState.isValid ? '-hasError' : ''
          ].join(' ')}
          ref={controlCodeElement}
          onInput={onInput}
        >
          <ControlValidation field="code" state={formState} />

          {new Array(codeLength).fill(undefined).map((_, i) => (
            <div
              className={[
                'form-control -code-input',
                inputsStatus?.[i]?.hasValue ? '-focused' : ''
              ].join(' ')}
              key={i}
            >
              <input
                maxLength={1}
                autoFocus={!i}
                placeholder="-"
                className="control -center -single"
                {...register(`code.${i}`, {
                  validate: {
                    required: Validation.required('validation.code.required')
                  }
                })}
                onKeyPress={validate}
              />
            </div>
          ))}
        </div>

        <div className="form-footer">
          <Button
            type="submit"
            ref={submitButtonElement}
            disabled={formState.isSubmitted && !formState.isValid}
          >
            {t('_.next')}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default AuthCodeForm;
