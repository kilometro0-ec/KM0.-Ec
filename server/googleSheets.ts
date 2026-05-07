import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function updateSheet(sheetId: string, range: string, values: any[][]) {
  console.log(`GoogleSheets: Attempting to update ${range} in ${sheetId}`);
  const authJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!authJson) {
    console.error('GoogleSheets Error: GOOGLE_SERVICE_ACCOUNT_JSON is missing in environment variables.');
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not defined');
  }

  try {
    let credentials;
    let rawContent = authJson.trim();
    
    // 1. Limpieza agresiva: Extraer solo lo que está entre la primera { y la última }
    const firstBrace = rawContent.indexOf('{');
    const lastBrace = rawContent.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No se encontró un bloque JSON válido (falta { o }).");
    }
    
    let rawAuth = rawContent.substring(firstBrace, lastBrace + 1);
    
    // 2. Eliminar posibles bloques de markdown o comillas externas remanentes
    rawAuth = rawAuth.replace(/\\n/g, '[[NEWLINE]]'); // Preservar claves privadas
    rawAuth = rawAuth.replace(/\n/g, ' ');            // Eliminar saltos de línea literales
    rawAuth = rawAuth.replace(/\[\[NEWLINE\]\]/g, '\\n');
    
    // 3. Normalizar comillas y eliminar comas finales antes de llaves de cierre
    rawAuth = rawAuth
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/,\s*}/g, '}') // Eliminar trailing commas: ,} -> }
      .replace(/,\s*\]/g, ']');

    try {
      credentials = JSON.parse(rawAuth);
    } catch (parseError: any) {
      console.error(`GoogleSheets: JSON Parse Error: ${parseError.message}`);
      // Si falla, mostramos el fragmento problemático para diagnóstico
      const posMatch = parseError.message.match(/at position (\d+)/);
      let snippet = "";
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        snippet = rawAuth.substring(Math.max(0, pos - 15), Math.min(rawAuth.length, pos + 15));
      }
      throw new Error(`Error de formato JSON en la credencial. Revisa cerca de: "...${snippet}...". Asegúrate de que el archivo no esté truncado.`);
    }

    console.log(`GoogleSheets: Authenticating as ${credentials.client_email}`);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

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
    console.log(`GoogleSheets: Successfully updated ${range}`);
    return { success: true };
  } catch (error: any) {
    console.error('GoogleSheets API Error:', error.message);
    if (error.message.includes('permission denied')) {
      console.error('ACTION REQUIRED: Share your Google Sheet with the service account email indicated above.');
    }
    if (error.message.includes('not found')) {
      console.error(`ACTION REQUIRED: Ensure the tab name in range "${range}" exists in your Google Sheet.`);
    }
    throw error;
  }
}
