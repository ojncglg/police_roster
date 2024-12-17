import { Fragment, ReactNode, useEffect } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  preventClose?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  preventClose = false
}: ModalProps) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && !preventClose) {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        onClick={handleOverlayClick}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className={`
              ${sizeStyles[size]}
              w-full bg-white rounded-lg shadow-xl 
              transform transition-all
              animate-[modalEnter_0.3s_ease-out]
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                {title && (
                  <h3 className="text-lg font-medium text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && !preventClose && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-200">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-600">
        {message}
      </p>
    </Modal>
  );
};

export default Modal;
