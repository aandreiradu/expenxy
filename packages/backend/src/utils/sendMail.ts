import sgMail from '@sendgrid/mail';
import type { ClientResponse } from '@sendgrid/mail';

type templateType = 'RESET_PASSWORD' | 'WELCOME';

type IEmailTemplates = {
  [key in templateType]?: {
    subject: string;
    html: string;
    text?: string;
  };
};

const emailTemplates: IEmailTemplates = {
  RESET_PASSWORD: {
    subject: 'EXPENXY Reset Your Password Account',
    html: '<p>Click this link in order to set a new password(available for 10 minutes). <a href="http://localhost:5173/reset/{resetToken}">link</a></p>',
  },
  WELCOME: {
    subject: 'Welcome to EXPENXY',
    html: '<p><b>Welcome to EXPENXY</b></p>',
  },
};

export const getTemplateByType = (type: templateType) => {
  switch (type) {
    case 'RESET_PASSWORD':
      return emailTemplates['RESET_PASSWORD'];

    case 'WELCOME':
      return emailTemplates['WELCOME'];

    default:
      return null;
  }
};

interface ISendMailArgs {
  type: templateType;
  to: string;
  from?: string;
  token?: string;
}

export const sendMail = async (
  { from = 'raduandrei697@gmail.com', to, type }: ISendMailArgs,
  token: string,
): Promise<void> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const emailTemplate = getTemplateByType(type);
  if (emailTemplate) {
    emailTemplate.html = emailTemplate.html.replace('{resetToken}', token);
  }

  if (!emailTemplate) {
    throw new Error('Invalid email type');
  }

  if (emailTemplate) {
    const msg = {
      from,
      to,
      ...emailTemplate,
    };

    const responseProvider = await sgMail.send(msg);
    console.log('responseProvider', responseProvider);
  }
};

// export const replaceTokens = (tokens : string[],template : string) => {
//     tokens.forEach((token) => {
//         template.replace(token,token);
//     })
// }
