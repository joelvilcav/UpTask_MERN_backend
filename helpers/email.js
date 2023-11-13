import nodemailer from 'nodemailer';

export const registerEmail = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
