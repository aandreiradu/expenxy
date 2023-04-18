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
    <div className="w-full flex flex-col bg-white">
      <div className="w-full flex items-center">
        <p
          className={`flex-[${INCOMES.flexIndex}] w-full h-full flex  px-2 py-4 font-bold text-lg bg-green-400 border-l border-green-400`}
        >
          {INCOMES.percentage}%
        </p>
        <p
          className={`flex-[${EXPENSES.flexIndex}] w-full flex h-full px-2 py-4 font-bold text-lg bg-red-500 border-l border-red-500`}
        >
          {EXPENSES.percentage}%
        </p>
        <p
          className={`flex-[${MERCHANT.flexIndex}] w-full flex h-full px-2 py-4 font-bold text-lg bg-yellow-400 border-l border-yellow-400`}
        >
          {MERCHANT.name}
        </p>
      </div>
      <div className="w-full flex items-center">
        <p className={`flex-[${INCOMES.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-green-400`}>
          {INCOMES.text}
        </p>
        <p className={`flex-[${EXPENSES.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-red-500`}>
          {EXPENSES.text}
        </p>
        <p className={`flex-[${MERCHANT.flexIndex}] w-full h-full flex px-2 py-2 font-base border-l border-yellow-400`}>
          {MERCHANT.categoryText}
        </p>
      </div>
    </div>
  );
};

export default AccountOverviewHeader;
