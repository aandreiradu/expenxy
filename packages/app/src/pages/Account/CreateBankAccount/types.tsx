import { ReactNode } from 'react';

export interface CreateBankAccountProps {
  title: string;
  className?: string;
}

export interface BankingProductsRes {
  message: string;
  bankingProducts: [
    {
      name: string;
      id: string;
    },
  ];
  availableCurrencies: Record<string, string>[];
}

export type TTopLevelNotification = {
  show: boolean;
  message: string;
  icon: ReactNode;
};
