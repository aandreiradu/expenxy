import { AirplaneTilt } from 'phosphor-react';
import TransactionItem from './TransactionItem';

const RecentTransactions = () => {
  return (
    <div className="w-full max-w-md mt-auto h-[350px] max-h-[400px] ">
      <div className="w-full flex justify-between items-center py-3">
        <p className="text-black font-bold text-lg">Recent Transactions</p>
        <span className="cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-400 px-5 leading-7 text-[12px] text-gray-400">
          View All
        </span>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {[...Array(4).keys()].map((_transaction) => (
          // eslint-disable-next-line react/jsx-key
          <TransactionItem
            amount={25}
            currency={'$'}
            date={'2023-01-26'}
            merchant={'eMAG'}
            merchantLogoUrl={<AirplaneTilt className="h-16 w-16 p-4" />}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
