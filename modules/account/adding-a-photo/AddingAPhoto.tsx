import { FC } from 'react';
import { Route, route } from '../../../config/route';
import { useTranslation } from 'react-i18next';
import { useCropImage } from '../../../hooks/useCropImage';
import { useService } from '../../../hooks/useService';
import { MeServiceProvider } from '../../me/me.service';
import { useRouter } from 'next/router';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import PageTitle from '../../../component/page-title/PageTitle';
import CropImage from '../../../component/crop-image/CropImage';
import Icon from '../../../component/icon/Icon';
import Style from './AddingAPhoto.module.scss';

const AddingAPhoto: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const MeService = useService(MeServiceProvider);
  const breadcrumbs = [
    { route: route(Route.account).link(), title: route(Route.account).title },
    { route: '/', title: t('account.adding-a-photo') }
  ];
  const addCropPhoto = useCropImage(320, 320);
  const addPhoto = async () => {
    const imageBlob: any = await new Promise((resolve) =>
      addCropPhoto.cropImage()?.toBlob(resolve, 'image/png')
    );

    const formData = new FormData();
    formData.append('Photo', imageBlob, 'image.png');
    MeService.setPhoto(formData);

    router.push(route(Route.account).link());
  };
  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent>
        <PageTitle title={t('account.adding-a-photo')}>
          {addCropPhoto.imageSrc ? (
            <>
              <button
                className="reload-photo-button"
                onClick={() => addCropPhoto.setImageSrc(null)}
              >
                <Icon id="reload-button" width={16} height={16} />
              </button>
              <button className="add-photo-button" onClick={addPhoto}>
                <span>{t('account.add-photo-button')}</span>
                <Icon id="a-right" width={13} height={20} />
              </button>
            </>
          ) : null}
        </PageTitle>
        <div className="page-content">
          <CropImage classes={Style.cropImageWrapper} {...addCropPhoto} />
        </div>
      </AppContent>
      <AppSide type="right" />
    </>
  );
};

export default AddingAPhoto;
