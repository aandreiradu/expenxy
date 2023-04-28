import React, { FC } from 'react';
import { AvailableTypes as TransactionTypes } from '../../pages/AddTransaction/types';

export type DeletedTransactionItemArgs = {
  name: string;
  date: string;
  amount: number;
  currency: string;
  deletedOn: string;
  transactionType: TransactionTypes;
};

const DeletedTransactionItem: FC<DeletedTransactionItemArgs> = ({
  amount,
  currency,
  date,
  name,
  transactionType,
  deletedOn,
}) => {
  // max-h-5
  return (
    <div className="w-full flex flex-col gap-2 bg-gray-300 text-[#1f1f1f] rounded-md p-2 hover:bg-[#1f1f1f] hover:text-white">
      <div className="flex items-center justify-between">
        <p className="text-left text-base font-semibold w-3/5 max-h-5 overflow-auto">{name}</p>
        <p className="w-2/5 text-right">
          {amount}
          <span className="text-sm">{currency}</span>
        </p>
      </div>
      <div className="flex justify-between">
        <span className="text-sm">Type</span>
        <span className="text-sm">{transactionType}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm">Created At</span>
        <span className="text-sm">{date}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm">Deleted At</span>
        <span className="text-sm">{deletedOn}</span>
      </div>
    </div>
  );
};

export default DeletedTransactionItem;
