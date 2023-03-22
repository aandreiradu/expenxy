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
