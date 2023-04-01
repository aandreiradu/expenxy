import { AirplaneTilt } from 'phosphor-react';
import TransactionItem from './TransactionItem';
import { selectLatestTransactions } from '../../store/User/index.selector';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpRequest } from '../../hooks/useHttp';
import { useEffect } from 'react';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { setLatestTransactions } from '../../store/User/index.slice';
import Loader from '../Loader';
import { PropagateLoader } from 'react-spinners';
const RecentTransactions = () => {
  const dispatch = useDispatch();
  const { sendRequest, isLoading, error } = useHttpRequest();
  const { latestTransactions } = useSelector(selectLatestTransactions);

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
      <div className="sticky top-0 left-0 w-full flex justify-between items-center py-3">
        <p className="text-black font-bold text-lg">Recent Transactions</p>
        {latestTransactions?.length > 0 && (
          <span className="cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-400 px-5 leading-7 text-[12px] text-gray-400">
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
