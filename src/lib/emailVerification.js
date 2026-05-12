// ── Email Verification via EmailJS ────────────────────────────────────────────
//
// Setup (free — 200 emails/month):
//   1. Sign up at https://www.emailjs.com
//   2. Email Services → Add New Service → connect your Gmail / Outlook
//   3. Email Templates → Create New Template, set:
//        To Email : {{to_email}}
//        Subject  : Your LAGAI verification code: {{code}}
//        Body (HTML):
//          <p>Hi {{to_name}},</p>
//          <p>Your LAGAI Admissions Portal verification code is:</p>
//          <h1 style="letter-spacing:8px;font-size:36px;">{{code}}</h1>
//          <p>This code expires in <strong>10 minutes</strong>.</p>
//          <p>If you didn't request this, you can safely ignore this email.</p>
//          <p>— LAGAI Admissions Team</p>
//   4. Account → API Keys → copy your Public Key
//   5. Add to .env (and Vercel environment variables):
//        VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//        VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//        VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
//

import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export const CODE_TTL_MS   = 10 * 60 * 1000  // 10 minutes
export const RESEND_WAIT_S = 60               // seconds before user can resend

/** Generate a cryptographically random 6-digit code. */
export function generateCode() {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return String(100000 + (arr[0] % 900000))
}

/**
 * Send the verification code to the user's email.
 * Returns { demo: true } if EmailJS is not configured (shows code on screen instead).
 * Throws on delivery failure.
 */
export async function sendVerificationEmail(toName, toEmail, code) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    // ── Demo / dev mode ──────────────────────────────────────────────────────
    console.info(`[LAGAI Demo] Verification code for ${toEmail}: ${code}`)
    return { demo: true }
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_name: toName, to_email: toEmail, code },
    PUBLIC_KEY
  )

  return { demo: false }
}

/** Partially mask an email for display: j***@gmail.com */
export function maskEmail(email) {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'*'.repeat(Math.max(1, local.length - 2))}@${domain}`
}
