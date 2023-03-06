type ExistingBackendMessage = 'existingBankAccountFound' | 'testingKeys';

// type IStatsAndMessages = {
//   [K in ExistingBackendMessage]?: (data: string[]) => {};
// };

type IStatsAndMessages = {
  [K in ExistingBackendMessage]?: {
    message: string;
    status?: number;
    frontendMessage?: string;
  };
};

const statsAndMaps: IStatsAndMessages = {
  existingBankAccountFound: {
    message: 'Existing account',
    status: 200,
    frontendMessage:
      'Looks like you already have an existing account with the same Currency and Account Type',
  },
  // existingBankAccountFound: (data) => {
  //   return {
  //     message: `We found another bank account associated with you account with the following data`,
  //     status: 200,
  //     frontendMessage: `We found another bank account associated with you account with the following data: ${data}`,
  //   };
  // },
};

export default statsAndMaps;
