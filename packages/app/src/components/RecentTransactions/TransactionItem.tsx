import { ReactNode } from 'react';

interface TransactionItemProps {
  merchant: string;
  date: string;
  amount: number;
  currency: string;
  merchantLogoUrl?: ReactNode;
}

const TransactionItem = ({
  amount,
  currency,
  date,
  merchant,
  merchantLogoUrl,
}: TransactionItemProps) => {
  return (
    <div className="flex bg-white w-full items-center rounded-md">
      <div className="flex-shrink-0 bg-yellow-200 rounded-md">
        {merchantLogoUrl}
      </div>
      <div className="mx-4 flex-1 my-auto bg-white">
        <p className="font-medium">{merchant}</p>
        <p className="text-xs font-extralight">{date}</p>
      </div>
      <div className="ml-auto mr-4 flex items-center">
        <span className="text-xs mt-auto pb-[2px] font-semibold">
          {currency}
        </span>
        <p className="text-lg font-bold">{amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
