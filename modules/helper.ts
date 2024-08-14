import { LocaleService } from '../services/locale';
import { parseJSON } from 'date-fns';
import { ChatItem } from './chat/models/ChatItem';

export const FindUrlIntoText = (text: string) => {
  return text.replace(
    /(https?:\/\/\S+)/g,
    (url) => '<a href="' + url + '" target="_blank">' + url + '</a>'
  );
};

export const getFileExtensions = (url: string) => {
  return url.substr(url.lastIndexOf('.') + 1);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const IsJsonString = (str: string): boolean => {
  let parsed;
  try {
    parsed = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return parsed !== undefined;
};

export const formatChatDate = (chat: ChatItem) => {
  return LocaleService.toTime(
    chat.lastMessageSentAt ? parseJSON(chat.lastMessageSentAt) : new Date()
  );
};

export const parseMessagePreview = (messageContent: string) => {
  if (IsJsonString(messageContent)) {
    const messageObj = JSON.parse(messageContent.replace('\\', ''));

    if (messageObj.content) return messageObj.content;
    if (messageObj.files && messageObj.files.length > 0)
      return 'chat.message-preview.file';
    if (messageObj.images && messageObj.images.length > 0)
      return 'chat.message-preview.image';
    if (messageObj.audio) return 'chat.message-preview.audio';
  }
  if (!IsJsonString(messageContent)) return messageContent;
};

export function removeDuplicates<I = any>(
  list: I[],
  byKey: keyof I = 'id' as keyof I
): I[] {
  return Array.from(
    new Map(list.map((i) => [i[byKey], i])).values()
  ) as unknown as I[];
}
