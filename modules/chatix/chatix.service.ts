import { UserDTO } from '../auth/dto/user';
import { ChatixCore, ChatixCoreBuilder } from '@chatix/core-ts';
import { ChatixGlobalEvent } from './interface/events';
import { CompositeLinkAttachment } from '@chatix/core-ts/dist/esm/types';

export const ChatixService = new (class ChatService {
  idle = false;

  private chatix?: ChatixCore;

  protected supportedMediaTypes = [
    'video/mp4',
    'video/ogg',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mp3'
  ];

  get connected(): boolean {
    return !!this.chatix?.isConnected;
  }

  public async connect(user: UserDTO) {
    if (!this.idle && !this.connected) {
      this.idle = true;

      const builder = new ChatixCoreBuilder()
        .withWebsiteId(process.env.NEXT_PUBLIC_CHATIX_WEBSITE_ID!)
        .withVisitorId(user.chatixId);

      this.chatix = await builder.build();

      this.chatix.on(ChatixGlobalEvent.Start, () => (this.idle = false));

      this.chatix.on('dialog.message.new', (res: any) => {
        console.log('New message', res);
      });

      this.chatix.on(
        ChatixGlobalEvent.Disconnect,
        (res) => (this.idle = false)
      );

      return await this.chatix.start();
    }
  }

  public async GetWebChatInfo(id: string) {
    return this.connected ? this.chatix?.getWebChatInfo() : undefined;
  }

  public async GetHistory(
    chatRoomId: string,
    fromMessageId?: string,
    count?: number
  ) {
    return this.chatix?.getChatRoomMessages({
      chatRoomId,
      fromMessageId,
      count
    });
  }

  public async SendMessage(
    chatRoomId: string,
    text?: string | null,
    link?: CompositeLinkAttachment | null,
    files?: File[] | null,
    replyMessageId?: any | null,
    businessId: string | null = null
  ) {
    const audioFile = (files || []).find((f) => {
      return f.type === 'audio/mp3';
    });

    let resAudioFile;
    if (audioFile) {
      resAudioFile = this.chatix?.sendChatRoomVoiceCompositeMessage(
        audioFile,
        chatRoomId
      );
    }
    const otherFiles: File[] = [];
    const mediaFiles = (files || []).filter((f) => {
      if (!this.supportedMediaTypes.includes(f.type)) {
        otherFiles.push(f);
        return false;
      }
      return true;
    });

    if (text || link || files?.length || mediaFiles?.length || replyMessageId) {
      return this.chatix?.sendChatRoomCompositeMessage(
        {
          // audio: resAudioFile?.data,
          mediaFiles,
          files: otherFiles,
          text,
          link,
          replyMessageId
        },
        chatRoomId,
        businessId
      );
    }

    return Promise.reject();
  }

  public async readMessages(messageIds: string[], chatroomId: string) {
    return this.chatix?.readMessages(messageIds, chatroomId);
  }

  public async isOnline(visitorId: string): Promise<boolean> {
    return (await this.chatix?.isOnline(visitorId)) || false;
  }

  public async deleteMessagesForUser(messageId: string) {
    return this.chatix?.deleteMessagesForUser(messageId);
  }

  ForwardMessage(
    messageId: string,
    chatixChatroomId: string,
    businessId: string | null = null
  ) {
    return this.chatix
      ?.forwardMessage(messageId, chatixChatroomId, businessId)
      .then((res: any) => {
        console.warn('!!!!!', res);
      });
  }
})();
