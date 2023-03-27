import React, { FC, ReactNode } from 'react';
import { CreditCard, Bank, Coins } from 'phosphor-react';

export const BANK_ACCOUNT_TYPES = {
  'Savings': 'Savings',
  'Mortgage': 'Mortgage',
  'Bank Account': 'Bank Account',
} as const;

type BankAccountType = keyof typeof BANK_ACCOUNT_TYPES;

export type BankCard = {
  name: string;
  balance: number;
  currency: string;
  type: BankAccountType | '';
};

const getCardStyles = (type: BankAccountType | ''): { icon: ReactNode; classes: string } => {
  switch (type) {
    case 'Bank Account':
    case 'Mortgage': {
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
    <div className={`relative rounded-lg md:h-36 md:w-60 bg-black flex flex-shrink-0 flex-col text-white p-2 ${classes}`}>
      <div className="flex justify-between items-center">
        <h4 className="text-base text-right overflow-hidden overflow-ellipsis tracking-wide">{name}</h4>
        {icon}
      </div>
      <p className="mt-3 text-lg flex items-center justify-between w-full">
        <span className="text-lg">{balance}</span>
        <span className="text-base uppercase">{currency}</span>
      </p>
    </div>
  );
};

export default BankCard;
