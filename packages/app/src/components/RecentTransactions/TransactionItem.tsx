import { ReactNode } from 'react';
import TransactionItemDetails from './TransactionItemDetails';
import { CaretDown, CaretUp } from 'phosphor-react';

interface TransactionItemProps {
  merchant: string;
  date: string;
  amount: number;
  currency: string;
  merchantLogoUrl?: ReactNode;
  type: 'Expense' | 'Income';
  transactionId: string;
  showTransactionIdDetails: string;
  onTransactionOpen: () => void;
}

const TransactionItem = ({
  amount,
  currency,
  date,
  merchant,
  merchantLogoUrl,
  type,
  showTransactionIdDetails,
  transactionId,
  onTransactionOpen,
}: TransactionItemProps) => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex bg-white w-full items-center rounded-md cursor-pointer">
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
          {transactionId !== showTransactionIdDetails ? (
            <CaretDown className="h-4 w-4 mx-1" onClick={onTransactionOpen} />
          ) : (
            <CaretUp className="h-4 w-4 mx-1" onClick={onTransactionOpen} />
          )}
        </div>
      </div>
      {showTransactionIdDetails === transactionId && <TransactionItemDetails transactionId={transactionId} />}
    </div>
  );
};

export default TransactionItem;
