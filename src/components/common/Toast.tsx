import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Toast as ToastType } from '../../types/toast';
import { useToast } from '../../context/ToastContext';

interface ToastProps {
  toast: ToastType;
}

const getToastStyles = (type: ToastType['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        icon: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />,
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500" />,
      };
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: <ExclamationCircleIcon className="w-5 h-5 text-amber-500" />,
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
      };
  }
};

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const styles = getToastStyles(toast.type);

  return (
    <div
      className={`
        flex items-center p-4 mb-4 rounded-lg border
        ${styles.bg} ${styles.border} ${styles.text}
        animate-slide-in
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {styles.icon}
      </div>
      <div className="flex-1 mr-2">
        {toast.message}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}; 