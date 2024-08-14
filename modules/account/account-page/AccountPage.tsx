import { useTypedSelector } from '../../../hooks/useTypedSelector';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import PageHeader from '../components/page-header/PageHeader';
import AddPhoto from '../components/add-photo/AddPhoto';
import UserInfo from '../components/user-info/UserInfo';
import UserInfoTabs from '../components/tabs/Tabs';
import Company from '../../company/company';

const AccountPage = () => {
  const { user, selectedCompany } = useTypedSelector((state) => state.user);

  return (
    <>
      <AppSide type="left" className="-ls" />
      <AppContent padding="wide">
        {selectedCompany ? (
          <Company
            company={user?.businesses?.find(
              (business) => business.id === selectedCompany
            )}
            clickLike={() => {}}
          />
        ) : (
          <>
            <PageHeader />
            <div className="page-content-size">
              <AddPhoto />
              <UserInfo />
              <UserInfoTabs accountId={user!.id} />
            </div>
          </>
        )}
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default AccountPage;
