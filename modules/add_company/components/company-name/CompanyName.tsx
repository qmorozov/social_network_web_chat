import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../component/icon/Icon';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { AddCompanySlice } from '../../store/add-company';
import Style from './CompanyName.module.scss';

const CompanyName: FC = () => {
  const { t } = useTranslation();
  const [isFocus, setFocus] = useState(false);
  const { name } = useTypedSelector((state) => state.addCompany);
  const { setCompanyName } = useActions(AddCompanySlice);

  const isCheck = isFocus && name;
  return (
    <div className={`form-control ${Style.blockInput}`}>
      {isCheck && (
        <div className={Style.Check}>
          <Icon id="check" width={12} />
        </div>
      )}
      <input
        onChange={(e) => {
          setCompanyName(e.target.value);
        }}
        onBlur={() => {
          setFocus(true);
        }}
        onFocus={() => {
          setFocus(false);
        }}
        value={name}
        className="control -single"
        placeholder={t('add-company.company-name.placeholder')}
      />
    </div>
  );
};

export default CompanyName;
