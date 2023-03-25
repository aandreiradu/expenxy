import React, { FC, ReactNode } from 'react';
import { CreditCard, Bank, Coins } from 'phosphor-react';

const BANK_ACCOUNT_TYPES = {
  Debit: 'debit',
  Savings: 'savings',
} as const;

type BankAccountType = keyof typeof BANK_ACCOUNT_TYPES;

export type BankCard = {
  name: string;
  balance: number;
  currency: string;
  type: BankAccountType;
};

const getCardStyles = (type: BankAccountType): { icon: ReactNode; classes: string } => {
  switch (type) {
    case 'Debit': {
      return {
        icon: <CreditCard className="w-5 h-6" />,
        classes: 'bg-debitCardPattern bg-center bg-cover',
      };
    }

    case 'Savings': {
      return {
        classes: 'bg-savingsCardPattern bg-center bg-cover',
        icon: <Bank className="w-5 h-6" />,
      };
    }

    default: {
      return {
        icon: <Coins className="w-5 h-6" />,
        classes: 'bg-defaultCardPattern bg-center bg-cover',
      };
    }
  }
};

const BankCard: FC<BankCard> = ({ balance, currency, name, type }) => {
  const { classes, icon } = getCardStyles(type);

  return (
    <div className={`relative rounded-lg md:h-28 md:w-52 bg-black flex flex-shrink-0 flex-col text-white p-2 ${classes}`}>
      <div className="flex justify-between items-center">
        <h4 className="text-base text-right overflow-hidden overflow-ellipsis tracking-wide">
          {name}

          {type}
        </h4>
        {icon}
      </div>
      <p>
        {balance} {currency}
      </p>
    </div>
  );
};

export default BankCard;
