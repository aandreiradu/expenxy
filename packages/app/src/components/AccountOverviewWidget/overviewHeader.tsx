import React, { FC } from 'react';

type CategoryType = {
  percentage: number;
  text: string;
  flexIndex: number;
};

export type AccountOverviewHeaderProps = {
  EXPENSES: CategoryType;
  INCOMES: CategoryType;
  MERCHANT: {
    name: string;
    flexIndex: number;
    categoryText: string;
  };
};

const AccountOverviewHeader: FC<AccountOverviewHeaderProps> = ({ EXPENSES, INCOMES, MERCHANT }) => {
  return (
    <div className="w-full flex flex-col bg-white  overflow-hidden">
      <div className="w-full flex items-center">
        <p
          className={`flex-[${INCOMES.flexIndex}] w-full h-full flex  px-2 py-4 font-bold  bg-green-400 border-l border-green-400 text-sm`}
        >
          {INCOMES.percentage}%
        </p>
        <p
          className={`flex-[${EXPENSES.flexIndex}] w-full flex h-full px-2 py-4 font-bold  bg-red-500 border-l border-red-500 text-sm`}
        >
          {EXPENSES.percentage}%
        </p>
        <p
          className={`flex-[${MERCHANT.flexIndex}] w-full flex h-full px-2 py-4 font-bold  bg-yellow-400 border-l border-yellow-400 text-sm`}
        >
          {MERCHANT.name}
        </p>
      </div>
      <div className="w-full flex items-center h-full">
        <p
          className={`flex-[${INCOMES.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-green-400 text-sm`}
        >
          {INCOMES.text}
        </p>
        <p className={`flex-[${EXPENSES.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-red-500 text-sm`}>
          {EXPENSES.text}
        </p>
        <p
          className={`flex-[${MERCHANT.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-yellow-400 text-sm`}
        >
          {MERCHANT.categoryText}
        </p>
      </div>
    </div>
  );
};

export default AccountOverviewHeader;
