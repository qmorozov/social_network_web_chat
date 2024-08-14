import React, { FC, Fragment } from 'react';
import Icon from '../icon/Icon';
import Style from './Like.module.scss';

interface ILike {
  onClick: () => void;
  likesCount: number;
  isLiked: boolean;
  onlyLikesCount?: boolean;
}

const Like: FC<ILike> = ({ onClick, likesCount, isLiked, onlyLikesCount }) => {
  return (
    <Fragment>
      {onlyLikesCount ? (
        <div className={`${Style.LikeBlock} ${Style.onlyLikesCount}`}>
          <Icon id="heart" width={24} height={24} />
          {likesCount > 0 && likesCount}
        </div>
      ) : (
        <div onClick={onClick} className={Style.LikeBlock}>
          {isLiked ? (
            <Icon id="unheart" width={24} height={24} />
          ) : (
            <Icon id="heart" width={24} height={24} />
          )}
          {likesCount > 0 && likesCount}
        </div>
      )}
    </Fragment>
  );
};

export default Like;
