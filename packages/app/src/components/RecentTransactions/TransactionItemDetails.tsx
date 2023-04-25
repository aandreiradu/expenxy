import { Trash, Pen, Check, Warning } from 'phosphor-react';
import { FC, useCallback, useEffect, useState } from 'react';
import ModalTransaction from '../UI/ModalTransaction';
import EditTransaction from '../EditTransaction';
import { useHttpRequest } from '../../hooks/useHttp';
import Modal from '../UI/Modal';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { useDispatch } from 'react-redux';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';
import { setLatestTransactions } from '../../store/User/index.slice';
import TopLevelNotification from '../UI/TopLevelNotification';

export type TransactionItemDetailsProps = {
  transactionId: string;
};

const TransactionItemDetails: FC<TransactionItemDetailsProps> = ({ transactionId }) => {
  const dispatch = useDispatch();
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const [confirmTransactionDelete, setConfirmTransactionDelete] = useState<boolean>(false);
  const { sendRequest, isLoading, error } = useHttpRequest();
  const [editTransactionShow, setEditTransactionShow] = useState(false);

  useEffect(() => {
    if (error) {
      const { message } = error;

      setTopLevelNotification({
        show: true,
        message: message || 'Someting went wrong, please try again later!',
        icon: <Warning className="w-14 h-8 text-red-700" />,
      });
    }
  }, [error]);

  const handleTransactionModal = useCallback((type: 'OPEN' | 'CLOSE') => {
    switch (type) {
      case 'OPEN': {
        return setEditTransactionShow(true);
      }

      case 'CLOSE': {
        return setEditTransactionShow(false);
      }
    }
  }, []);

  const handleDeleteTransactionModal = useCallback((type: 'OPEN' | 'CLOSE') => {
    switch (type) {
      case 'OPEN': {
        return setConfirmTransactionDelete(true);
      }

      case 'CLOSE': {
        return setConfirmTransactionDelete(false);
      }
    }
  }, []);

  const handleDeleteTransaction = useCallback(async (transactionId: string) => {
    const responseDelete = await sendRequest({
      method: 'POST',
      url: `/deleteTransaction/${transactionId}`,
      withCredentials: true,
    });
    if (responseDelete) {
      const { data, message, status } = responseDelete;
      if (
        message === statsAndMaps['deleteTransactionSuccess']?.message &&
        status === statsAndMaps['deleteTransactionSuccess']?.status
      ) {
        setTopLevelNotification({
          show: true,
          message: statsAndMaps['deleteTransactionSuccess']?.frontendMessage || 'test ma',
          icon: <Check className="w-14 h-8 text-green-400" />,
        });
        const timeout = setTimeout(() => {
          handleDeleteTransactionModal('CLOSE');
          dispatch(setLatestTransactions({ latestTransactions: data.latestTransactions }));
          clearTimeout(timeout);
        }, 2500);
      }
    }
  }, []);

  return (
    <>
      {topLevelNotification.show && (
        <TopLevelNotification
          hasCloseButton={false}
          dismissAfterXMs={error ? 10000 : 5500}
          message={topLevelNotification.message}
          show={topLevelNotification.show}
          onClose={() =>
            setTopLevelNotification({
              show: false,
              message: '',
              icon: <></>,
            })
          }
          icon={topLevelNotification.icon}
        />
      )}

      {editTransactionShow && (
        <ModalTransaction>
          <EditTransaction transactionId={transactionId} onClose={handleTransactionModal.bind(this, 'CLOSE')} />
        </ModalTransaction>
      )}
      {confirmTransactionDelete && (
        <Modal
          hasConfirm={true}
          onConfirm={handleDeleteTransaction.bind(this, transactionId)}
          onClose={handleDeleteTransactionModal.bind(this, 'CLOSE')}
          onCloseText="Close"
          onConfirmText="Confirm"
          show={confirmTransactionDelete}
          title="Transaction Delete Confirmation"
          message={`Confirm delete transaction ?`}
          isLoading={isLoading}
        />
      )}
      <div
        className={`my-2 bg-white flex gap-3 items-center justify-end ml-auto rounded-md cursor-pointer p-2 animate-openScale`}
      >
        <div className="relative inline-block group" onClick={handleTransactionModal.bind(this, 'OPEN')}>
          <Pen className="w-6 h-5 relative " />
          <span className="z-10 absolute hidden text-sm bg-[#1f1f1f] rounded-md px-1 bottom-full text-white group-hover:block">
            Edit
          </span>
        </div>
        <div className="relative inline-block group">
          <Trash className="w-6 h-5" onClick={handleDeleteTransactionModal.bind(this, 'OPEN')} />
          <span
            className="z-10 absolute hidden text-sm bg-[#1f1f1f] rounded-md bottom-full px-1 text-white 
              group-hover:block"
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
};

export default TransactionItemDetails;
