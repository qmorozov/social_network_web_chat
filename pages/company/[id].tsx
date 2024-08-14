import { useState, createContext } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import AppContent from '../../component/app-content/AppContent';
import AppSide from '../../component/app-side/AppSide';
import MainLayout from '../../layouts/main';
import Company from '../../modules/company/company';
import { BusinessApi } from '../../modules/company/company.api';
import { useRouter } from 'next/router';
import { CompanyDTO } from '../../modules/company/dto/company';
import { useService } from '../../hooks/useService';
import { CompanyLikeProvider } from '../../modules/company/services/company-like.service';
import PillButtonBack from '../../modules/chat/components/pill-button-back/PillButtonBack';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { AppData } from '../../services/app';
import Loader from '../../component/loader/Loader';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  const company = await BusinessApi.getCompanyById(id);

  return {
    props: {
      companyServer: company || null
    }
  };
};

export const CompanyContext: any = createContext({});

interface IAccount {
  companyServer: CompanyDTO;
}

const Account: NextPage<IAccount> = ({ companyServer }: IAccount) => {
  const [company, setCompany] = useState<CompanyDTO>(companyServer);

  const router = useRouter();

  const CompanyLike = useService(CompanyLikeProvider);
  const { signed } = useTypedSelector((state) => state.user);

  const getCompany = async () => {
    const response = await CompanyLike.getCompany(companyServer.id);
    setCompany(response);
  };
  const {
    searchInput,
    selectedCategoryGroupId,
    selectedCategoryId,
    companiesFilter
  } = useTypedSelector((state) => state.map);

  const isSearchResults =
    searchInput.length ||
    selectedCategoryGroupId ||
    selectedCategoryId ||
    companiesFilter;

  const clickLike = async () => {
    if (signed && company) {
      await CompanyLike.postLikeBusiness(company.id, company?.isLiked);
      getCompany();
    }
  };

  return (
    <MainLayout
      protectedRoute={false}
      title={company?.name}
      image={AppData.avatarUrlPath(company?.photoFileName)}
      description={company?.description as string}
    >
      <AppSide type="left" className="-ls">
        {!!isSearchResults && <PillButtonBack onClick={() => router.back()} />}
      </AppSide>
      <AppContent padding="wide">
        <div className="page-content-size">
          {company ? (
            <CompanyContext.Provider value={{ company, clickLike, getCompany }}>
              <Company company={company} clickLike={clickLike} />
            </CompanyContext.Provider>
          ) : (
            <Loader />
          )}
        </div>
      </AppContent>
      <AppSide type="right" />
    </MainLayout>
  );
};

export default Account;
