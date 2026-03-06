/**
 * SendGrid Email Service
 * Handles all email sending for alerts and notifications
 */

import axios from 'axios';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'alerts@builder-research.com';

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  plaintext?: string;
}

/**
 * Send email via SendGrid API
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY not set');
    return false;
  }

  try {
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: { email: FROM_EMAIL, name: 'Builder Research Alerts' },
        content: [
          {
            type: 'text/html',
            value: options.htmlContent,
          },
          ...(options.plaintext
            ? [
                {
                  type: 'text/plain',
                  value: options.plaintext,
                },
              ]
            : []),
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    return false;
  }
}

/**
 * Send 10-K filing alert
 */
export async function send10KAlert(
  email: string,
  builder: { name: string; ticker: string },
  filing: { fiscal_year: number; filing_date: string; summary: string; key_metrics: Record<string, any> }
): Promise<boolean> {
  const filingDate = new Date(filing.filing_date).toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F3A7D; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .metric { background: white; padding: 10px; margin: 10px 0; border-left: 4px solid #06B6D4; }
          .button { background: #0F3A7D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📄 New 10-K Filing: ${builder.name}</h2>
            <p>Fiscal Year ${filing.fiscal_year} • Filed ${filingDate}</p>
          </div>
          
          <div class="content">
            <p>Hi,</p>
            <p>${builder.name} (${builder.ticker}) just filed their FY${filing.fiscal_year} 10-K with the SEC.</p>
            
            <h3>📋 Executive Summary</h3>
            <p>${filing.summary || 'Summary processing in progress...'}</p>
            
            <h3>📊 Key Metrics</h3>
            ${
              filing.key_metrics
                ? Object.entries(filing.key_metrics)
                    .slice(0, 4)
                    .map(([key, value]) => `<div class="metric"><strong>${key}:</strong> ${value}</div>`)
                    .join('')
                : '<p>Metrics coming soon...</p>'
            }
            
            <a href="https://home-builder-research.vercel.app/builders/${builder.ticker}" class="button">View Full Report</a>
            
            <div class="footer">
              <p>You're receiving this because you subscribed to alerts for ${builder.name}.</p>
              <p><a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `📄 ${builder.name} Files FY${filing.fiscal_year} 10-K`,
    htmlContent,
    plaintext: `New 10-K filing: ${builder.name} FY${filing.fiscal_year}\n\n${filing.summary || 'See full report online'}`,
  });
}

/**
 * Send earnings call alert
 */
export async function sendEarningsAlert(
  email: string,
  builder: { name: string; ticker: string },
  call: { fiscal_year: number; fiscal_quarter: number; call_date: string; ai_summary: string; key_highlights: string[] }
): Promise<boolean> {
  const callDate = new Date(call.call_date).toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F3A7D; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .highlight { background: white; padding: 12px; margin: 8px 0; border-left: 4px solid #06B6D4; }
          .button { background: #0F3A7D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📞 Earnings Call: ${builder.name}</h2>
            <p>Q${call.fiscal_quarter} ${call.fiscal_year} • ${callDate}</p>
          </div>
          
          <div class="content">
            <p>Hi,</p>
            <p>${builder.name} (${builder.ticker}) held their Q${call.fiscal_quarter} ${call.fiscal_year} earnings call.</p>
            
            <h3>🎯 Summary</h3>
            <p>${call.ai_summary || 'Summary processing in progress...'}</p>
            
            <h3>✨ Key Highlights</h3>
            ${
              call.key_highlights && call.key_highlights.length > 0
                ? call.key_highlights
                    .slice(0, 5)
                    .map((highlight) => `<div class="highlight">• ${highlight}</div>`)
                    .join('')
                : '<p>Highlights coming soon...</p>'
            }
            
            <a href="https://home-builder-research.vercel.app/builders/${builder.ticker}" class="button">Read Full Transcript</a>
            
            <div class="footer">
              <p>You're receiving this because you subscribed to alerts for ${builder.name}.</p>
              <p><a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `📞 ${builder.name} Q${call.fiscal_quarter} ${call.fiscal_year} Earnings Call`,
    htmlContent,
    plaintext: `Earnings call: ${builder.name} Q${call.fiscal_quarter} ${call.fiscal_year}\n\n${call.ai_summary || 'See full details online'}`,
  });
}

/**
 * Send subscription confirmation
 */
export async function sendConfirmationEmail(email: string, builders: string[]): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #06B6D4; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .builder { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✅ Subscription Confirmed</h2>
          </div>
          
          <div class="content">
            <p>Hi,</p>
            <p>You've successfully subscribed to Home Builder Research alerts!</p>
            
            <h3>📬 You'll receive alerts for:</h3>
            ${builders.map((b) => `<div class="builder">• ${b}</div>`).join('')}
            
            <p style="margin-top: 20px; color: #666;">Alerts include:</p>
            <ul>
              <li>📄 New 10-K filings with AI-generated summaries</li>
              <li>📞 Earnings call announcements</li>
              <li>✨ Key metrics and highlights automatically extracted</li>
            </ul>
            
            <p style="margin-top: 20px;">Thanks for subscribing!</p>
            
            <div class="footer">
              <p><a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '✅ Home Builder Research - Subscription Confirmed',
    htmlContent,
    plaintext: 'You have successfully subscribed to Home Builder Research alerts.',
  });
}

export default {
  sendEmail,
  send10KAlert,
  sendEarningsAlert,
  sendConfirmationEmail,
};
