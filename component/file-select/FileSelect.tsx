import { ChangeEvent, FC, ReactNode, useRef } from 'react';
import { FileSelectHandler } from './useFileSelectHook';

interface IFileSelect {
  children: ReactNode;
  handler: FileSelectHandler;
}

const FileSelect: FC<IFileSelect> = ({ children, handler }) => {
  const input = useRef<HTMLInputElement>(null);

  const changeHandler = (e: ChangeEvent) => {
    handler.setSelected(
      Array.from((e.target as HTMLInputElement)?.files || []) as File[]
    );
    if (input.current) {
      input.current.value = '';
    }
  };

  return (
    <label className="file-upload">
      <input
        ref={input}
        type="file"
        multiple={true}
        id="mediaFiles"
        onChange={(e) => changeHandler(e)}
      />
      {children}
    </label>
  );
};

export default FileSelect;
