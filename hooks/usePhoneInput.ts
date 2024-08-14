import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber
} from 'react-phone-number-input/input';
import { useState } from 'react';
import { CountryCallingCode, CountryCode } from 'libphonenumber-js';

interface IPhoneInput {
  code: CountryCode;
  callingCode: CountryCallingCode;
}

function makePhoneInputValue(code: CountryCode): IPhoneInput {
  return {
    code,
    callingCode: getCountryCallingCode(code)
  };
}

export function usePhoneInput() {
  const countries = getCountries();

  const [country, setCountryFull] = useState<IPhoneInput>(() => {
    const countries = (navigator.languages || []).reduce((a, c) => {
      const locale = (c || '').split('-');
      if (locale?.[1]) {
        a.push(locale[1] as CountryCode);
      }
      return a;
    }, [] as CountryCode[]);

    return makePhoneInputValue(
      countries.find((c) => countries.includes(c as CountryCode)) ||
        countries[0]
    );
  });

  const [phoneNumber, setPhoneNumber] = useState<string>();

  function validate(value: string) {
    return value ? !!parsePhoneNumber(value, country.code)?.isValid() : false;
  }

  function full(phone: string): string {
    return parsePhoneNumber(phone, country.code)?.number as string;
  }

  return {
    countries,
    country,
    phoneNumber,
    validate,
    full,
    setPhoneNumber,
    setCountry: (country: CountryCode) =>
      setCountryFull(makePhoneInputValue(country))
  };
}
