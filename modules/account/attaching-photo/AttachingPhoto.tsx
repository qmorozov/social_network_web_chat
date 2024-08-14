import { FC, useState } from 'react';
import { Account } from '../account.service';
import { Route, route } from '../../../config/route';
import { useTranslation } from 'react-i18next';
import { useService } from '../../../hooks/useService';
import { useRouter } from 'next/router';
import AppSide from '../../../component/app-side/AppSide';
import AppContent from '../../../component/app-content/AppContent';
import Breadcrumbs from '../../../component/breadcrumbs/Breadcrumbs';
import PageTitle from '../../../component/page-title/PageTitle';
import Icon from '../../../component/icon/Icon';

import Style from './AttachingPhoto.module.scss';
import { useCropImage } from '../../../hooks/useCropImage';
import CropImage from '../../../component/crop-image/CropImage';

const AttachingPhotoPage: FC = () => {
  const { t } = useTranslation();
  const { push } = useRouter();

  const breadcrumbs = [
    { route: route(Route.account).link(), title: route(Route.account).title },
    { route: route(Route.addOffer).link(), title: t('account.add-offer') },
    { route: '/', title: t('account.add-an-offer.attaching-a-photo') }
  ];
  const AddAttachment = useService(Account);

  const addCropPhoto = useCropImage(250, 250);

  const addPhoto = async () => {
    const imageBlob: any = await new Promise((resolve) =>
      addCropPhoto.cropImage()?.toBlob(resolve, 'image/png')
    );

    const formData = new FormData();
    formData.append('Attachment', imageBlob, 'image.png');
    AddAttachment.addOfferAttachment(formData);
    push(route(Route.addOffer).link());
  };

  return (
    <>
      <AppSide type="left" className="-ls">
        <Breadcrumbs crumbs={breadcrumbs} />
      </AppSide>
      <AppContent>
        <PageTitle title={t('account.add-an-offer.attach-a-photo')}>
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

export default AttachingPhotoPage;
