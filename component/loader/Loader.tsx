import { FC } from 'react';

interface ILoader {
  relative?: boolean;
  classes?: string;
}

const Loader: FC<ILoader> = ({ relative = false, classes }) => {
  return (
    <div
      style={{ position: relative ? 'relative' : 'absolute' }}
      className={`loader ${classes ? classes : ''}`}
    >
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
