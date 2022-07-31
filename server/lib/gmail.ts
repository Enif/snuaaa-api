const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');

const getGmailService = () => {
  const client_secret = process.env.OAUTH_CREDENTIALS_CLIENT_SECRET;
  const client_id = process.env.OAUTH_CREDENTIALS_CLIENT_ID;
  const token = {
    "refresh_token": process.env.OAUTH_TOKEN_REFRESH_TOKEN,
    "scope": process.env.OAUTH_TOKEN_SCOPE,
    "token_type": process.env.OAUTH_TOKEN_TYPE,
  }
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
  oAuth2Client.setCredentials(token);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (options) => {
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const { data: { id } } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

export { sendMail };
