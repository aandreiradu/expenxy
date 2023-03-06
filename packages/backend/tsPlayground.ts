// type templateType = 'RESET_PASSWORD' | 'WELCOME';

// type IEmailTemplates = {
//   [key in templateType]?: {
//     subject: string;
//     html: string;
//     text?: string;
//   };
// };

// const emailTemplates: IEmailTemplates = {
//   RESET_PASSWORD: {
//     subject: 'EXPENXY Reset Your Password Account',
//     html: '<p>Click this link in order to set a new password(available for 10 minutes). <a href="http://localhost:4040/reset/${token}">link</a></p>',
//   },
//   WELCOME: {
//     subject: 'Welcome to EXPENXY',
//     html: '<p><b>Welcome to EXPENXY</b></p>',
//   },
// };

// export const getTemplateByType = (type: templateType) => {
//   switch (type) {
//     case 'RESET_PASSWORD':
//       return emailTemplates['RESET_PASSWORD'];

//     case 'WELCOME':
//       return emailTemplates['WELCOME'];

//     default:
//       return null;
//   }
// };

// interface ISendMailArgs {
//   type: templateType;
//   to: string;
//   from: string;
// }

// export const sendMail = async ({ from, to, type }: ISendMailArgs) => {
//   console.log('SENDGRID_API_KEY', process.env.SENDGRID_API_KEY);
//   // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

//   const emailTemplate = getTemplateByType(type);
//   console.log('emailTemplate', emailTemplate);

//   if (emailTemplate) {
//     const msg = {
//       from,
//       to,
//       ...emailTemplate,
//     };
//     console.log('msg', msg);
//   }

//   try {
//     // const providerResponse = await sgMail.send(msg);
//     // console.log('providerResponse', providerResponse);

//     return true;
//   } catch (error) {
//     console.log('error');
//     throw error;
//   }
// };

// sendMail({
//   from: '',
//   to: '',
//   type: 'RESET_PASSWORD',
// });

// enum test {
//   a = 'a',
//   b = 'b',
//   c = 'c',
// }

// console.log(Object.values(test));
// console.log(test);

// enum CurrencyENUMS {
//   'EUR' = 'EUR',
//   'RON' = 'RON',
// }

// type CurrencyKEYS = keyof typeof CurrencyENUMS;

// const printCurrency = (currency: CurrencyENUMS) => {
//   switch (currency) {
//     case CurrencyENUMS.EUR:
//       console.log(CurrencyENUMS.EUR);
//       console.log(
//         `Invalid currency. Expected currency: ${Object.keys(CurrencyENUMS)}`,
//       );
//       break;

//     case CurrencyENUMS.RON:
//       console.log(CurrencyENUMS.RON);
//       break;

//     default:
//       throw new Error(`Invalid currency. Expected currency: ${CurrencyENUMS}`);
//   }
// };

// printCurrency(CurrencyENUMS.EUR);

const stringFreq = (str: string) => {
  const frequencyMap = new Map();
  [...str].forEach((char) => {
    if (!frequencyMap.get(char)) {
      frequencyMap.set(char, 1);
    } else {
      frequencyMap.set(char, frequencyMap.get(char) + 1);
    }
  });

  return frequencyMap;
};

console.log(stringFreq('anaaa'));
