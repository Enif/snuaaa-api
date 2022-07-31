const { google } = require('googleapis');

const client_secret = process.env.OAUTH_CREDENTIALS_CLIENT_SECRET;
const client_id = process.env.OAUTH_CREDENTIALS_CLIENT_ID;
const redirect_uris = ["http://localhost"];

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const getUrl = () => {
  const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: GMAIL_SCOPES,
  });
  return url;
}

const getToken = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
  } catch (err) {
    console.error(err);
  }
}

// console.log(getUrl());
// console.log(getToken(CODE));