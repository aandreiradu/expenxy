const template = {
  subject: 'EXPENXY Reset Your Password Account',
  html: '<p>Click this {map2} {tacto2} link in order to set a {map2} new password(available for 10 minutes). <a href="http://localhost:5173/reset/{resetToken}">link</a></p>',
};

const replaceTokens = (tokens, template) => {
  console.log(template);

  tokens.forEach((token) => {
    const { mapping, key } = token;
    console.log({ mapping, key });
    template.html = template.html.replace(`{${mapping}}`, key);
  });

  console.log('template', template);
};

const tokens = [
  { key: 'resetToken', mapping: 'resetToken' },
  { key: 'mata', mapping: 'map2' },
  { key: 'tacto', mapping: 'tacto2' },
];

replaceTokens(tokens, template);
