import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddAdress, {
  AddAdressCallback
} from '../../../../component/add-adress/AddAdress';
import Button from '../../../../component/button/Button';
import { useDropDown } from '../../../../hooks/useDropDown';
import BtnOpenSelect from '../btn-open-select/BtnOpenSelect';

import Style from './AddAnAdress.module.scss';

interface IAddAnAdress {
  adress: AddAdressCallback | null;
  setAdress: any;
}

const AddAnAdress: FC<IAddAnAdress> = ({ adress, setAdress }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [currentAdress, setCurrentAdress] = useState<AddAdressCallback | null>(
    null
  );

  const { opened, open, close } = useDropDown();

  return (
    <div className="form-control -column">
      <div ref={buttonRef} onClick={() => (opened ? close() : open())}>
        <BtnOpenSelect
          title={adress?.adress || t('add-company.add-an-adress.title')}
        />
      </div>
      {/* <div className={Style.SearchBlock}>
        <input placeholder={t('add-company.add-an-adress.placeholder')} />
        <Icon id="search" />
      </div> */}
      <div
        className={[
          Style.MapBlock,
          opened ? Style.ShowMapBlock : Style.HideMapBlock
        ].join(' ')}
      >
        <div style={{ height: '300px' }}>
          <AddAdress
            getAdress={(addr) => {
              setCurrentAdress(addr);
              setAdress(addr);
            }}
          />
        </div>

        <div className={Style.BlockLocation}>
          <div>
            <h2 className={Style.CurrentLocationTitle}>
              {t('add-company.add-an-adress.myCurrentLocation')}:
            </h2>
            <h3 className={Style.CurrentLocation}>
              {currentAdress?.adress ? currentAdress.adress : '...'}
            </h3>
          </div>
          <Button
            classes={Style.Btn}
            onClick={(e) => {
              e.preventDefault();
              setAdress(currentAdress);
              buttonRef?.current?.click();
            }}
          >
            {t('button.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAnAdress;
