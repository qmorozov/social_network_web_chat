import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { BusinessApi } from '../../modules/company/company.api';
import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/main';
import { AppData } from '../../services/app';
import OfferContent from '../../modules/offer/OfferPage';
import Loader from '../../component/loader/Loader';

interface OfferPageProps {
  offerData: any;
  companyData: any;
}

const OfferPage: NextPage<OfferPageProps> = ({
  offerData,
  companyData
}: any) => {
  const router = useRouter();
  const businessId = router.query.businessId as string;
  const { user } = useTypedSelector((state) => state.user);
  const [offer, setOffer] = useState<any>(offerData);
  const [company, setCompany] = useState<any>(companyData);

  useEffect(() => {
    if (user?.id === businessId) {
      setCompany(user);
    }
  }, [user, businessId]);

  return (
    <MainLayout
      protectedRoute={false}
      title={company?.name as string}
      description={offer?.description}
      image={AppData.avatarUrlPath(offer?.attachments[0].url)}
    >
      {!offer || !company ? (
        <Loader />
      ) : (
        <OfferContent offer={offer} company={company} />
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const offerId = typeof context.query.id === 'string' ? context.query.id : '';
  const businessId = context.query.businessId as string;
  const { user } = context.req.cookies;

  let offerData;
  let companyData;

  if (user?.id === businessId) {
    offerData = await BusinessApi.GetUserOffer(offerId);
    companyData = user;
  } else {
    const offerInfo = await BusinessApi.GetOfferInfo(offerId);
    offerData = offerInfo;
    companyData = offerInfo.business;
  }

  return {
    props: {
      offerData,
      companyData
    }
  };
};

export default OfferPage;
