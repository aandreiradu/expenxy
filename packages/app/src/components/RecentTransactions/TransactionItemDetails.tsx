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
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const dispatch = useDispatch();
  const [confirmTransactionDelete, setConfirmTransactionDelete] = useState<boolean>(false);
  const { sendRequest, isLoading, error } = useHttpRequest();
  const [editTransactionShow, setEditTransactionShow] = useState(false);

  useEffect(() => {
    console.log('topLevelNotification stateeee', topLevelNotification);
  }, [topLevelNotification]);

  useEffect(() => {
    if (error) {
      const { message } = error;

      return setTopLevelNotification({
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

  const handleDeleteTransaction = useCallback(async (transactionId: string) => {
    const responseDelete = await sendRequest({
      method: 'POST',
      url: `/deleteTransaction/${transactionId}`,
      withCredentials: true,
    });
    console.log('responseDelete', responseDelete);
    if (responseDelete) {
      const { data, message, status } = responseDelete;
      console.log(message, status, data.latestTransactions);
      if (
        message === statsAndMaps['deleteTransactionSuccess']?.message &&
        status === statsAndMaps['deleteTransactionSuccess']?.status
      ) {
        console.log('este aici');
        setTopLevelNotification({
          show: true,
          message: statsAndMaps['deleteTransactionSuccess']?.frontendMessage || '',
          icon: <Check className="w-14 h-8 text-green-400" />,
        });
        dispatch(setLatestTransactions({ latestTransactions: data.latestTransactions }));
        const timeout = setTimeout(() => {
          setConfirmTransactionDelete(false);
          console.log('sterg timeout');
          clearTimeout(timeout);
        }, 5500);
      }
    }
  }, []);

  return (
    <>
      {editTransactionShow && (
        <ModalTransaction>
          <EditTransaction transactionId={transactionId} onClose={handleTransactionModal.bind(this, 'CLOSE')} />
        </ModalTransaction>
      )}
      {confirmTransactionDelete && (
        <Modal
          hasConfirm={true}
          onConfirm={() => handleDeleteTransaction(transactionId)}
          onClose={() => setConfirmTransactionDelete(false)}
          onCloseText="Close"
          onConfirmText="Confirm"
          show={confirmTransactionDelete}
          title="Transaction Delete Confirmation"
          message={`Confirm delete transaction ?`}
          isLoading={isLoading}
        />
      )}

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
          <Trash className="w-6 h-5" onClick={() => setConfirmTransactionDelete(true)} />
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
