import React, { FC, MouseEventHandler } from 'react';
import Style from './ZoomImage.module.scss';

type Image = {
  id: string;
  url: string | undefined;
};

interface IZoomImage {
  image: Image;
  closeImage: () => void;
}

const ZoomImage: FC<IZoomImage> = ({ image, closeImage }: IZoomImage) => {
  return (
    <div className={Style.ZoomImageWrapper} onClick={() => closeImage()}>
      <div className={Style.ZoomImageBody}>
        <img src={image.url} />
      </div>
    </div>
  );
};

export default ZoomImage;
