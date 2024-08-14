import dynamic from 'next/dynamic';

import AppContent from '../component/app-content/AppContent';
import AuthLayout from '../layouts/auth';
import Style from '../styles/page/AuthPage.module.scss';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../config/route';

const AuthPageContent = dynamic(
  () => import('../modules/auth/components/auth-page/AuthPage'),
  {
    ssr: false
  }
);

export default function AuthPage() {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <AppContent>
        <AuthPageContent />

        <ul className={Style.FooterMenu}>
          <li>
            <a
              href="https://busineschat.com/?page_id=61"
              target="_blank"
              rel="noreferrer"
            >
              {t(route(Route.privacy).title)}
            </a>
          </li>
          <li>
            <Link href={route(Route.faq).link()}>
              <a>{t(route(Route.faq).title)}</a>
            </Link>
          </li>
        </ul>
      </AppContent>
    </AuthLayout>
  );
}
