// Sends the welcome email via Brevo's HTTPS API (port 443) instead of raw
// SMTP (port 587/465). Many ISPs and networks block outbound SMTP ports,
// which causes ETIMEDOUT errors — the API avoids that entirely since it
// travels over the same port your browser already uses for everything.
import "dotenv/config";

console.log("FRONTEND_URL is:", process.env.FRONTEND_URL);
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendWelcomeEmail = async ({
  to,
  fullName,
  realtorId,
  personalLink,
}) => {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "CP Homes & Properties",
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: to, name: fullName }],
      subject: "Welcome to CPHP — Your Partner Account is Ready",
      htmlContent: `
        <p>Hi ${fullName},</p>
        <p>Your partner registration was successful.</p>
        <p><strong>Your Partner ID:</strong> ${realtorId}</p>
        <p><strong>Your personal referral link:</strong><br/>
        <a href="${personalLink}">${personalLink}</a></p>
        <p>Share this link — anyone who signs up through it is automatically tracked under your account.</p>
      `,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
};
