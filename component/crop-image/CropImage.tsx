import { FC } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { useTranslation } from 'react-i18next';
import Icon from '../icon/Icon';
import 'react-image-crop/dist/ReactCrop.css';
import Style from './CropImage.module.scss';

interface ICropImage {
  minWidth?: number;
  minHeight?: number;
  classes?: string;
  imageSrc: any;
  crop: Crop;
  setCrop: any;
  imgRef: any;
  onSelectFile: any;
  onLoad: any;
}

const CropImage: FC<ICropImage> = ({
  classes,
  minWidth = 250,
  minHeight = 250,
  imageSrc,
  crop,
  setCrop,
  imgRef,
  onSelectFile,
  onLoad
}) => {
  const { t } = useTranslation();
  return (
    <div className={classes ? classes : ''}>
      {imageSrc ? (
        <div className={Style.cropWrapper}>
          <ReactCrop
            crop={crop}
            minWidth={minWidth}
            minHeight={minHeight}
            onChange={(c) => setCrop(c)}
            aspect={1 / 1}
          >
            <img ref={imgRef} src={imageSrc} onLoad={onLoad} />
          </ReactCrop>
        </div>
      ) : (
        <>
          <label
            className={Style.inputImage}
            title={t('crop-image.upload-a-photo')}
          >
            <input type="file" accept="image/*" onChange={onSelectFile} />
            <Icon id="attach" width={24} height={22} />
            <span>{t('crop-image.upload-a-photo')}</span>
          </label>
        </>
      )}
    </div>
  );
};

export default CropImage;
