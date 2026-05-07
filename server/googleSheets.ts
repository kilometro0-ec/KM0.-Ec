import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function updateSheet(sheetId: string, range: string, values: any[][]) {
  const authJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!authJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not defined');
  }

  const credentials = JSON.parse(authJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // First, clear the existing data in the range (except headers if we handle them)
    // Actually, simple way: overwrite from A1
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}
