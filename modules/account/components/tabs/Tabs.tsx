import { Fragment, useState, useEffect, FC } from 'react';
import { Tab } from '@headlessui/react';
import { Trans, useTranslation } from 'react-i18next';
import { BusinessApi } from '../../../company/company.api';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Route } from '../../../../config/route';
import { useService } from '../../../../hooks/useService';
import { Account } from '../../account.service';
import NoInfo from '../noInfo/NoInfo';
import Resumes from '../resumes/Resumes';
import Loader from '../../../../component/loader/Loader';
import Offers from '../../../company/components/company-tabs/Offers';

import Style from './Tabs.module.scss';

interface IUserInfoTabs {
  accountId: string;
}

const UserInfoTabs: FC<IUserInfoTabs> = ({ accountId }) => {
  const { t } = useTranslation();

  const [offers, setOffers] = useState<any>([]);
  const [isOffersLoading, setIsOffersLoading] = useState(true);

  const user: any = useTypedSelector(({ user }) => user?.user);
  const resume: any = useTypedSelector(({ resume }) => resume.resume);
  const Resume = useService(Account);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getOffersFromAPI = async () => {
      setLoader(true);
      await BusinessApi.getCompanyOffers(null, accountId || user.id).then(
        (res) => {
          setOffers(res);
          setIsOffersLoading(false);
        }
      );
    };

    const getResumeFromAPI = async () => {
      await Resume.getResume(accountId || user.id).then(() => {
        setIsOffersLoading(false);
      });
    };

    Promise.all([getOffersFromAPI(), getResumeFromAPI()]).finally(() => {
      setLoader(false);
    });
  }, [accountId]);

  const tabs = [
    {
      id: 'offers',
      title: t('company.tabs.offers'),
      count: offers.length > 0 ? offers.length : null,
      tab: (
        <>
          {offers.length ? (
            <Offers
              offers={offers}
              loading={isOffersLoading}
              company={{
                companyId: user.id,
                chatId: user.chatixId
              }}
            />
          ) : (
            accountId && (
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
          )}
        </>
      )
    },
    {
      id: 'resumes',
      title: t('account.tabs.resumes'),
      count: resume ? 1 : null,
      tab: resume ? (
        <Resumes resume={resume} userId={accountId || user.id} />
      ) : (
        accountId && (
          <NoInfo
            link={Route.addCV}
            titleBtn={t('resume.no-info.titleBtn')}
            title={
              <Trans i18nKey="multiline">{t('resume.no-info.title')}</Trans>
            }
            subtitle={
              <Trans i18nKey="multiline">{t('resume.no-info.subtitle')}</Trans>
            }
          />
        )
      )
    }
  ];

  const userId = useTypedSelector(({ user }) => user.user?.id);

  const filteredTabs = tabs.filter((tab) => tab.count > 0);

  return (
    <div className={Style.Wrapper}>
      <Tab.Group>
        <Tab.List className={Style.TabList}>
          <>
            {(userId !== accountId ? filteredTabs : tabs).map(
              ({ title, count }) => {
                return (
                  <Tab as={Fragment} key={title}>
                    {({ selected }) => {
                      return (
                        <button
                          className={[
                            Style.Tab,
                            selected && Style.TabSelected
                          ].join(' ')}
                        >
                          {count > 0 && <span>{count}</span>}
                          {t(title)}
                        </button>
                      );
                    }}
                  </Tab>
                );
              }
            )}
          </>
        </Tab.List>
        <Tab.Panels style={{ position: 'relative' }}>
          {loader ? (
            <Loader />
          ) : (
            (userId !== accountId ? filteredTabs : tabs).map((t) => (
              <div key={t.id + '_' + t.count}>
                <Tab.Panel>{t.tab}</Tab.Panel>
              </div>
            ))
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default UserInfoTabs;
