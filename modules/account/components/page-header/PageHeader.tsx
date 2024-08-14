import { useRouter } from 'next/router';
import { route, Route } from '../../../../config/route';
import PageTitle from '../../../../component/page-title/PageTitle';
import ChangeAccModal from '../../../../component/change-acc-modal/ChangeAccModal';
import Icon from '../../../../component/icon/Icon';

import Style from './PageHeader.module.scss';

const PageHeader = () => {
  const { push } = useRouter();
  const clickEdit = () => {
    push(route(Route.addDescription).link());
  };

  return (
    <PageTitle title={<ChangeAccModal />}>
      <div className={Style.ActionBtn}>
        <span className={Style.ActionBtnEdit} onClick={clickEdit}>
          <Icon id="edit" width={16} height={16} />
        </span>
        {/*<UserMenuModal />*/}
      </div>
    </PageTitle>
  );
};

export default PageHeader;
