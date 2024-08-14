import React, { FC, useState } from 'react';
import { AppData } from '../../../../../services/app';
import Icon from '../../../../../component/icon/Icon';
import Style from './LinkMessageView.module.scss';

interface ILinkMessageView {
  url?: string;
  title?: string;
  previewUrl?: string;
  description?: string;
  reply?: boolean;
}

const LinkMessageView: FC<ILinkMessageView> = ({
  url,
  title,
  previewUrl,
  description,
  reply
}) => {
  const [imageVisible, setImageVisible] = useState(true);
  const copyUrl = () => navigator.clipboard.writeText(url!);

  return (
    <>
      {url && (
        <div className={`${Style.wrapper} ${reply ? 'reply-link' : ''}`}>
          {imageVisible && previewUrl && (
            <div className={Style.preview}>
              <img
                onError={() => setImageVisible(false)}
                src={AppData.avatarUrlPath(previewUrl)}
                alt={title}
              />
              <div
                className={Style.previewBackground}
                style={{
                  backgroundImage: `url(${AppData.avatarUrlPath(previewUrl)})`
                }}
              />
            </div>
          )}
          <div className={Style.content}>
            {url && (
              <div className={Style.urlWrapper}>
                <a href={url} title={url} target="_blank" rel="noreferrer">
                  {new URL(url).hostname}
                </a>
                <span onClick={copyUrl}>
                  <Icon onClick={copyUrl} id="copy" width={15} height={14.5} />
                </span>
              </div>
            )}
            {title && <h3 className={Style.title}>{title}</h3>}
            {description && <p className={Style.desc}>{description}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default LinkMessageView;
