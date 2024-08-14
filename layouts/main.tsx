import React, { useEffect, useState } from "react";
import AppHeader from '../component/app-header/AppHeader';
import DocumentHead from './_head';
import { useRouter } from 'next/router';
import { useService } from '../hooks/useService';
import { MeServiceProvider } from '../modules/me/me.service';
import { useAuth } from '../hooks/useAuth';
import Loader from '../component/loader/Loader';
import { Route, route } from '../config/route';
import { useWindowSize } from '../hooks/useWindowSize';
import GetMobileApp from '../modules/get-mobile-app/getMobileApp';

interface IMainLayout {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string | string[];
  view?: 'screen' | 'full';
  protectedRoute?: boolean;
  image?: string;
}

const MainLayout: React.FC<IMainLayout> = ({
  children,
  title,
  description,
  keywords,
  view = 'screen',
  protectedRoute = true,
  image
}) => {
  const MeService = useService(MeServiceProvider);
  const auth = useAuth();
  const router = useRouter();
  const { width } = useWindowSize();

  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!auth.init) {
      return void MeService.init();
    }

    if (!auth.loading) {
      if (
        (auth.user && !MeService.validUser(auth.user)) ||
        (!auth.user && protectedRoute)
      ) {
        return void router?.push({
          pathname: route(Route.auth).link(),
          query: {
            redirectTo: router.asPath
          }
        });
      }
    }
  }, [auth.user, auth.init, auth.loading]);

  useEffect(() => {
    setLocation(window.location.href);
  }, [router])

  if (
    location &&
    (!auth.init ||
      auth.loading ||
      (protectedRoute && !MeService.validUser(auth.user)))
  ) {
    return <Loader />;
  }

  return (
    <>
      <DocumentHead {...{ title, description, keywords, image }} />
      {width && width <= 1000 ? (
        <GetMobileApp />
      ) : (
        <>
          <AppHeader />

          <div className={['app-content-wrapper', `view-${view}`].join(' ')}>
            <div className="app-layout app-content">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout;
