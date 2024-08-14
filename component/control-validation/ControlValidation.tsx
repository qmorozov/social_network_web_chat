import React from 'react';
import { FormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IControlValidation {
  field: string;
  state: FormState<any>;
}

const ControlValidation: React.FC<IControlValidation> = ({ field, state }) => {
  const { t } = useTranslation();
  let error = state?.errors?.[field];

  if (!error) {
    return null;
  }

  if (Array.isArray(error)) {
    error = error.find(Boolean);
  }

  return error?.message ? (
    <div className="control-validation -tl">
      {t(error!.message as unknown as string)}
    </div>
  ) : null;
};

export default ControlValidation;
