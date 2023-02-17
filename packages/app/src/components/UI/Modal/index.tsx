import React, { useCallback } from 'react';
import Overlay from '../Overlay';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ModalArgs {
  message?: string;
  title?: string;
  onConfirm: (arg: boolean) => void;
  show: boolean;
  linkUrl?: string;
}

const Modal = ({ onConfirm, linkUrl, message, title, show }: ModalArgs) => {
  // const confirmHandler = useCallback(() => {
  //   onConfirm(false);
  // }, []);

  return (
    // <div className="fixed flex items-center justify-center w-full h-screen bg-black/75 z-50">
    //   <div className="z-[100] fixed top-[30vh] w-[30rem] shadow-modal bg-[#242832] py-5 pb-5 text-white max-w-sm rounded-lg animate-openScale">
    //     <Overlay />
    //     <span
    //       className={'flex items-center justify-end text-2xl cursor-pointer'}
    //       onClick={confirmHandler}
    //     >
    //       &times;
    //     </span>
    //     <h2 className="mt-5 text-xl">{title || ''}</h2>
    //     <p className="text-sm">
    //       {message || 'Something went wrong, please try again later!'}
    //     </p>
    //     <button
    //       className="bg-[#26303B] w-full p-2 text-sm font-bold uppercase mt-6 cursor-pointer rounded-[99px] hover:bg-[#26303B]"
    //       onClick={confirmHandler}
    //     >
    //       Close
    //     </button>
    //   </div>
    // </div>

    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => onConfirm(false)}
      >
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title || ''}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message || ''}</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => onConfirm(false)}
                  >
                    Close
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
