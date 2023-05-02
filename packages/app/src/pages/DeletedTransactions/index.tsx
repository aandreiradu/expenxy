import { useCallback, useEffect, useState } from 'react';
import DeletedTransactionItem from '../../components/DeletedTransactionItem';
import MainLayout from '../../components/Layouts/MainLayout';
import { useHttpRequest } from '../../hooks/useHttp';
import Paginator from '../../components/Paginator';
import { useDispatch, useSelector } from 'react-redux';
import { setDeletedTransactions, setDeletedTransactionsPageNo } from '../../store/User/index.slice';
import { selectDeletedTransactions } from '../../store/User/index.selector';
import { TTopLevelNotification } from '../Account/CreateBankAccount/types';
import { Warning } from 'phosphor-react';
import Loader from '../../components/Loader';
import { PropagateLoader } from 'react-spinners';
import TopLevelNotification from '../../components/UI/TopLevelNotification';

const DeletedTransactions = () => {
  let { transactionsDeleted, transactionsDeletedCount, transactionsDeletedPage } = useSelector(selectDeletedTransactions);
  const dispatch = useDispatch();
  const { sendRequest, isLoading, error } = useHttpRequest();
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });

  const handlePageChanged = useCallback(
    (direction: 'NEXT' | 'PREV') => {
      let page = transactionsDeletedPage || 1;

      switch (direction) {
        case 'NEXT': {
          console.log('current transactionsDeletedPage', page);
          page++;
          dispatch(setDeletedTransactionsPageNo({ pageNo: page }));
          break;
        }
        case 'PREV': {
          console.log('current transactionsDeletedPage', page);
          page--;
          dispatch(setDeletedTransactionsPageNo({ pageNo: page }));
          break;
        }

        default: {
          console.log('Unhandled direction', direction);
          return;
        }
      }

      getDeletedTransactions(page);
    },
    [transactionsDeletedPage],
  );

  const getDeletedTransactions = useCallback(async (pageNo?: number) => {
    const response = await sendRequest({
      method: 'GET',
      url: `/deletedTransactions?page=${pageNo}`,
      withCredentials: true,
    });

    if (response) {
      const { data, status } = response;

      if (status === 200 && data?.deletedTransactions) {
        const { deletedTransactions, deletedTransactionsCount } = data;
        dispatch(
          setDeletedTransactions({
            totalTransactions: deletedTransactionsCount,
            transactions: deletedTransactions,
          }),
        );
      }
    }
  }, []);

  useEffect(() => {
    transactionsDeleted?.length === 0 && getDeletedTransactions(1);
  }, []);

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

  return (
    <MainLayout>
      <div className="my-3 flex flex-col overflow-y-auto h-full">
        <h2 className="text-lg capitalize font-semibold">Deleted Transactions</h2>

        {error && topLevelNotification.show && (
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

        {isLoading ? (
          <Loader icon={<PropagateLoader color="#1f1f1f" className="p-2" />} />
        ) : (
          <Paginator
            currentPage={transactionsDeletedPage}
            lastPage={Math.ceil(transactionsDeletedCount / 20)}
            onNext={handlePageChanged.bind(this, 'NEXT')}
            onPrevious={handlePageChanged.bind(this, 'PREV')}
          >
            <div className="my-3 flex flex-col lg:grid lg:grid-cols-150_1fr gap-x-5 gap-y-5">
              {transactionsDeleted?.map((transaction) => (
                <DeletedTransactionItem
                  key={transaction.id}
                  amount={transaction.amount}
                  currency={transaction.currencySymbol}
                  date={new Date(transaction.transactionDate).toLocaleDateString()}
                  name={transaction.merchant || ''}
                  deletedOn={new Date(transaction.deletedAt).toLocaleDateString()}
                  transactionType={transaction.transactionType}
                />
              ))}
            </div>
          </Paginator>
        )}
      </div>
    </MainLayout>
  );
};

export default DeletedTransactions;
