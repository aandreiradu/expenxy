import { AirplaneTilt, Warning } from 'phosphor-react';
import TransactionItem from './TransactionItem';
import { selectLatestTransactions } from '../../store/User/index.selector';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpRequest } from '../../hooks/useHttp';
import { useEffect, useState } from 'react';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { setLatestTransactions } from '../../store/User/index.slice';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';
import TopLevelNotification from '../UI/TopLevelNotification';
import { TTopLevelNotification } from '../../pages/Account/CreateBankAccount/types';

const RecentTransactions = () => {
  const [showTransactionDetails, setShowTransactionDetails] = useState<string>('');

  const openTransactionDetails = (transactionId: string) => {
    console.log('triggered', transactionId);
    console.log('showTransactionDetails', showTransactionDetails);
    transactionId !== showTransactionDetails ? setShowTransactionDetails(transactionId) : setShowTransactionDetails('');
  };
  const [topLevelNotification, setTopLevelNotification] = useState<TTopLevelNotification>({
    show: false,
    message: '',
    icon: <></>,
  });
  const dispatch = useDispatch();
  const { sendRequest, isLoading, error } = useHttpRequest();
  const { latestTransactions } = useSelector(selectLatestTransactions);

  useEffect(() => {
    if (error) {
      const { message } = error;
      setTopLevelNotification({
        show: true,
        message: message || 'Someting went wrong when fetching your recent transactions',
        icon: <Warning className="w-14 h-8 text-red-700" />,
      });
    }
  }, [error]);

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      if (latestTransactions.length === 0) {
        const response = await sendRequest({
          method: 'GET',
          withCredentials: true,
          url: '/transactions/latest',
        });

        console.log('response', response);
        if (response) {
          const { data, status, message } = response;

          if (status === 200 && message === statsAndMaps['fetchLatestTransactionsSuccessfully']?.message) {
            console.log('all good, can dispatch');
            const { latestTransactions } = data;
            console.log('latestTransactions', latestTransactions);
            dispatch(setLatestTransactions({ latestTransactions }));
          }
        }
      } else {
        console.log('transactions already in store, no need to fetch again');
      }
    };
    fetchLatestTransactions();
  }, []);

  return (
    <div className="relative w-full h-full max-h-[350px] overflow-hidden">
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

      <div className="sticky top-0 left-0 w-full flex justify-between items-center py-3">
        <p className="text-black font-bold text-lg">Recent Transactions</p>
        {latestTransactions?.length > 0 && (
          <span className="w-fit text-xl cursor-pointer relative after:content-[''] after:absolute after:w-full after:bottom-0 after:left-0 after:h-[2px] after:bg-gray-400 px-5 leading-7 text-[12px] text-gray-400 after:hover:w-full after:hover:animate-growingWidth after:focus:w-full after:focus:animate-growingWidth after:hover:bg-yellow-400">
            View All
          </span>
        )}
      </div>
      <div className="relative w-full h-full max-h-[300px] flex flex-col items-center gap-3 overflow-y-auto">
        {isLoading ? (
          <div className="max-w-md mt-5">
            <Loader
              icon={<PropagateLoader color="#1f1f1f" className="p-2" />}
              loadingText="Getting your latest transactions"
              textClasses="text-[#1f1f1f] text-lg  uppercase"
            />
          </div>
        ) : latestTransactions?.length > 0 ? (
          latestTransactions?.map((tr) => (
            <TransactionItem
              key={tr.transactionId}
              amount={Number(tr.amount)}
              currency={tr.currencySymbol || tr.currency}
              date={new Date(tr.date).toLocaleDateString('ro-RO')}
              merchant={tr.merchant || 'Unknown'}
              merchantLogoUrl={<AirplaneTilt className="h-16 w-16 p-4" />}
              type={tr.transactionType}
              transactionId={tr.transactionId}
              showTransactionIdDetails={showTransactionDetails}
              onTransactionOpen={openTransactionDetails.bind(this, tr.transactionId)}
            />
          ))
        ) : (
          <p className="mt-3 text-base capitalize font-bold">No transactions recorded</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
