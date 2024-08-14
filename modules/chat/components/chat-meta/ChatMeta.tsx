import React, { FC } from 'react';
import { MessageDeliveryStatus } from '../../models/Message';
import { LocaleService } from '../../../../services/locale';
import { parseJSON } from 'date-fns';
import Icon from '../../../../component/icon/Icon';
import Style from './ChatMeta.module.scss';

interface IChatMeta {
  sentAt: number;
  isReaded?: boolean;
  classes?: string;
}

const ChatMeta: FC<IChatMeta> = ({ sentAt, isReaded, classes }) => {
  const formatDate = (r: any) =>
    LocaleService.toTime(r ? parseJSON(r) : new Date());
  return (
    <div className={`${Style.wrapper} ${classes ? classes : ''}`}>
      <span className={Style.time}>{formatDate(sentAt)}</span>
      <div className={Style.outgoingStatus}>
        {!isReaded ? (
          <Icon id="msg-sent" width={11} height={8} />
        ) : (
          <Icon id="msg-read" width={16} height={8} />
        )}
      </div>
    </div>
  );
};

export default ChatMeta;
