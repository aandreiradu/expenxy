import React, { FC, ReactNode, useCallback } from 'react';
import { CreditCard, Bank, Coins } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountSelected } from '../../store/User/index.slice';
import { accountSelected } from '../../store/User/index.selector';

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
  accountId: string;
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

const BankCard: FC<BankCard> = ({ balance, currency, name, type, accountId }) => {
  const dispatch = useDispatch();
  const selectedAccount = useSelector(accountSelected);
  const { classes, icon } = getCardStyles(type);

  console.log('selectedAccount', selectedAccount);

  const handleAccountSelect = useCallback(() => {
    dispatch(setAccountSelected({ accountId: accountId }));
  }, []);

  const isSelected = selectedAccount === accountId ?? false;

  return (
    <div
      className={`${
        isSelected && 'border-4 border-yellow-400'
      } relative rounded-lg md:h-36 md:w-60 bg-black flex flex-shrink-0 flex-col text-white p-2 ${classes}`}
      onClick={handleAccountSelect}
    >
      {/* <div className="z-0 absolute top-0 left-0 right-0 bg-black/20 w-full h-full overflow-hidden rounded-lg"></div> */}
      <div className="flex justify-between items-center">
        <h4 className="text-sm text-right overflow-hidden overflow-ellipsis tracking-wide">{type}</h4>
        {icon}
      </div>
      <p className="my-3 text-base uppercase tracking-wider">{name}</p>
      <p className="text-lg flex items-center justify-between w-full">
        <span className="text-lg">
          {balance &&
            currency &&
            (new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency ?? '' }).format(balance ?? 0) ?? 0)}
        </span>
        {/* <span className="text-base uppercase">{currency}</span> */}
      </p>
    </div>
  );
};

export default BankCard;
