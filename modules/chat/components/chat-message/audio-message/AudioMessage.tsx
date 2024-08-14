import React, { useState, useRef, useEffect, FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WaveSurfer from 'wavesurfer.js';
import Icon from '../../../../../component/icon/Icon';
import Style from './AudioMessage.module.scss';

const formWaveSurferOptions = (ref: any) => ({
  container: ref,
  waveColor: '#2490ff',
  progressColor: '#001F7A',
  cursorColor: '#001F7A',
  cursorWidth: 0,
  barWidth: 1,
  barRadius: 3,
  barGap: 4,
  responsive: true,
  height: 24,
  normalize: true,
  partialRender: false,
  fillParent: true,
  minPxPerSec: 50
});

const toHHMMSS = (secs: string) => {
  const sec_num = parseInt(secs, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

interface IAudioMessage {
  audio: any;
  reply: boolean;
}

const AudioMessage: FC<IAudioMessage> = ({ audio, reply }) => {
  const waveformRef = useRef(null);
  const wavesurfer: any = useRef(null);
  const [playing, setPlay] = useState(false);

  const onFinish = () => {
    setPlay(false);
  };

  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(audio.url);
    wavesurfer.current.on('finish', onFinish);
    return () => wavesurfer.current.destroy();
  }, [audio.url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div className={`${Style.WrapperAudio} ${reply ? 'reply-audio' : ''}`}>
      <div onClick={handlePlayPause} className={Style.IconPlay}>
        {playing ? (
          <Icon id="pause" width={6} height={10} />
        ) : (
          <Icon id="play" width={6} height={10} />
        )}
      </div>
      <div className={Style.TimeAudio}>{toHHMMSS(audio.duration)}</div>
      <div id="waveform" ref={waveformRef} style={{ width: '100%' }} />
    </div>
  );
};

export default AudioMessage;
