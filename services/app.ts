export abstract class AppData {
  static avatarUrlPath(photoFileName: string | undefined | null) {
    return photoFileName
      ? `${process.env.NEXT_PUBLIC_STORAGE}${photoFileName}`
      : undefined;
  }

  static avatarUrlPathStyle(
    ...args: Parameters<typeof AppData['avatarUrlPath']>
  ): string {
    const a = AppData.avatarUrlPath(...args);
    return a ? `url('${a}')` : 'none';
  }
}
