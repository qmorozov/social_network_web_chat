import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    message: '',
    isLoading: false
  });

  const handleToast = (
    message: string,
    isLoading: boolean,
    timeout: number
  ) => {
    setToast({
      message,
      isLoading
    });

    setTimeout(() => {
      setToast({
        ...toast,
        isLoading: false
      });
    }, timeout);
  };

  return { toast, handleToast };
};
