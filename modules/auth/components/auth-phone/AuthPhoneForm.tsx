import { FC, useEffect, useRef, useState } from 'react';
import { usePhoneInput } from '../../../../hooks/usePhoneInput';
import { useDropDown } from '../../../../hooks/useDropDown';
import { CountryCode } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useService } from '../../../../hooks/useService';
import { AuthServiceProvider } from '../../auth.service';
import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input';
import Validation from '../../../../config/validation';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import WithBackdrop from '../../../../component/with-backdrop/WithBackdrop';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';

import Style from '../../../../styles/page/AuthPage.module.scss';

interface IAuthPhoneForm {
  onPhoneSent: (phone: string) => any;
}

interface ICountryCodeList {
  code: string;
  country: string;
  label: string;
}

const AuthPhoneForm: FC<IAuthPhoneForm> = ({ onPhoneSent }) => {
  const AuthService = useService(AuthServiceProvider);
  const { t } = useTranslation();
  const { register, handleSubmit, formState, setFocus } = useForm();
  const { country, setCountry, validate, full } = usePhoneInput();
  const { opened, open, close } = useDropDown();

  const onSubmit = async (data: any) => {
    const phone = full(data.phone as string);
    return AuthService.getCode(phone).then(() => onPhoneSent(phone));
  };

  function selectCountry(country: CountryCode | any) {
    close();
    setCountry(country);
    setFocus('phone');
  }

  function closeDropDown() {
    setFocus('phone');
    return close();
  }

  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (opened && listRef.current) {
      const activeItem = listRef.current.children[activeIndex];
      if (activeItem) {
        // @ts-ignore
        activeItem.firstChild.focus();
      }
    }
  }, [opened, activeIndex, listRef]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const countryList = getCountries();

    if (event.keyCode === 38) {
      setActiveIndex((prevActiveIndex) =>
        prevActiveIndex - 1 < 0 ? countryList.length - 1 : prevActiveIndex - 1
      );
    } else if (event.keyCode === 40) {
      setActiveIndex(
        (prevActiveIndex) => (prevActiveIndex + 1) % countryList.length
      );
    } else if (event.keyCode === 13) {
      selectCountry(countryList[activeIndex]);
    }
  };

  const [countryCodeList, setCountryCodeList] = useState<ICountryCodeList[]>(
    []
  );

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getCountries().map((country) => {
      const code = getCountryCallingCode(country);

      setCountryCodeList((prevCountryCodeList) => [
        ...prevCountryCodeList,
        {
          code: `+${code}`,
          country: country,
          label: t(`phone-country.${country}`)
        }
      ]);
    });
  }, []);

  const filteredCountryList = countryCodeList.filter((country) => {
    return (
      country.code.includes(searchTerm) ||
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div className={Style.AuthFormHeader}>
        <h1>{t('auth.auth-phone.title')}</h1>
        <h2>{t('auth.auth-phone.sub-title')}</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={formState.isSubmitting}>
          <div className="form-control" tabIndex={0}>
            <button
              className={[
                'pre-control -single drop-toggle',
                Style.SelectCountryBtn
              ].join(' ')}
              type="button"
              onClick={() => open()}
            >
              +{country.callingCode}
            </button>

            <input
              autoFocus
              className="control -center -single"
              {...register('phone', {
                validate: {
                  required: Validation.required(),
                  phone: Validation.phone(validate)
                }
              })}
            />

            {opened && (
              <WithBackdrop onClick={closeDropDown}>
                <div className={Style.PhoneDropMenu} ref={listRef}>
                  <label className={Style.PhoneDropMenuSearch}>
                    <input
                      type="text"
                      placeholder="Search.."
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Icon id="search" width={14} height={14} />
                  </label>
                  <ul>
                    {filteredCountryList.map(
                      ({ code, country, label }, index) => (
                        <li key={index}>
                          <button
                            tabIndex={opened ? 0 : -1}
                            className={activeIndex === index ? 'active' : ''}
                            onClick={() => selectCountry(country)}
                            onKeyDown={() => handleKeyDown}
                          >
                            <strong>{code}</strong>
                            <span>{label}</span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </WithBackdrop>
            )}

            <ControlValidation field="phone" state={formState} />
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
    </>
  );
};

export default AuthPhoneForm;
