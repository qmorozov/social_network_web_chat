import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { wrapper } from '../services/app-store';
import Head from 'next/head';
import '../i18n';
import { useEffect, useState, createContext } from 'react';

export const DropdownPortalContext = createContext<HTMLDivElement | null>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const [dropdownTarget, setDropdownTarget] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const element = document.getElementById('dropdown-portal');
    setDropdownTarget(element instanceof HTMLDivElement ? element : null);
  }, []);

  return (
    <DropdownPortalContext.Provider value={dropdownTarget}>
      <div className="app">
        <div id="dropdown-portal" />
        <div className="overlay" />
        <Head>
          <meta name="robots" content="index, follow" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preload" as="image" href="/icons.svg" />
        </Head>
        <Component {...pageProps} />
      </div>
    </DropdownPortalContext.Provider>
  );
}

export default wrapper.withRedux(MyApp);
