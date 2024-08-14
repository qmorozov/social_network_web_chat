import React, { FC, useRef, useState } from 'react';
import Icon from '../../../../../component/icon/Icon';
import Style from './ImagesMessageView.module.scss';

interface IVideo {
  url: string;
}

const Video: FC<IVideo> = ({ url }) => {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<string>('');

  const handleLoadedMetadata = () => {
    const video = videoEl.current;
    const duration = new Date(video!.duration * 1000)
      .toISOString()
      .slice(video!.duration > 3600 ? 11 : 14, 19);
    setVideoDuration(duration);
  };
  return (
    <>
      <video ref={videoEl} onLoadedMetadata={handleLoadedMetadata}>
        <source src={url} type="video/mp4" />
      </video>
      <div className={Style.playButton}>
        <Icon id="play-button" width={6} height={11} />
        <span className={Style.videoDuration}>{videoDuration}</span>
      </div>
    </>
  );
};

export default Video;
