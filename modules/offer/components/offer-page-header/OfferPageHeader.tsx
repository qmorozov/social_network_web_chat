import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import Avatar from '../../../../component/avatar/Avatar';
import Icon from '../../../../component/icon/Icon';
import ShareModal from '../../../../component/share-modal/ShareModal';
import { Route, route } from '../../../../config/route';
import { useDropDown } from '../../../../hooks/useDropDown';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { UserDTO } from '../../../auth/dto/user';
import { ProfileType } from '../../../chat/models/Sender';
import { BusinessApi } from '../../../company/company.api';
import { CompanyDTO, IOffer } from '../../../company/dto/company';
import Style from './OfferPageHeader.module.scss';
import PageTitle from '../../../../component/page-title/PageTitle';

interface IOfferPageHeader {
  company: CompanyDTO | UserDTO;
  offer: IOffer;
}

const OfferPageHeader: FC<IOfferPageHeader> = ({
  company,
  offer
}: IOfferPageHeader) => {
  const avatarOptions = {
    url: company?.photoFileName,
    background:
      (company as CompanyDTO)?.avatarFillColor ||
      (company as UserDTO)?.defaultAvatarBackground,
    name: company?.name,
    type: ProfileType.business
  };

  const { signed, user } = useTypedSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(offer.isLiked);
  const [offerLikes, setOfferLikes] = useState(offer.likes);
  const router = useRouter();
  const [windowLocation, setWindowLocation] = useState('');

  useEffect(() => {
    setWindowLocation(window.location.href);
  }, []);

  const shareData = {
    title: offer.description,
    url: windowLocation
  };

  const { open, close, opened } = useDropDown();

  const likeOffer = async (id: string) => {
    await BusinessApi.likeOffer(id).then((res) => {
      setIsLiked(true);
      setOfferLikes((prev) => prev + 1);
    });
  };
  const unlikeOffer = async (id: string) => {
    await BusinessApi.unlikeOffer(id).then((res) => {
      setIsLiked(false);
      setOfferLikes((prev) => prev - 1);
    });
  };

  return (
    <>
      <PageTitle
        classes={Style.Offer}
        title={
          <>
            <div className={Style.Back}>
              <div className={Style.BackArrow} onClick={() => router.back()}>
                <Icon id="a-back" width={16} height={16} />
              </div>
            </div>
            <a
              className={Style.OfferAccount}
              href={
                user?.id !== company.id
                  ? `${route(Route.company).link()}/${company.id}`
                  : `${route(Route.account).link()}`
              }
            >
              <>
                <div className={Style.Avatar}>
                  <Avatar options={avatarOptions} />
                </div>
                <p className={Style.CompanyName}>{company.name}</p>
              </>
            </a>
          </>
        }
      >
        {offerLikes ? (
          <span
            onClick={() => {
              if (signed) {
                unlikeOffer(offer.id);
              }
            }}
          >
            <Icon id="unheart" height={16} width={18} />
          </span>
        ) : (
          <span
            onClick={() => {
              if (signed) {
                likeOffer(offer.id);
              }
            }}
          >
            <Icon id="heart" height={16} width={18} />
          </span>
        )}
        {signed && (
          <span
            onClick={() => {
              opened ? close() : open();
            }}
          >
            <Icon id="share" width={16} height={16} />
          </span>
        )}
      </PageTitle>
      {opened && (
        <ShareModal isActive={opened} close={close} shareData={shareData} />
      )}
    </>
  );
};

export default OfferPageHeader;
