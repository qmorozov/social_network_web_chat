import {
  FC,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Style from '../../styles/chat.module.scss';
import Icon from '../../../../component/icon/Icon';
import { useService } from '../../../../hooks/useService';
import { ChatServiceProvider } from '../../chat.service';
import FileSelect from '../../../../component/file-select/FileSelect';
import { useFileSelect } from '../../../../component/file-select/useFileSelectHook';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

interface IMessageInput {
  link?: string;
  setIsFirstMessage?: (b: boolean) => void;
  getChatList: (date?: string, takeBefore?: boolean) => void;
}

const ChatMessageInput: FC<IMessageInput> = ({
  link,
  setIsFirstMessage,
  getChatList
}: IMessageInput) => {
  const ChatService = useService(ChatServiceProvider);
  const activeChat = useTypedSelector((state) => state.activeChat);

  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const fileSelect = useFileSelect();
  const [valueText, setValueText] = useState<string | null>(null);

  const { date, takeBefore } = useTypedSelector((state) => state.chats);

  const textareaInputHandler = () => {
    if (textarea.current) {
      textarea.current.style.height = '32px';
      textarea.current.style.height = `${Math.min(
        textarea.current.scrollHeight,
        160
      )}px`;
    }
  };

  const textareaKeyUpHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key || '').toLowerCase() === 'enter' && e.ctrlKey) {
      return sendMessage();
    }
  };

  const sendMessage = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    link && setIsFirstMessage && setIsFirstMessage(false);

    console.log(fileSelect.selected);

    const text: string | null = link
      ? `${link} ${textarea?.current?.value}`
      : textarea?.current?.value || null;

    await ChatService.sendMessage(
      activeChat.info!.chatixChatroomId!,
      text,
      fileSelect.selected,
      activeChat?.replyMessageInfo?.message?.uuid
    ).then(() => {
      ChatService.scrollChatToEnd();
    });

    await ChatService.setReplyMessageInfo({});

    if (textarea?.current) {
      textarea.current.value = '';
      textareaInputHandler();
      fileSelect.setSelected([]);
      setValueText(null);
    }

    getChatList(date, takeBefore);

    ChatService.loadChatHistory(activeChat?.info!.chatixChatroomId).then(() => {
      ChatService.scrollChatToEnd();
    });
  };

  const start = () => {
    Mp3Recorder.start();
  };

  const stop = () => {
    if (fileSelect.selected.length) return;
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]: any) => {
        const audioFile = new File([blob], 'voice.mp3', {
          type: 'audio/mp3'
        });
        fileSelect.setSelected([audioFile]);
      });
  };

  const isVoice = useMemo(() => {
    const voice = fileSelect.selected.some((el) => {
      return el.type === 'audio/mp3';
    });
    const fileSelectVoice = fileSelect.selected.length && Boolean(!voice);

    return fileSelectVoice || valueText;
  }, [fileSelect.selected, valueText]);

  const changeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueText(e.target.value);
  };

  useEffect(() => {
    if (Object.keys(activeChat.replyMessageInfo).length > 0) {
      textarea.current?.focus();
    }
  }, [activeChat.replyMessageInfo]);

  return (
    <div className={`${Style.ChatSendMessageInputWrapper}`}>
      <div className="page-content-size">
        <form className={Style.ChatSendMessageInput} onSubmit={sendMessage}>
          <FileSelect handler={fileSelect}>
            <button type="button">
              <Icon id="attach" width={20} height={20} />
            </button>
          </FileSelect>

          <textarea
            ref={textarea}
            onInput={textareaInputHandler}
            onKeyUp={textareaKeyUpHandler}
            className={Style.InputArea}
            placeholder={
              Object.keys(activeChat.replyMessageInfo).length > 0
                ? 'Reply message...'
                : 'Message...'
            }
            onChange={changeTextarea}
          ></textarea>
          {isVoice ? (
            <>
              {Object.keys(activeChat.replyMessageInfo).length > 0 ? (
                <button type="submit">
                  <Icon id="reply" width={20} height={20} />
                </button>
              ) : (
                <button type="submit">
                  <Icon id="send" width={20} height={20} />
                </button>
              )}
            </>
          ) : (
            <button type="submit" onMouseDown={start} onMouseUp={stop}>
              <Icon id="microphone" width={20} height={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatMessageInput;
