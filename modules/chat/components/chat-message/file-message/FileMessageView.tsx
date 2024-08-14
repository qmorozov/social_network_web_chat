import React, { FC } from 'react';
import { getFileExtensions, formatBytes } from '../../../../helper';
import { CompositeFileType } from '@chatix/core-ts';
import Icon from '../../../../../component/icon/Icon';
import Style from './FileMessageView.module.scss';
import AudioMessage from '../audio-message/AudioMessage';

interface IFileMessageView {
  files: any[];
  reply: boolean;
}

const FileMessageView: FC<IFileMessageView> = ({ files, reply }) => {
  return (
    <ul
      className={`${Style.wrapper} ${files.length > 1 && Style.severalFiles} ${
        reply ? 'reply-file' : ''
      }`}
    >
      {files.map((file: any, index: number) => {
        if (file.type === CompositeFileType.audio) {
          return (
            <AudioMessage
              key={file}
              audio={{ url: file.url, duration: 1 }}
              reply={reply}
            />
          );
        }
        return (
          <li key={`${index}_${file.name}`} className={Style.file}>
            <a className={Style.file__preview} href={file.url} download>
              {file.type === CompositeFileType.audio && (
                <span className={Style.media__file}>fff</span>
              )}
              {file.type === CompositeFileType.image && (
                <span>{getFileExtensions(file.name)}</span>
              )}
              {file.type === CompositeFileType.basic && (
                <span>{getFileExtensions(file.name)}</span>
              )}
            </a>
            <div className={Style.file__info}>
              <p className={`trim-text ${Style.file__title}`} title={file.name}>
                {file.name}
              </p>
              <span className={Style.file__size}>
                <span>{formatBytes(file.sizeBytes)}</span>
                <Icon id="download" width={10} height={17} />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FileMessageView;
