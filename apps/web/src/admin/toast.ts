export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export type AdminToast = {
  message: string;
  tone: ToastTone;
};

export type Notify = (message: string, tone: ToastTone) => void;
