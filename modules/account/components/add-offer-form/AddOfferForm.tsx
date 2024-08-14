import React, { FC, useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { Account } from '../../account.service';
import { useService } from '../../../../hooks/useService';
import { useTranslation } from 'react-i18next';
import { ICurrency, IOffer, IUnit } from '../../dto/Account';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useActions } from '../../../../hooks/useActions';
import { AccountSlice } from '../../store/account.store';
import { AppLocalStorage } from '../../../../services/storage';
import Input from '../../../../component/input/Input';
import Textarea from '../../../../component/textarea/Textarea';
import Select from '../../../../component/select/Select';
import Icon from '../../../../component/icon/Icon';
import ControlValidation from '../../../../component/control-validation/ControlValidation';
import Validation from '../../../../config/validation';
import Loader from '../../../../component/loader/Loader';
import CategoryOfBusiness from '../../../add_company/components/category-of-business/CategoryOfBusiness';
import { Route, route } from '../../../../config/route';
import Slider from '../../../../component/slider/Slider';
import AddAnAdress from '../../../add_company/components/add-an-adress/AddAnAdress';

import Style from './AddOfferForm.module.scss';

const AddOfferForm: FC<any> = ({
  register,
  formState,
  setValue,
  clearErrors
}) => {
  const { t } = useTranslation();
  const { push } = useRouter();

  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<ICurrency>();
  const [selectValueUnit, setSelectValueUnit] = useState<IUnit>();

  const { getCurrency, getUnit, deleteOfferAttachment } = useService(Account);
  const { currency: currencyData, attachments } = useTypedSelector(
    (state) => state.account
  );
  const unitData = useTypedSelector((state) => state.account.unit);
  const { setOffer, deleteAttachment } = useActions(AccountSlice);
  const [offerData, setOfferData] = useState<IOffer>({
    description: '',
    price: 0,
    currencyId: '',
    unitId: '',
    categoryId: '',
    zipCode: '',
    country: '',
    administrativeArea: 'administrativeArea',
    locality: 'locality',
    address: '',
    lat: 0,
    lng: 0,
    businessId: AppLocalStorage.get('selectedCompany') ?? null
  });

  useEffect(() => {
    getCurrency();
    getUnit();
  }, []);

  useEffect(() => {
    setOffer(offerData);
  }, [offerData]);

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

  const unitList = () =>
    unitData &&
    unitData.map((item: IUnit) => ({
      key: item.id,
      id: item.id,
      name: item.name,
      render: () => <span>{item.name}</span>
    }));

  let filterTimeout: NodeJS.Timeout;
  const handleOfferData = (
    name: string,
    value: number | string | undefined
  ) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setOfferData((prevOfferData) => ({
        ...prevOfferData,
        [`${name}`]: value
      }));
    }, 500);
  };

  const handleAddress = (address: any) => {
    setOfferData((prevOfferData) => ({
      ...prevOfferData,
      address: address!.adress,
      lat: address!.lat,
      lng: address!.lng,
      country: address.country,
      zipCode: address.zipCode
    }));
  };

  useEffect(() => {
    handleOfferData('unitId', unitList()[0]?.id);
  }, [unitData]);

  useEffect(() => {
    handleOfferData('currencyId', currencyList()[0]?.id);
  }, [currencyData]);

  const addPhoto = () => {
    push(route(Route.attachingPhoto).link());
  };
  const sliderWrapper = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  useEffect(() => {
    if (sliderWrapper.current) {
      setSliderWidth(sliderWrapper.current.offsetWidth);
    }
  }, [attachments?.length]);

  const deleteSlide = (id: string) => {
    deleteOfferAttachment(id);
    deleteAttachment(id);
  };
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );

  useEffect(() => {
    if (selectedCompanyId) {
      const business = businesses?.find((el) => {
        return el.id === selectedCompanyId;
      });
      setOfferData((prevOfferData) => ({
        ...prevOfferData,
        address: business.address,
        lat: business.lat,
        lng: business.lng,
        country: business.country,
        zipCode: business.zipCode
      }));
    }
    handleOfferData('unitId', unitList()[0]?.id);
    handleOfferData('currencyId', currencyList()[0]?.id);
  }, [selectedCompanyId]);

  useEffect(() => {
    if (attachments.length) {
      setValue('attachment', attachments.length);
      clearErrors('attachment');
    }
  }, [attachments]);

  return (
    <>
      {attachments?.length ? (
        <div className={Style.Attachment} ref={sliderWrapper}>
          <Slider
            images={attachments}
            width={sliderWidth}
            deleteSlide={deleteSlide}
            isDelete
          />
        </div>
      ) : null}
      {currencyData.length > 0 && unitData.length ? (
        <div className={Style.Wrapper}>
          <fieldset className="form-control" onClick={addPhoto}>
            <div className={Style.addPhoto}>
              <h2>{t('account.add-an-offer.add-photo')}</h2>
              <Icon id="attach" />
            </div>
            <ControlValidation field="attachment" state={formState} />
          </fieldset>
          <fieldset className="form-control">
            <CategoryOfBusiness
              onChangeCategory={(category) => {
                handleOfferData('categoryId', category.id);
                setValue('categoryId', category.id);
                clearErrors('categoryId');
              }}
            />
            <ControlValidation field="categoryId" state={formState} />
          </fieldset>
          <fieldset className="form-control">
            <Textarea
              {...register('description', {
                validate: {
                  required: Validation.required()
                }
              })}
              placeholder={t(
                'account.add-an-offer.briefly-describe-your-placeholder'
              )}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOfferData('description', e.target.value)
              }
            />
            <ControlValidation field="description" state={formState} />
          </fieldset>
          <fieldset className={Style.Salary}>
            <fieldset className="form-control">
              <Input
                type="number"
                {...register('price', {
                  validate: {
                    required: Validation.required()
                  }
                })}
                placeholder={t('account.add-an-offer.price-per-placeholder')}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleOfferData('price', e.target.value);
                }}
              />
              <ControlValidation field="price" state={formState} />
            </fieldset>
            <Select
              open={isUnitOpen}
              position="bottom-right"
              lists={unitList() || []}
              optionClass={Style.SelectOption}
              setSelectValue={(e) => {
                setSelectValueUnit(e);
                handleOfferData('unitId', e?.id);
              }}
              onOptionSelect={() => {
                setIsUnitOpen(false);
              }}
              onClose={() => setIsUnitOpen(false)}
              offsetY={15}
            >
              <Input
                select={true}
                {...register('unit', {
                  validate: {
                    required: Validation.required()
                  }
                })}
                openSelect={isUnitOpen}
                value={selectValueUnit?.name || unitList()[0].name}
                onClick={() => setIsUnitOpen(true)}
              />
            </Select>
            <Select
              open={isContextOpen}
              position="bottom-right"
              lists={currencyList() || []}
              optionClass={Style.SelectOption}
              setSelectValue={(e) => {
                setSelectValue(e);
                handleOfferData('currencyId', e?.id);
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
                value={selectValue?.code || currencyList()[0].code}
                onClick={() => setIsContextOpen(true)}
              />
            </Select>
          </fieldset>
          <AddAnAdress
            setAdress={handleAddress}
            adress={{
              country: offerData.country,
              zipCode: offerData.zipCode,
              adress: offerData.address,
              lng: offerData.lng,
              lat: offerData.lat
            }}
          />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AddOfferForm;
