import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab } from '@headlessui/react';
import Icon from '../../../../component/icon/Icon';
import { IconId } from '../../../../component/icon/_icons.type';
import Style from './TabsSearch.module.scss';

export interface ITab {
  title: string;
  src: IconId;
  iconWidth?: number;
  iconHeight?: number;
}

export interface IPanels {
  id: string;
  content: () => JSX.Element;
}

interface ITabsSearch {
  tabsOptions: ITab[];
  panels: IPanels[];
}

const TabsSearch: FC<ITabsSearch> = ({ tabsOptions, panels }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Tab.Group>
        <Tab.List className={Style.TabList}>
          <>
            {tabsOptions.map(({ title, src, iconWidth, iconHeight }: ITab) => {
              return (
                <Tab as={Fragment} key={title}>
                  {({ selected }) => {
                    return (
                      <button
                        className={[
                          Style.Tab,
                          selected && Style.TabSelected
                        ].join(' ')}
                      >
                        <Icon id={src} width={iconWidth} height={iconHeight} />
                        <span>{t(title)}</span>
                      </button>
                    );
                  }}
                </Tab>
              );
            })}
          </>
        </Tab.List>
        <Tab.Panels>
          {panels.map((panel) => {
            return <Tab.Panel key={panel.id}>{panel.content}</Tab.Panel>;
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TabsSearch;
