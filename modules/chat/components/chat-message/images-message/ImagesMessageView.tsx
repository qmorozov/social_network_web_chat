import React, { FC } from 'react';
import { CompositeImageType } from '@chatix/core-ts';
import VideoMessage from './VideoMessage';
import Style from './ImagesMessageView.module.scss';

interface IImagesMessageView {
  images: any[];
  reply: boolean;
}

const ImagesMessageView: FC<IImagesMessageView> = ({ images, reply }) => {
  return (
    <div
      className={`${Style.wrapper} ${
        images.length === 1 ? Style.singleImage : ''
      } ${reply ? 'reply-image' : ''}`}
    >
      {images.map((image) => (
        <div className={Style.image} key={image.originalUrl}>
          {image.type === CompositeImageType.image ? (
            <img className={Style.item} src={image.previewSmallUrl} />
          ) : null}
          {image.type === CompositeImageType.video ? (
            <VideoMessage url={image.previewSmallUrl} />
          ) : null}
          {image.type === CompositeImageType.gif ? (
            <>
              <img src={image.previewSmallUrl} />
              <div className={Style.playButton}>
                <span>gif</span>
              </div>
            </>
          ) : null}
        </div>
      ))}
      {images.length > 6 && (
        <div className={Style.hiddenImagesCount}>{images.length - 6}</div>
      )}
    </div>
  );
};

export default ImagesMessageView;
