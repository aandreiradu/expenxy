import { getAccounts } from '../../controllers/account';
import prisma from '../../utils/prisma';
import { CreateBankAccountArgs, HasExistingAccountReturn, THasExistingAccount } from './types';

interface IAccount {
  getBankingProducts(): Promise<{
    bankingProducts: { name: string; id: string }[];
    availableCurrecies: { id: string; code: string; name: string }[];
  }>;

  createBankAccount(args: CreateBankAccountArgs): Promise<{ accountId: string } | null>;

  // hasExistingAccount(args: THasExistingAccount): Promise<HasExistingAccountReturn | null>;
  hasExistingAccount(args: THasExistingAccount): Promise<HasExistingAccountReturn | null>;

  getBankingProductId(id: string): Promise<{ id: string; name: string } | null>;

  getCurrencyId(id: string): Promise<string | null>;

  needsBankAccount(id: string): Promise<boolean>;

  getAccounts(userId: string): Promise<any>;
}

export const BankAccountService: IAccount = {
  async getBankingProducts() {
    const bankingProducts = await prisma.bankAccountType.findMany({
      select: {
        name: true,
        id: true,
      },
    });

    const availableCurrecies = await prisma.currency.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    console.log({
      availableCurrecies,
      bankingProducts,
    });

    return {
      bankingProducts,
      availableCurrecies,
    };
  },

  async getBankingProductId(id: string) {
    const bankingProduct = await prisma.bankAccountType.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return bankingProduct ?? null;
  },

  async getCurrencyId(currencyId: string) {
    const currency = await prisma.currency.findFirst({
      where: {
        id: currencyId,
      },
      select: {
        id: true,
      },
    });

    console.log('currency', currency);

    if (currency) {
      return currency.id;
    }

    console.log(`No currency found for id`, currencyId);
    return null;
  },

  async createBankAccount(args: CreateBankAccountArgs) {
    const selectedBankingProduct = await this.getBankingProductId(args.accountTypeId);
    const currencyId = await this.getCurrencyId(args.currency);
    console.log('selectedBankingProduct', selectedBankingProduct);

    if (!selectedBankingProduct) {
      console.log('couldnt identify the banking product, retun null', selectedBankingProduct);
      return null;
    }

    if (!currencyId) {
      console.log('couldnt identify the currencyid, retun null', currencyId);
      return null;
    }

    const { id: bankAccountTypeId } = selectedBankingProduct;
    console.log('selectedBankingProduct', selectedBankingProduct);

    const bankAccount = await prisma.account.create({
      data: {
        balance: args.balance,
        currencyId: currencyId,
        bankAccountTypeId: bankAccountTypeId,
        userId: args.userId,
      },
      select: {
        id: true,
      },
    });

    if (bankAccount?.id) {
      return { accountId: bankAccount.id };
    }

    return null;
  },

  async hasExistingAccount(args: THasExistingAccount) {
    const { id: bankingProductId } = (await this.getBankingProductId(args.accountTypeId)) || {};
    const currencyId = await this.getCurrencyId(args.currency);

    if (!bankingProductId) {
      console.log('couldnt identify the banking product for id', args.accountTypeId, 'retun null', bankingProductId);
      throw new Error('Could not identify the Banking Product');
    } else if (!currencyId) {
      console.log('couldnt identify the currency for id', args.currency, 'retun null', currencyId);
      throw new Error('Could not identify the Currency');
    }

    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: args.userId,
        currencyId: currencyId,
        bankAccountTypeId: bankingProductId,
      },
      select: {
        balance: true,
        currency: {
          select: {
            code: true,
          },
        },
        bankAccountType: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log('existingAccount', existingAccount);

    if (existingAccount) {
      return {
        currency: existingAccount.currency.code,
        accountType: existingAccount.bankAccountType.name,
        userId: args.userId,
      };
    }

    return null;
  },

  /*
    Used to count the bank account for a specific User. After Register / Login, if an user does not have a banking account,
    he will be redirected to create one
  */
  async needsBankAccount(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    const {
      _count: { accounts: accountNo },
    } = user;

    if (!accountNo) {
      return false;
    }

    return true;
  },

  async getAccounts(userId: string) {
    const existingAccounts = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        accounts: {
          select: {
            balance: true,
            currency: true,
            // bankAccountType: {
            //   select: {
            //     name: true,
            //   },
            // },
          },
        },
      },
    });

    console.log('existingAccounts', existingAccounts);

    if (existingAccounts) {
      return existingAccounts;
    }

    return null;
  },
};
