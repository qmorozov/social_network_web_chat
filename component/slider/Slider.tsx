import React, { FC, useEffect, useState } from 'react';
import { AppData } from '../../services/app';
import Icon from '../icon/Icon';
import ZoomImage from '../zoom-image/ZoomImage';
import Style from './Slider.module.scss';

interface ISlider {
  images: {
    id: string;
    url: string;
  }[];
  width: number;
  deleteSlide?: (id: string) => void;
  isDelete?: boolean;
}

interface IImageItem {
  id: string;
  url: string | undefined;
}

const Slider: FC<ISlider> = ({
  images,
  width,
  deleteSlide,
  isDelete = false
}: ISlider) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openedImage, setOpenedImage] = useState<IImageItem>();

  const ImageItem: FC<IImageItem> = ({ url, id }: IImageItem) => {
    return (
      <div
        className={Style.SliderItem}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {isDelete && deleteSlide && (
          <div className={Style.DeleteSlide} onClick={() => deleteSlide(id)}>
            <Icon id="delete" />
          </div>
        )}

        <img
          style={{ width }}
          src={AppData.avatarUrlPath(url)}
          alt={id}
          onClick={() =>
            setOpenedImage({ id, url: AppData.avatarUrlPath(url) })
          }
        />
      </div>
    );
  };

  useEffect(() => {
    if (images.length < activeSlide + 1) {
      setActiveSlide(images.length - 1);
    }
  }, [images]);

  return (
    <>
      {openedImage && (
        <ZoomImage
          image={openedImage}
          closeImage={() => setOpenedImage(undefined)}
        />
      )}
      <div className={Style.Slider}>
        <div className={Style.SliderWrapper} style={{ width }}>
          {images.map((img, idx) => (
            <ImageItem key={idx} url={img.url} id={img.id} />
          ))}
        </div>
        {images.length > 1 ? (
          <>
            <div className={Style.SliderDots}>
              <div
                className={Style.SliderDot}
                style={{
                  width: width / images.length,
                  transform: `translateX(${
                    activeSlide * (width / images.length)
                  }px)`
                }}
              >
                <div></div>
              </div>
            </div>
            <div className={Style.SliderNav}>
              {activeSlide > 0 ? (
                <div
                  className={Style.Prev}
                  onClick={() => setActiveSlide((prev) => prev - 1)}
                >
                  <Icon id="white-arrow" height={12} width={12} />
                </div>
              ) : null}
              {activeSlide < images.length - 1 ? (
                <div
                  className={Style.Next}
                  onClick={() => setActiveSlide((prev) => prev + 1)}
                >
                  <Icon id="white-arrow" height={12} width={12} />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Slider;
