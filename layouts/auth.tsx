import React, { useEffect } from 'react';
import AppHeader from '../component/app-header/AppHeader';
import Style from '../component/app-header/AppHeader.module.scss';
import DocumentHead from './_head';
import { useRouter } from 'next/router';
import { useService } from '../hooks/useService';
import { MeServiceProvider } from '../modules/me/me.service';
import { useAuth } from '../hooks/useAuth';
import Loader from '../component/loader/Loader';
import { Route, route } from '../config/route';

interface IAuthLayout {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string | string[];
  view?: 'screen' | 'full';
}

const AuthLayout: React.FC<IAuthLayout> = ({
  children,
  title,
  description,
  keywords,
  view = 'screen'
}) => {
  const MeService = useService(MeServiceProvider);
  const auth = useAuth();
  const router = useRouter();

  const { redirectTo = route(Route.main).link() } = router.query;

  useEffect(() => {
    if (!auth.init) {
      return void MeService.init();
    }

    if (!auth.loading && MeService.validUser(auth.user)) {
      return void router.push(redirectTo as string);
    }
  }, [auth.user, auth.init, auth.loading]);

  if (!auth.init || auth.loading || MeService.validUser(auth.user)) {
    return <Loader />;
  }

  return (
    <>
      <DocumentHead {...{ title, description, keywords }} />

      <AppHeader
        menu={false}
        user={false}
        className={Style.appHeaderNoBorder}
      />

      <div className={['app-content-wrapper', `view-${view}`].join(' ')}>
        <div className="app-layout app-content">{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
