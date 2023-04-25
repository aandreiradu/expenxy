import React, { useCallback } from 'react';
import Overlay from '../Overlay';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ModalArgs {
  message?: string;
  title?: string;
  hasConfirm: boolean;
  onConfirm: () => void;
  onConfirmText?: string;
  show: boolean;
  linkUrl?: string;
  onClose: () => void;
  onCloseText?: string;
  isLoading?: boolean;
}

const Modal = ({
  hasConfirm,
  onConfirm,
  linkUrl,
  message,
  title,
  show,
  onClose,
  onCloseText,
  onConfirmText,
  isLoading,
}: ModalArgs) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {title || ''}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message || ''}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {hasConfirm && (
                    <button
                      disabled={isLoading}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onConfirm()}
                    >
                      {onConfirmText || 'Confirm'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => (hasConfirm ? onClose() : onConfirm())}
                  >
                    {onCloseText || 'Close'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
