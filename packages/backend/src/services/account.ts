// import { z } from 'zod';
// import prisma from '../utils/prisma';
// import { Account } from '@prisma/client';

// export const bankAccountTypes = z.enum(['Bank Account', 'Savings', 'Morgage'], {
//   errorMap: (issue) => {
//     console.log('issue', issue);
//     switch (issue.code) {
//       case 'invalid_enum_value':
//       case 'invalid_type':
//         return { message: `Invalid Bank Account Type` };

//       default:
//         return { message: 'Invalid Bank Account Type' };
//     }
//   },
// });

// export const currencyAccountTypes = z.enum(['EUR', 'RON'], {
//   errorMap: (issue) => {
//     switch (issue.code) {
//       case 'invalid_enum_value':
//       case 'invalid_type':
//         return {
//           message: `Invalid Currency. Expected currencies: ${Object.keys(z.enum(['EUR']))}`,
//         };

//       default: {
//         return { message: 'Invalid Currency' };
//       }
//     }
//   },
// });

// export const createBankAccountSchema = z
//   .object({
//     userId: z.string(),
//     accountTypeId: /*bankAccountTypes*/ z.string().uuid(),
//     currency: currencyAccountTypes,
//     balance: z.string().default('0'),
//   })
//   .superRefine((val, ctx) => {
//     if (parseFloat(val.balance) < parseFloat('-25000')) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Minimum balance value can't be lower than -25.000",
//         path: ['balance'],
//       });
//     }
//   });

// export type CreateBankAccountArgs = z.infer<typeof createBankAccountSchema>;

// export type THasExistingAccount = {
//   userId: string;
//   type: CreateBankAccountArgs['accountTypeId'];
//   currency: CreateBankAccountArgs['currency'];
// };

// export type HasExistingAccountReturn = Pick<Account, 'balance' | 'currency' | 'bankAccountTypeId'>;

// interface IAccount {
//   getBankingProducts(): Promise<{ name: string; id: string }[] | null>;

//   createBankAccount(args: CreateBankAccountArgs): Promise<{ accountId: string } | null>;

//   hasExistingAccount(args: THasExistingAccount): Promise<HasExistingAccountReturn | null>;

//   getBankingProductById(id: string): Promise<{ id: string; name: string } | undefined>;

//   needsBankAccount(id: string): Promise<boolean>;
// }

// export const BankAccountService: IAccount = {
//   async getBankingProducts() {
//     const bankingProducts = await prisma.bankAccountType.findMany({
//       select: {
//         name: true,
//         id: true,
//       },
//     });

//     return bankingProducts ?? null;
//   },

//   async getBankingProductById(id: string) {
//     const bankingProduct = await prisma.bankAccountType.findFirst({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     return bankingProduct ?? undefined;
//   },

//   async createBankAccount(args: CreateBankAccountArgs) {
//     const selectedBankingProduct = await this.getBankingProductById(args.accountTypeId);
//     console.log('selectedBankingProduct', selectedBankingProduct);

//     if (!selectedBankingProduct) {
//       console.log('couldnt identify the banking product, retun null', selectedBankingProduct);
//       return null;
//     }

//     const { id, name } = selectedBankingProduct;
//     console.log('selectedBankingProduct', selectedBankingProduct);

//     const bankAccount = await prisma.account.create({
//       data: {
//         balance: parseFloat(args.balance),
//         currency: args.currency,
//         bankAccountTypeId: id,
//         userId: args.userId,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (bankAccount?.id) {
//       return { accountId: bankAccount.id };
//     }

//     return null;
//   },

//   async hasExistingAccount(args: THasExistingAccount) {
//     const existingAccount = await prisma.account.findFirst({
//       where: {
//         userId: args.userId,
//         bankAccountTypeId: args.type,
//         currency: args.currency,
//       },
//       select: {
//         balance: true,
//         currency: true,
//         bankAccountType: true,
//         bankAccountTypeId: true,
//       },
//     });

//     if (existingAccount) {
//       return existingAccount;
//     }

//     return null;
//   },

//   /*
//     Used to count the bank account for a specific User. After Register / Login, if an user does not have a banking account,
//     he will be redirected to create one
//   */
//   async needsBankAccount(id: string) {
//     const user = await prisma.user.findFirst({
//       where: {
//         id: id,
//       },
//       select: {
//         _count: {
//           select: {
//             Account: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return false;
//     }

//     const {
//       _count: { Account: accountNo },
//     } = user;

//     if (!accountNo) {
//       return false;
//     }

//     return true;
//   },
// };
