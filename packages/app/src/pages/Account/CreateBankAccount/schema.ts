import { boolean, z } from 'zod';
import { CurrencyEnums } from '../../AddTransaction/schema';

const bankAcountTypes = z.enum(['Bank Account', 'Savings', 'Morgage'], {
  errorMap: (issue) => {
    switch (issue.code) {
      case 'invalid_enum_value':
      case 'invalid_type':
        return { message: 'Invalid Bank Account Type' };

      default:
        return { message: 'Invalid Bank Account Type' };
    }
  },
});

export const createBankAccountSchema = z
  .object({
    accountName: z.string(),
    currency: CurrencyEnums,
    balance: z.string().default('0'),
    accountType: bankAcountTypes,
  })
  .superRefine((val, ctx) => {
    if (parseFloat(val.balance) < parseFloat('-25000')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum balance value can't be lower than -25.000",
        path: ['balance'],
      });
    }
  });

export type CreateBankAcountProps = z.infer<typeof createBankAccountSchema>;

export function getFormattedCurrency(num: any) {
  num = num.toFixed(2);
  var cents = (num - Math.floor(num)).toFixed(2);
  return Math.floor(num).toLocaleString(); //+ '.' + cents.split('.')[1];
}

export function hasOnlyCodeMultiplied(val: string) {
  const splitted = val.split('');
  const isValid = !splitted.find((val) => val !== splitted[0]);
  return isValid;
}

/*

const numberInString = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });

    // This is a special symbol you can use to
    // return early from the transform function.
    // It has type `never` so it does not affect the
    // inferred return type.
    return z.NEVER;
  }
  return parsed;
});

*/
