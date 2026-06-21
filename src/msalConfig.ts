import { PublicClientApplication, AuthenticationResult } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID ?? "";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
});

// Resolves with the AuthenticationResult if the page loaded as a redirect
// callback (popup was blocked → MSAL fell back to full-page redirect).
// Resolves with null when there is no pending redirect.
export const msalRedirectResult: Promise<AuthenticationResult | null> = clientId
  ? msalInstance.initialize().then(() => msalInstance.handleRedirectPromise())
  : Promise.resolve(null);

// Ready signal without the result (used before calling loginPopup)
export const msalReady: Promise<void> = msalRedirectResult.then(() => {});

export const isMicrosoftConfigured = !!clientId;
