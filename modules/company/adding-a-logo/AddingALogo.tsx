import React, { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, route } from '../../../config/route';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useCropImage } from '../../../hooks/useCropImage';
import { useRouter } from 'next/router';
import { useService } from '../../../hooks/useService';
import { CompanyProvider } from '../services/company.service';
import AppSide from '../../../component/app-side/AppSide';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import AppContent from '../../../component/app-content/AppContent';
import PageTitle from '../../../component/page-title/PageTitle';
import CropImage from '../../../component/crop-image/CropImage';
import Icon from '../../../component/icon/Icon';
import Style from './AddingALogo.module.scss';

const AddingALogo: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const CompanyService = useService(CompanyProvider);
  const [companyName, setCompanyName] = useState<string>();
  const businesses = useTypedSelector(({ user }) => user.user?.businesses);
  const selectedCompanyId = useTypedSelector(
    ({ user }) => user.selectedCompany
  );
  const breadcrumbs = [
    {
      route: `${route(Route.company).link()}/${selectedCompanyId}`,
      title: companyName
    },
    { route: '/', title: t('company.addingALogoPageTitle') }
  ];
  useEffect(() => {
    businesses!.map((business) => {
      business.id === selectedCompanyId && setCompanyName(business.name);
    });
  }, [selectedCompanyId]);
  const addCropLogo = useCropImage(320, 320);
  const addLogo = async () => {
    const imageBlob: any = await new Promise((resolve) =>
      addCropLogo.cropImage()?.toBlob(resolve, 'image/png')
    );

    const formData = new FormData();
    formData.append('Photo', imageBlob, 'image.png');
    CompanyService.setPhoto(formData, selectedCompanyId!);

    router.push(`${route(Route.company).link()}/${selectedCompanyId}`);
  };
  return (
    <Fragment>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent padding="wide">
        <PageTitle title={t('company.addingALogoPageTitle')}>
          {addCropLogo.imageSrc ? (
            <Fragment>
              <button
                className="reload-photo-button"
                onClick={() => addCropLogo.setImageSrc(null)}
              >
                <Icon id="reload-button" width={16} height={16} />
              </button>
              <button className="add-photo-button" onClick={addLogo}>
                <span>{t('account.add-photo-button')}</span>
                <Icon id="a-right" width={13} height={20} />
              </button>
            </Fragment>
          ) : null}
        </PageTitle>
        <div className="page-content">
          <CropImage classes={Style.cropImageWrapper} {...addCropLogo} />
        </div>
      </AppContent>
      <AppSide type="right" />
    </Fragment>
  );
};

export default AddingALogo;
