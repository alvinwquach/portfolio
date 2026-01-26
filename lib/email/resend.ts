/**
 * Resend Email Configuration
 * ==========================
 * Email sending utilities using Resend API
 */

import { Resend } from 'resend';

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Send a contact form email
 */
export async function sendContactEmail(
  data: ContactEmailData,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  const { name, email, subject, message } = data;

  try {
    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: subject || `New contact from ${name}`,
      text: formatContactEmailText(data),
      html: formatContactEmailHtml(data),
      replyTo: email,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format contact email as plain text
 */
function formatContactEmailText(data: ContactEmailData): string {
  return `
New Contact Form Submission
===========================

Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}` : ''}

Message:
${data.message}
  `.trim();
}

/**
 * Format contact email as HTML
 */
function formatContactEmailHtml(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1D428A 0%, #2B5AA8 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
  </div>

  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #666;">Name:</strong><br>
          <span style="font-size: 16px;">${escapeHtml(data.name)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #666;">Email:</strong><br>
          <a href="mailto:${escapeHtml(data.email)}" style="color: #1D428A; text-decoration: none; font-size: 16px;">${escapeHtml(data.email)}</a>
        </td>
      </tr>
      ${data.subject ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #666;">Subject:</strong><br>
          <span style="font-size: 16px;">${escapeHtml(data.subject)}</span>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 12px 0;">
          <strong style="color: #666;">Message:</strong><br>
          <div style="margin-top: 8px; padding: 16px; background: white; border-radius: 4px; border: 1px solid #e0e0e0; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
        </td>
      </tr>
    </table>
  </div>

  <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
    This email was sent from your portfolio contact form.
  </p>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
