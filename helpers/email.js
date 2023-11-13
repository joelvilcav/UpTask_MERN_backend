import nodemailer from 'nodemailer';

export const registerEmail = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'a9ee6ab642a4e1',
      pass: 'e3505cde06b2c5',
    },
  });

  // Email information
  const info = await transport.sendMail({
    from: '"UpTask - Administrator" <account@uptask.com>',
    to: email,
    subject: 'UpTask - Confirm your account',
    html: `<p>Hi there: ${name}, confirm your account in UpTask Managment Administrator</p>
    <p>Your account is almost ready, just confirm in the following link:
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">CONFIRM ACCOUNT!</a>
    </p> 
    <p>If you don't create this account, just ignore this message</p>
    `,
  });
};

export const recoverPassword = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'a9ee6ab642a4e1',
      pass: 'e3505cde06b2c5',
    },
  });

  // Email information
  const info = await transport.sendMail({
    from: '"UpTask - Administrator" <account@uptask.com>',
    to: email,
    subject: 'UpTask - Recover your password',
    html: `<p>Hi there: ${name}, to recover your password in UpTask Managment Administrator</p>
    <p>Just click in the following link:
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">CLICK HERE!</a>
    </p> 
    <p>If you don't ask for this, just ignore this message</p>
    `,
  });
};