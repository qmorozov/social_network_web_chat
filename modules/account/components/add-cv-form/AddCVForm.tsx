import React, {
  FC,
  useState,
  useEffect,
  useRef,
  MouseEvent,
  ChangeEvent
} from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Route } from '../../../../config/route';
import { Account } from '../../account.service';
import { useService } from '../../../../hooks/useService';
import { useTranslation } from 'react-i18next';
import { ICurrency, IResume } from '../../dto/Account';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import AddAdress, {
  AddAdressCallback
} from '../../../../component/add-adress/AddAdress';
import { useActions } from '../../../../hooks/useActions';
import { AccountSlice } from '../../store/account.store';
import Popover from '../../../add_company/components/popover/Popover';
import Input from '../../../../component/input/Input';
import Textarea from '../../../../component/textarea/Textarea';
import Select from '../../../../component/select/Select';
import Icon from '../../../../component/icon/Icon';
import Button from '../../../../component/button/Button';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import Validation from '../../../../config/validation';
import Loader from '../../../../component/loader/Loader';

import Style from './AddCvForm.module.scss';
import { VacancieProvider } from '../../../vacancie/vacancie.service';

const AddCVForm: FC = () => {
  const {
    register,
    formState,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onBlur'
  });
  const { t } = useTranslation();
  const { pathname, query } = useRouter();
  const mapInput = useRef<HTMLDivElement>(null);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<ICurrency>();
  const [adress, setAdress] = useState<AddAdressCallback>();
  const [isOpenMap, setIsOpenMap] = useState(false);
  const { getCurrency } = useService(Account);
  const currencyData = useTypedSelector((state) => state.account.currency);
  const { setResume } = useActions(AccountSlice);
  const [resumeData, setResumeData] = useState<IResume>({
    title: '',
    description: '',
    salaryFrom: null,
    salaryTo: null,
    currencyId: '',
    address: '',
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    getCurrency();
  }, []);

  useEffect(() => {
    setResume(resumeData);
  }, [resumeData]);

  const currencyList = () =>
    currencyData &&
    currencyData.map((item: ICurrency) => ({
      key: item.id,
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      code: item.code,
      render: () => (
        <>
          <span>{item.symbol}, </span>
          <span>{item.code}</span>
        </>
      )
    }));

  let filterTimeout: NodeJS.Timeout;
  const handleResumeData = (
    name: string,
    value: number | string | undefined
  ) => {
    clearTimeout(filterTimeout);
    setResumeData({ ...resumeData, [`${name}`]: value });
  };

  const handleAddress = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setResumeData({
      ...resumeData,
      address: adress!.adress,
      lat: adress!.lat,
      lng: adress!.lng
    });
  };

  const Resume = useService(Account);
  const Vacancy = useService(VacancieProvider);
  const isAddSV = pathname === `/${Route.addCV}`;
  const isEditSV = pathname === `/${Route.editCV}`;
  const isVacancy = pathname.split('/')[1] === Route.company;

  useEffect(() => {
    if (!query.id && !isEditSV) {
      handleResumeData('currencyId', currencyList()[0]?.id);
    }
  }, [currencyData]);

  useEffect(() => {
    const getResumeFromAPI = async () => {
      await Resume.getResume().then((res) => {
        setResumeData({ ...res, currencyId: res.currency.id });
        setSelectValue(res.currency);
      });
    };
    const getJobFromAPI = async () => {
      await Vacancy.getJob(query?.vacancyId).then((res) => {
        setResumeData({ ...res, currencyId: res.currency.id });
        setSelectValue(res.currency);
      });
    };
    if (isVacancy) {
      if (query.vacancyId) {
        getJobFromAPI();
      }
    } else {
      if (!isAddSV) {
        getResumeFromAPI();
      }
    }
  }, []);

  return (
    <>
      {currencyData.length > 0 ? (
        <form className={Style.Wrapper}>
          <fieldset className="form-control">
            <Input
              autoFocus={true}
              {...register('title', {
                validate: {
                  required: Validation.required()
                }
              })}
              defaultValue={resumeData.title}
              placeholder={t('account.add-a-cv.specialization-placeholder')}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleResumeData('title', e.target.value)
              }
            />
            <ControlValidation field="title" state={formState} />
          </fieldset>
          <fieldset className="form-control">
            <Textarea
              {...register('description', {
                validate: {
                  required: Validation.required()
                }
              })}
              value={resumeData.description}
              placeholder={t(
                'account.add-a-cv.briefly-describe-your-experience-placeholder'
              )}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleResumeData('description', e.target.value)
              }
            />
            <ControlValidation field="description" state={formState} />
          </fieldset>
          <fieldset className={Style.Salary}>
            <fieldset className="form-control">
              <Input
                type="number"
                {...register('salaryFrom', {
                  validate: {
                    required: Validation.required()
                  }
                })}
                defaultValue={resumeData.salaryFrom || ''}
                placeholder={t('account.add-a-cv.salary-from-placeholder')}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleResumeData('salaryFrom', e.target.value);
                }}
              />
              <ControlValidation field="salaryFrom" state={formState} />
            </fieldset>
            <fieldset className="form-control">
              <Input
                type="number"
                {...register('salaryTo', {
                  validate: (v: string) => {
                    const salaryFrom = getValues('salaryFrom');
                    return (
                      /^\d+$/.test(v as string) &&
                      (!/^\d+$/.test(salaryFrom) ||
                        parseInt(v as string, 10) >= parseInt(salaryFrom, 10))
                    );
                  }
                })}
                defaultValue={resumeData.salaryTo || ''}
                placeholder={t('account.add-a-cv.salary-to-placeholder')}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleResumeData('salaryTo', e.target.value)
                }
              />
              {errors.salaryTo && (
                <div className="control-validation -tl">
                  {t('validation.salaryTo')}
                </div>
              )}
            </fieldset>
            <Select
              open={isContextOpen}
              position="bottom-right"
              lists={currencyList() || []}
              optionClass={Style.SelectOption}
              setSelectValue={(e) => {
                setSelectValue(e);
                handleResumeData('currencyId', e?.id);
              }}
              onOptionSelect={() => {
                setIsContextOpen(false);
              }}
              onClose={() => setIsContextOpen(false)}
              offsetY={15}
            >
              <Input
                select={true}
                {...register('currency', {
                  validate: {
                    required: Validation.required()
                  }
                })}
                openSelect={isContextOpen}
                defaultValue={selectValue?.code || currencyList()[0].code}
                onClick={() => setIsContextOpen(true)}
              />
            </Select>
          </fieldset>
          <Popover
            btnContent={
              <div ref={mapInput}>
                <Input
                  select={true}
                  lastInput={true}
                  {...register('address', {
                    validate: {
                      required: Validation.required()
                    }
                  })}
                  value={resumeData.address}
                  openSelect={isOpenMap}
                  placeholder={t('account.add-a-cv.add-an-adress-placeholder')}
                  onClick={() => setIsOpenMap(!isOpenMap)}
                />
              </div>
            }
          >
            <label className={Style.SearchAddress}>
              <input
                placeholder={t('account.add-a-cv.map-input-placeholder')}
              />
              <Icon id="search" width={14} height={14} />
            </label>
            <div style={{ height: '300px' }}>
              <AddAdress getAdress={(addr) => setAdress(addr)} />
            </div>
            <div className={Style.Location}>
              <div>
                <h2 className={Style.LocationTitle}>
                  {t('account.add-a-cv.my-current-location')}
                </h2>
                <h3 className={Style.LocationSubTitle}>
                  {adress?.adress ? adress.adress : '...'}
                </h3>
              </div>
              <Button
                classes={`${Style.AddBtn} ${!adress ? Style.Disabled : ''}`}
                onClick={(e: MouseEvent<HTMLElement>) => {
                  handleAddress(e);
                  mapInput.current?.click();
                }}
              >
                {t('account.add-a-cv.add-button')}
              </Button>
            </div>
          </Popover>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AddCVForm;
