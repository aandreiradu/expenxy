import { ReactNode, useState } from 'react';
import TransactionItemDetails from './TransactionItemDetails';

interface TransactionItemProps {
  merchant: string;
  date: string;
  amount: number;
  currency: string;
  merchantLogoUrl?: ReactNode;
  type: 'Expense' | 'Income';
}

const TransactionItem = ({ amount, currency, date, merchant, merchantLogoUrl, type }: TransactionItemProps) => {
  const [showTransactionDetails, setShowTransactionDetails] = useState<boolean>(false);

  const openTransactionDetails = () => {
    setShowTransactionDetails((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex bg-white w-full items-center rounded-md cursor-pointer" onClick={openTransactionDetails}>
        <div className="flex-shrink-0 bg-yellow-200 rounded-md">{merchantLogoUrl}</div>
        <div className="mx-4 flex-1 my-auto bg-white">
          <p className="font-medium">{merchant}</p>
          <p className="text-xs font-extralight">{date}</p>
        </div>
        <div className="ml-auto mr-4 flex items-center">
          <span className="text-xs mt-auto pb-[2px] mr-0.5 font-semibold">{currency}</span>
          <p className={`text-lg font-bold ${type === 'Expense' ? 'text-red-500' : 'text-green-500'}`}>
            {type === 'Expense' ? -amount : amount}
          </p>
        </div>
      </div>
      {showTransactionDetails && <TransactionItemDetails />}
    </div>
  );
};

export default TransactionItem;
