type ExistingBackendMessage =
  | 'existingBankAccountFound'
  | 'testingKeys'
  | 'fetchedBankingProductsSuccess'
  | 'fetchBankingProductsEmpty'
  | 'bankAccountCreatedSuccessfully'
  | 'accountCreatedSuccessfully';

type IStatsAndMessages = {
  [K in ExistingBackendMessage]?: {
    message: string;
    status?: number;
    frontendMessage?: string;
  };
};

const statsAndMaps: IStatsAndMessages = {
  accountCreatedSuccessfully: {
    message: 'Account created',
    status: 200,
    frontendMessage:
      'Account created successfully. You will be redirected to login',
  },
  existingBankAccountFound: {
    message: 'Existing account',
    status: 200,
    frontendMessage:
      'Looks like you already have an existing account with the same Currency and Account Type',
  },
  fetchedBankingProductsSuccess: {
    message: 'Fetched banking products successfully',
    status: 200,
  },
  fetchBankingProductsEmpty: {
    message: 'No banking products found',
    status: 200,
  },
  bankAccountCreatedSuccessfully: {
    message: 'Account created successfully',
    status: 200,
    frontendMessage: 'Your Bank Account has been created successfully',
  },
};

export default statsAndMaps;
