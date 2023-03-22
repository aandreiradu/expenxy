// import { Prisma,PrismaClient } from '@prisma/client';
// import { BankAccountType, Account, Currency, Session, User, Transaction } from '@prisma/client';

// // type EntityName = {
// //   BankAccountType,
// //   Account,
// //   Currency,
// //   Session,
// //   User,
// //   Transaction,
// // }

// type DelegatesTypes = {
//     User : Prisma.UserDelegate<never>,
//     Currency : Prisma.CurrencyDelegate<never>,
//     Session : Prisma.SessionDelegate<never>,
//     Account : Prisma.AccountDelegate<never>,
//     BankAccountType : Prisma.BankAccountTypeDelegate<never>
// }

// interface IGeneral {
//   getById<T = DelegatesTypes>(entityName: T, columns: string[]): Promise<any>;
// }

// export const GeneralService : IGeneral = {
//     getById : async <T>(entityName : T,columns: keyof PrismaClient.) => {

//     }
// };

// // const asd = GeneralService.getById({})
