declare const google: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function requestAccessToken(onToken: (token: string) => void): void {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (response: { access_token: string }) => {
      onToken(response.access_token);
    },
  });
  client.requestAccessToken();
}
