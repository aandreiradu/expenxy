import { useEffect } from 'react';
import DeletedTransactionItem from '../../components/DeletedTransactionItem';
import MainLayout from '../../components/Layouts/MainLayout';
import { useHttpRequest } from '../../hooks/useHttp';

const transactionsMock = {
  name: 'test',
  date: new Date().toLocaleDateString(),
  amount: 6000,
  currency: '€',
};

const DeletedTransactions = () => {
  const { sendRequest, isLoading, error } = useHttpRequest();

  useEffect(() => {
    const getDeletedTransactions = async () => {
      const response = await sendRequest({
        method: 'GET',
        url: '/deletedTransactions',
        withCredentials: true,
      });

      console.log('response', response);
    };

    getDeletedTransactions();
  }, []);

  useEffect(() => {
    if (error) {
      console.log('error', error);
    }
  }, [error]);

  return (
    <MainLayout>
      <div className="my-3 w-full flex flex-col overflow-y-auto">
        <h2 className="text-lg capitalize font-semibold">Deleted Transactions</h2>

        <div className="mt-3 grid grid-cols-150_1fr gap-x-2 gap-y-5">
          {new Array(30).fill(transactionsMock).map((item) => (
            <DeletedTransactionItem
              amount={transactionsMock.amount}
              currency={transactionsMock.currency}
              date={transactionsMock.date}
              name={transactionsMock.name}
              deletedOn={new Date().toLocaleDateString()}
              transactionType={'Expense'}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DeletedTransactions;
