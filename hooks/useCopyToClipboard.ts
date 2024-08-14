const isAUrl = (url: string) => {
  return new RegExp(
    '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
    'i'
  ).test(url);
};

export const useCopyToClipboard = (value: string) => {
  !isAUrl(value) && navigator.clipboard.writeText(value);

  if (isAUrl(value)) {
    const copyImage = (value: string) =>
      fetch(value)
        .then((res) => res.blob())
        .then(convertJPEGtoPNG)
        .then((blob: any) => {
          return navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ]);
        });

    const convertJPEGtoPNG = (blob: Blob) => {
      return new Promise((resolve) => {
        if (blob.type !== 'image/jpeg') resolve(blob);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx!.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        };
      });
    };
    copyImage(value);
  }
};
