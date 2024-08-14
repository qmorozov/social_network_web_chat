import Link from 'next/link';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { IOffer } from '../../modules/company/dto/company';
import Style from './CompanyOffer.module.scss';
import { useTranslation } from 'react-i18next';
import Icon from '../icon/Icon';
import { Route, route } from '../../config/route';
import Slider from '../slider/Slider';
import OpenChat from '../../modules/company/components/open-chat/OpenChat';
import { useRouter } from 'next/router';
import { BusinessApi } from '../../modules/company/company.api';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDropDown } from '../../hooks/useDropDown';
import ShareModal, { ShareData } from '../share-modal/ShareModal';

interface ICompanyOffer {
  offer: IOffer;
  isInPopup?: boolean;
  companyId?: string;
  chatId?: string | null;
  outline?: boolean;
}

const CompanyOffer: FC<ICompanyOffer> = ({
  offer,
  companyId,
  chatId,
  isInPopup = false,
  outline = false
}: ICompanyOffer) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [shareData, setShareData] = useState<ShareData>({ title: '', url: '' });
  const sliderWrapper = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const { signed, user } = useTypedSelector((state) => state.user);

  const router = useRouter();

  const isMessagesPage = router.pathname === `/${Route.messages}`;

  useEffect(() => {
    if (sliderWrapper.current) {
      setSliderWidth(sliderWrapper.current.offsetWidth);
    }
  }, []);

  const [isLiked, setIsLiked] = useState(offer.isLiked);
  const [offerLikes, setOfferLikes] = useState(offer.likes);

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

  const { open, close, opened } = useDropDown();

  useEffect(() => {
    setLocation(window.location.href);
  }, [router]);

  useEffect(() => {
    const shareInfo = {
      title: offer.description,
      url: `${window.location.origin}${route(Route.offer).link()}/${
        offer.id
      }?businessId=${companyId}`
    };

    setShareData(shareInfo);
  }, []);

  const userBusinessesIds =
    (user?.businesses && user?.businesses.map((b) => b.id)) || [];

  return (
    <div className={[Style.Offer, outline ? Style.Outline : ''].join(' ')}>
      {offer.attachments.length ? (
        <div className={Style.Attachment} ref={sliderWrapper}>
          <Slider images={offer.attachments} width={sliderWidth} />
        </div>
      ) : null}
      <Link
        href={{
          pathname: `${route(Route.offer).link()}/${offer.id}`,
          query: {
            businessId: companyId
          }
        }}
        className={Style.OfferPrice}
      >
        <>
          {offer.currency.symbol || offer.currency.code}
          {offer.price} {offer.unit.name}
        </>
      </Link>
      <div
        onClick={() => {
          router.push({
            pathname: `${route(Route.offer).link()}/${offer.id}`,
            query: {
              businessId: companyId
            }
          });
        }}
        className={Style.OfferDescription}
      >
        {offer.description}
      </div>
      {isInPopup && companyId ? (
        <div className={Style.Footer}>
          <Link
            href={{
              pathname: `${route(Route.offer).link()}/${offer.id}`,
              query: {
                businessId: companyId
              }
            }}
          >
            {t('popup.readFullDescription')}
          </Link>

          <div className={Style.OfferActions}>
            <div className={Style.LikesAndShare}>
              <div
                className={Style.LikesCount}
                onClick={() => {
                  if (signed) {
                    isLiked ? unlikeOffer(offer.id) : likeOffer(offer.id);
                  }
                }}
              >
                {isLiked ? (
                  <div>
                    <Icon id="unheart" height={16} width={18} />
                  </div>
                ) : (
                  <div>
                    <Icon id="heart" height={16} width={18} />
                  </div>
                )}
                <span>{offerLikes > 0 ? offerLikes : ''}</span>
              </div>
              <div
                className={Style.Share}
                onClick={() => (opened ? close() : open())}
              >
                <Icon id="share" width={19} height={18} />
              </div>
              {opened && (
                <ShareModal
                  isActive={opened}
                  close={close}
                  shareData={shareData}
                />
              )}
            </div>
            {![...userBusinessesIds, user?.id].includes(companyId) &&
              signed &&
              !isMessagesPage && (
                <OpenChat
                  classes={Style.OpenChat}
                  companyId={companyId}
                  chatId={chatId}
                  callback={() => {
                    router.push(`${route(Route.messages).link()}`);
                  }}
                >
                  <Icon id="chat" height={16} width={16} />
                  <span>{t('company.chat')}</span>
                </OpenChat>
              )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CompanyOffer;
