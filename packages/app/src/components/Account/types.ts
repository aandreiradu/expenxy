import { BANK_ACCOUNT_TYPES } from '../BankCard';

export type TAccountsData = {
  balance: string;
  bankAccountType: { name: keyof typeof BANK_ACCOUNT_TYPES };
  currency: { name: string; code: string };
}[];
