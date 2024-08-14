import { useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Route, route } from '../../../../config/route';
import { LoginDTO } from '../../dto/login';
import { useService } from '../../../../hooks/useService';
import { AuthServiceProvider } from '../../auth.service';
import { useAuth } from '../../../../hooks/useAuth';
import AuthPhoneForm from '../auth-phone/AuthPhoneForm';
import AuthCodeForm from '../auth-code/AuthCodeForm';
import AuthSetName from '../auth-name/AuthSetName';

import Style from '../../../../styles/page/AuthPage.module.scss';

enum AuthStep {
  phone,
  code,
  name
}

export default function AuthPageContent() {
  const AuthService = useService(AuthServiceProvider);
  const auth = useAuth();

  const [authStep, setAuthStep] = useState<AuthStep>(
    auth?.signed ? AuthStep.name : AuthStep.phone
  );
  const [authPhone, setAuthPhone] = useState<string | null>(null);

  const onPhoneSent = (phone: string) => {
    setAuthPhone(phone);
    setAuthStep(AuthStep.code);
  };
  const router = useRouter();

  const { redirectTo = route(Route.main).link() } = router.query;

  const onLogIn = async (loginData: LoginDTO) => {
    AuthService.login(loginData);
    return loginData.user.name ? redirect() : setAuthStep(AuthStep.name);
  };

  const onSetName = () => redirect();

  function redirect() {
    return Router.push(redirectTo as string);
  }

  return (
    <div className={Style.AuthContainer}>
      {authStep === AuthStep.phone && (
        <AuthPhoneForm onPhoneSent={onPhoneSent} />
      )}
      {authStep === AuthStep.code && (
        <AuthCodeForm onLogIn={onLogIn} phone={authPhone!} />
      )}
      {authStep === AuthStep.name && <AuthSetName onSetName={onSetName} />}
    </div>
  );
}
