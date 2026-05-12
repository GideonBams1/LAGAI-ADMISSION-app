// ── Google Identity Services helpers ─────────────────────────────────────────
//
// Setup:
//   1. Go to https://console.cloud.google.com → APIs & Services → Credentials
//   2. Create an OAuth 2.0 Client ID (Web application)
//   3. Add your domain to "Authorised JavaScript origins"
//      - For local dev:  http://localhost:5173
//      - For Vercel:     https://your-app.vercel.app
//   4. Copy the Client ID and add it to your .env file:
//      VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
//   5. Add the same variable in Vercel → Project Settings → Environment Variables
//

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

/**
 * Decode the payload from a Google credential JWT (no library needed).
 * Returns {name, email, sub (googleId), picture} or null on failure.
 */
export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Initialise the Google Identity Services SDK and render Google's standard
 * sign-in button into `containerEl`. `onCredential` receives the decoded
 * Google user payload { name, email, sub, picture }.
 */
export function initGoogleButton(containerEl, onCredential, buttonText = 'continue_with') {
  if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) return
  if (containerEl.hasChildNodes()) return // already rendered

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      const payload = parseJwt(response.credential)
      if (payload?.email) onCredential(payload)
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  })

  window.google.accounts.id.renderButton(containerEl, {
    theme: 'outline',
    size: 'large',
    text: buttonText,
    width: containerEl.offsetWidth || 400,
    logo_alignment: 'center',
  })
}
