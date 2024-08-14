import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { AddCompanySlice } from '../../store/add-company';
import Style from './AddEmail.module.scss';

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const AddEmail: FC = () => {
  const { t } = useTranslation();
  const [isFocus, setFocus] = useState(false);
  const { email } = useTypedSelector((state) => state.addCompany);
  const { setCompanyEmail } = useActions(AddCompanySlice);

  const isCheck = isFocus && validateEmail(email);

  return (
    <div className={['form-control', Style.blockInput].join(' ')}>
      {isCheck && (
        <div className={Style.Check}>
          <Icon id="check" width={12} />
        </div>
      )}
      <input
        onChange={(e) => {
          setCompanyEmail(e.target.value);
        }}
        onBlur={() => {
          setFocus(true);
        }}
        onFocus={() => {
          setFocus(false);
        }}
        value={email}
        className={[
          'control',
          '-single',
          isFocus && !validateEmail(email) ? Style.NotValid : ''
        ].join(' ')}
        placeholder={t('add-company.company-email.placeholder')}
      />
    </div>
  );
};

export default AddEmail;
