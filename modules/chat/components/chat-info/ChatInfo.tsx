import { FC, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Sender } from '../../models/Sender';
import AccountInfo, {
  AccountInfoType
} from '../../../../component/account-info/AccountInfo';
import { BusinessApi } from '../../../company/company.api';
import { useTranslation } from 'react-i18next';
import { ChatApi } from '../../chat.api';
import { CompanyLikeProvider } from '../../../company/services/company-like.service';
import { useService } from '../../../../hooks/useService';
import Avatar from '../../../../component/avatar/Avatar';
import Icon from '../../../../component/icon/Icon';

import Style from '../../../../styles/page/Messages.module.scss';

interface IChatInfo {
  member: Sender | null;
  setMember: (member: null) => void;
}

const ChatInfo: FC<IChatInfo> = ({ member, setMember }) => {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(0);
  const CompanyLike = useService(CompanyLikeProvider);
  const [accountInfo, setAccountInfo] = useState<any>(member);
  const activeChat = useTypedSelector((state) => state.activeChat);

  const handleLikes = async () => {
    if (accountInfo) {
      await CompanyLike.postLikeBusiness(accountInfo?.id, accountInfo?.isLiked);
      setLikes((prev) => (accountInfo?.isLiked ? prev - 1 : prev + 1));
    }
  };

  const getUserInfo = async () => {
    try {
      const partnerType = activeChat?.info?.partnerType;
      const partnerId = activeChat?.info?.partnerId as string;

      if (partnerType === 1) {
        const companyInfo = await BusinessApi.getCompanyById(partnerId);
        setLikes(companyInfo.likesCount);
        setAccountInfo(companyInfo);
      }

      if (partnerType === 0) {
        const userInfo = await ChatApi.GetUser(partnerId);
        setLikes(userInfo.likesCount);
        setAccountInfo(userInfo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeChat) {
      getUserInfo();
    }
  }, [activeChat, likes]);

  const avatarOptions = {
    url: accountInfo?.photoFileName,
    showOnlineStatus: true,
    background:
      activeChat?.info?.partnerType === 1
        ? accountInfo?.avatarFillColor
        : accountInfo?.defaultAvatarBackground,
    isOnline: accountInfo?.isOnline,
    type: activeChat?.info?.partnerType,
    name: accountInfo?.name
  };

  if (!accountInfo) {
    return <></>;
  }

  return (
    <>
      {activeChat.members && activeChat.members?.length > 1 && (
        <div className={Style.Back}>
          <button className={Style.BackArrow} onClick={() => setMember(null)}>
            <Icon id="a-back" width={16} height={16} />
          </button>
          <span>{t('back')}</span>
        </div>
      )}

      <AccountInfo
        avatar={
          <div className={Style.ChatProfileAvatarWrapper}>
            <div className={Style.ChatProfileAvatar}>
              <Avatar options={avatarOptions} />
            </div>
          </div>
        }
        showChatButton={activeChat?.members && activeChat?.members?.length > 1}
        clickSubscribe={getUserInfo}
        account={accountInfo}
        clickLike={handleLikes}
        type={
          activeChat?.info?.partnerType === 1
            ? AccountInfoType.company
            : AccountInfoType.user
        }
      />
    </>
  );
};

export default ChatInfo;
