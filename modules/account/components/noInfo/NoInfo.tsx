import { FC } from 'react';
import router from 'next/router';
import { route, Route } from '../../../../config/route';
import { useAuth } from '../../../../hooks/useAuth';
import Button from '../../../../component/button/Button';

import Style from './NoInfo.module.scss';

interface INoInfo {
  link: Route;
  titleBtn: string;
  title: string | JSX.Element;
  subtitle: string | JSX.Element;
}

const NoInfo: FC<INoInfo> = ({ link, titleBtn, title, subtitle }) => {
  const { signed } = useAuth();

  if (!signed) return null;

  return (
    <div className={Style.wrapper}>
      <h2 className={Style.title}>{title}</h2>
      <h3 className={Style.subtitle}>{subtitle}</h3>
      <Button
        classes={Style.btn}
        onClick={() => {
          router.push(`${route(link).link()}`);
        }}
      >
        {titleBtn}
      </Button>
    </div>
  );
};
export default NoInfo;
