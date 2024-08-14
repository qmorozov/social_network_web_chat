import { useCallback, useRef, useState, ChangeEvent, useEffect } from 'react';
import { Crop } from 'react-image-crop';

export const useCropImage = (
  width: number,
  height: number,
  minWidth = 250,
  minHeight = 250
) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 130,
    y: 36,
    width: width < minWidth ? minWidth : width,
    height: height < minHeight ? minHeight : height
  });

  useEffect(() => {
    const clientWidth = Number(imgRef?.current?.clientWidth);
    const clientHeight = Number(imgRef?.current?.clientHeight);

    if (height > clientHeight) {
      setCrop((prev) => ({
        ...prev,
        width: minWidth,
        height: minHeight,
        x: clientWidth / 2 - minWidth / 2,
        y: clientHeight / 2 - minHeight / 2
      }));
    } else {
      setCrop((prev) => ({
        ...prev,
        x: clientWidth / 2 - width / 2,
        y: clientHeight / 2 - height / 2
      }));
    }
  }, [imgRef?.current?.clientWidth]);

  const [image, setImage] = useState<HTMLImageElement>();
  const [imageSrc, setImageSrc] = useState<any>();
  const [nameFile, setNameFile] = useState('');

  const [file, setFile] = useState<any>();
  const onSelectFile = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      setNameFile(evt.target.files[0].name.replace(' ', ''));
      reader.addEventListener('load', () => setImageSrc(reader.result));
      setFile(evt.target.files[0]);
    }
  };

  const onLoad = useCallback((evt: any) => setImage(evt.target), []);

  const cropImage = () => {
    if (!image) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return canvas;
  };

  return {
    file,
    crop,
    imgRef,
    onLoad,
    setCrop,
    imageSrc,
    nameFile,
    minWidth,
    minHeight,
    cropImage,
    setImageSrc,
    onSelectFile
  };
};
