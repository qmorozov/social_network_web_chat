import React, { FC } from 'react';
import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';
import { Route, route } from '../../../../config/route';
import Button from '../../../../component/button/Button';
import Icon from '../../../../component/icon/Icon';
import Style from './EmptyChat.module.scss';
import { useRouter } from 'next/router';

const EmptyChat: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className={Style.wrapper}>
      <h1 className={Style.title}>
        <Trans>{t('chat.empty.title')}</Trans>
      </h1>
      <p className={Style.text}>{t('chat.empty.text')}</p>
      <Button
        classes={Style.button}
        onClick={() => router.push(`${route(Route.map).link()}`)}
      >
        {t('chat.empty.button')}
      </Button>
      <div className={Style.offer__button}>
        <Link href={route(Route.addOffer).link()}>
          <a>
            <span>{t('chat.empty.offer-button')}</span>
            <Icon id="a-right" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default EmptyChat;
