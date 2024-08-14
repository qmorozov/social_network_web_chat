export const enum Route {
  main = 'map',
  map = 'map',
  privacy = 'privacy',
  faq = 'faq',
  auth = 'auth',
  settings = 'settings',
  feed = 'feed',
  messages = 'messages',
  company = 'company',
  addCompany = 'add-company',
  qrCode = 'qr-code',
  account = 'account',
  AccountAddingPhoto = 'account/adding-photo',
  addCV = 'account/add-cv',
  editCV = 'account/edit-cv',
  addOffer = 'account/add-offer',
  addDescription = 'account/add-description',
  attachingPhoto = 'account/add-offer/attaching-photo',
  resume = 'resume',
  offer = 'offer',
  CompanyAddingLogo = 'company/adding-logo',
  companyAddingVacancy = 'company/add-vacancy',
  companyVacancy = 'company/vacancy'
}

class AppRoute {
  constructor(public readonly url: string, public readonly title: string) {}

  link() {
    return `/${this.url}`;
  }
}

export const routes: Record<Route, AppRoute> = {
  [Route.main]: new AppRoute('', 'map-search.title'),
  [Route.privacy]: new AppRoute('privacy', 'privacy-policy.title'),
  [Route.faq]: new AppRoute('faq', 'faq.title'),
  [Route.auth]: new AppRoute('auth', 'auth.title'),
  [Route.settings]: new AppRoute('settings', 'settings.title'),
  [Route.feed]: new AppRoute('feed', 'feed.title'),
  [Route.messages]: new AppRoute('messages', 'messages.title'),
  [Route.company]: new AppRoute('company', 'company.title'),
  [Route.qrCode]: new AppRoute('qr-code', 'settings.qr-code.title'),
  [Route.account]: new AppRoute('account', 'account.title'),
  [Route.addCompany]: new AppRoute('add-company', 'company.add-company'), // todo check Vitaliy
  [Route.AccountAddingPhoto]: new AppRoute(
    'account/adding-photo',
    'account.adding-a-photo'
  ),
  [Route.addCV]: new AppRoute('account/add-cv', 'account.add-a-cv'),
  [Route.editCV]: new AppRoute('account/edit-cv', 'account.edit-a-cv'),
  [Route.addOffer]: new AppRoute('account/add-offer', 'account.add-an-offer'),
  [Route.addDescription]: new AppRoute(
    'account/add-description',
    'account.add-description'
  ),
  [Route.attachingPhoto]: new AppRoute(
    'account/add-offer/attaching-photo',
    'account.add-an-offer.attaching-a-photo'
  ),
  [Route.offer]: new AppRoute('offer', 'offer.title'),
  [Route.resume]: new AppRoute('resume', 'resume.title'),
  [Route.CompanyAddingLogo]: new AppRoute(
    'company/adding-logo',
    'company.addingALogoPageTitle'
  ),
  [Route.companyAddingVacancy]: new AppRoute(
    'company/add-vacancy',
    'company.companyAddingVacancy'
  ),
  [Route.companyVacancy]: new AppRoute(
    'company/vacancy',
    'company.companyAddingVacancy'
  )
} as const;

export function route(route: Route) {
  return routes[route];
}
