import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = (severity, detail, life = 7000) => {
    toastRef.current?.show({ severity, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
