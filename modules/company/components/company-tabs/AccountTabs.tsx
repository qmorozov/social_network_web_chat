import { useEffect, useState, Fragment, FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Route } from '../../../../config/route';
import { useService } from '../../../../hooks/useService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { VacancieProvider } from '../../../vacancie/vacancie.service';
import { BusinessApi } from '../../company.api';
import { CompanyDTO, IOffer } from '../../dto/company';
import { Tab } from '@headlessui/react';
import NoInfo from '../../../account/components/noInfo/NoInfo';
import Description from './description/Description';
import Offers from './Offers';
import Vacancies from './vacancy/Vacancies';

import Style from '../../../account/components/tabs/Tabs.module.scss';

interface IAccountTabs {
  company: CompanyDTO;
}

const AccountTabs: FC<IAccountTabs> = ({ company }: IAccountTabs) => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<IOffer[] | []>([]);
  const [isOffersLoading, setIsOffersLoading] = useState(true);
  const JobsService = useService(VacancieProvider);
  const { jobs } = useTypedSelector((state) => state.jobs);
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);

  const isBusinessesUser = businesses?.find((business) => {
    return business?.id === company.id;
  });

  useEffect(() => {
    const getOffersFromAPI = async () => {
      await BusinessApi.getCompanyOffers(company.id).then((res) => {
        setOffers(res);
        setIsOffersLoading(false);
      });
    };
    getOffersFromAPI();
    JobsService.getVacancie(company.id);
  }, [company.id]);

  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );

  const tabs = [
    {
      id: 'offers',
      title: t('account.tabs.offers'),
      count: offers.length,
      tab:
        !isBusinessesUser || company.offers.length ? (
          <Offers
            offers={offers}
            loading={isOffersLoading}
            company={{
              companyId: company.id,
              chatId: company.chatId
            }}
          />
        ) : (
          <NoInfo
            link={Route.addOffer}
            titleBtn={t('account.add-an-offer.no-info.titleBtn')}
            title={
              <Trans i18nKey="multiline">
                {t('account.add-an-offer.no-info.title')}
              </Trans>
            }
            subtitle={
              <Trans i18nKey="multiline">
                {t('account.add-an-offer.no-info.subtitle')}
              </Trans>
            }
          />
        )
    },
    {
      id: 'description',
      title: t('company.tabs.description'),
      count: company.description ? '1' : '0',
      tab: (
        <>
          {!isBusinessesUser || company.description ? (
            <Description company={company} />
          ) : (
            <NoInfo
              link={Route.addDescription}
              titleBtn={t('account.add-description.title')}
              title={t('account.description.no-info.title')}
              subtitle={t('account.description.no-info.subtitle')}
            />
          )}
        </>
      )
    },
    {
      id: 'vacancies',
      title: t('company.tabs.vacancies'),
      count: jobs.length,
      tab: (
        <>
          {!isBusinessesUser || jobs.length ? (
            <Vacancies companyId={company.id} />
          ) : (
            <NoInfo
              link={Route.companyAddingVacancy}
              titleBtn={t('company.add-job.title')}
              title={t('company.add-job.no-info.title')}
              subtitle={
                <Trans i18nKey="multiline">
                  {t('company.add-job.no-info.subtitle')}
                </Trans>
              }
            />
          )}
        </>
      )
    }
  ];

  const filteredTabs = tabs.filter((tab) => tab.count > 0);

  return (
    <Tab.Group>
      <Tab.List className={Style.TabList}>
        {(selectedCompanyId !== company.id ? filteredTabs : tabs).map((tab) => {
          return (
            <Tab as={Fragment} key={tab.id}>
              {({ selected }) => {
                return (
                  <button
                    className={[Style.Tab, selected && Style.TabSelected].join(
                      ' '
                    )}
                  >
                    {tab.count > 0 && <span>{tab.count}</span>}
                    {tab.title}
                  </button>
                );
              }}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        {(selectedCompanyId !== company.id ? filteredTabs : tabs).map((tab) => (
          <div key={tab.id + '_' + tab.count}>
            <Tab.Panel>{tab.tab}</Tab.Panel>
          </div>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default AccountTabs;
