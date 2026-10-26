import nodemailer from 'nodemailer';
import { formatPrice, type BookingRow, type EventRow } from './supabase';
import { generateServerTicketPDF } from './generateServerTicketPDF';

/** Server-only: sends the attendee ticket and the internal notification. */

const ADMIN_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || 'abidspersonal55@gmail.com';
const rawSender = process.env.EMAIL_FROM || 'tickets@chutneyandchat.co.uk';
const SENDER_EMAIL = rawSender.match(/<([^>]+)>/)?.[1] || rawSender;

const BRAND = {
  orange: '#EE6422',
  orangeLight: '#FF7B39',
  ink: '#1f1f1f',
  body: '#4a4a4a',
  muted: '#8a8a8a',
  cream: '#FAF0E6',
  creamSoft: '#FFF8F2',
  line: '#F0E2D4',
};

export function getTransporter() {
  const pass = process.env.EMAIL_PASS || process.env.RESEND_API_KEY;
  if (!pass) return null;

  const host = process.env.EMAIL_HOST || (pass.startsWith('re_') ? 'smtp.resend.com' : undefined);
  const user = process.env.EMAIL_USER || (pass.startsWith('re_') ? 'resend' : undefined);

  if (host === 'smtp.resend.com' || pass.startsWith('re_')) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass,
      },
    });
  }

  if (!user) return null;
  const port = Number(process.env.EMAIL_PORT) || 587;

  // If host is explicitly specified OR if email belongs to outlook/office365
  if (host || user.includes('outlook') || user.includes('office365') || user.includes('hotmaill')) {
    return nodemailer.createTransport({
      host: host || 'smtp.office365.com',
      port: port,
      secure: false, // TLS
      auth: { user, pass },
      tls: { ciphers: 'SSLv3' },
    });
  }

  // Default to Gmail service
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
}

export async function sendEmail(opts: SendEmailOptions) {
  const apiKey = (process.env.RESEND_API_KEY || process.env.EMAIL_PASS || '').trim();
  const from = opts.from || `"Chutney & Chat" <${SENDER_EMAIL}>`;

  // Resend HTTPS API (fastest, serverless safe, no SMTP port blockage)
  if (apiKey.startsWith('re_')) {
    const to = Array.isArray(opts.to) ? opts.to : [opts.to];
    const payload: Record<string, any> = {
      from,
      to,
      subject: opts.subject,
      html: opts.html,
    };
    if (opts.text) payload.text = opts.text;
    if (opts.replyTo) payload.reply_to = opts.replyTo;
    if (opts.headers) payload.headers = opts.headers;
    if (opts.attachments && opts.attachments.length > 0) {
      payload.attachments = opts.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : typeof a.content === 'string'
          ? (a.content.startsWith('JVBERi') ? a.content : Buffer.from(a.content).toString('base64'))
          : a.content,
      }));
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errText}`);
    }
    return await res.json();
  }

  // Fallback to Nodemailer transporter
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('No email transporter or API key configured');
  }

  return await transporter.sendMail({
    from,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    headers: opts.headers,
    attachments: opts.attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content) ? a.content : Buffer.from(a.content as string, 'base64'),
      contentType: a.contentType || 'application/pdf',
    })),
  });
}

/** "Wednesday 9 September 2026" */
function formatEventDay(event: EventRow | null): string {
  if (!event?.starts_at) return '';
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date(event.starts_at));
}

/** "6:30pm – 9:30pm" */
function formatEventTime(event: EventRow | null): string {
  if (!event?.starts_at) return '';
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Europe/London',
    })
      .format(new Date(iso))
      .replace(/\s/g, '')
      .toLowerCase();

  const start = fmt(event.starts_at);
  return event.ends_at ? `${start} – ${fmt(event.ends_at)}` : start;
}

/** "28 August 2026 at 14:32" — the timestamp printed on the payment slip. */
function formatPaidAt(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  })
    .format(d)
    .replace(',', ' at');
}

/** Escape user-supplied text before it goes into an HTML email. */
function esc(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * The ticket number shown to the customer.
 *
 * Normally set by the database trigger when the booking is marked paid. The
 * UUID fallback only applies if that migration has not been run yet, so the
 * email still carries something usable rather than nothing.
 */
function ticketNumber(booking: BookingRow): string {
  return booking.ticket_number || `CC-${booking.id.slice(0, 8).toUpperCase()}`;
}

/** Google Calendar "add event" link — works in every mail client. */
function calendarUrl(event: EventRow | null, ticket: string): string | null {
  if (!event?.starts_at) return null;
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end =
    event.ends_at || new Date(new Date(event.starts_at).getTime() + 3 * 3600_000).toISOString();

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(event.starts_at)}/${stamp(end)}`,
    details: `Your ticket number is ${ticket}. Please bring it with you.`,
    location: event.venue || '',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export async function sendBookingEmails(booking: BookingRow, event: EventRow | null) {
  const apiKey = (process.env.RESEND_API_KEY || process.env.EMAIL_PASS || '').trim();
  const hasConfig = apiKey || process.env.EMAIL_USER;
  if (!hasConfig) {
    console.warn('[bookingEmail] Email credentials not set — skipping emails.');
    return;
  }

  const eventTitle = event?.title || 'Chutney & Chat Event';
  const venue = event?.venue || 'Venue to be confirmed';
  const day = formatEventDay(event);
  const time = formatEventTime(event);
  const total = formatPrice(booking.amount_pence, booking.currency);
  const ticket = ticketNumber(booking);
  const calUrl = calendarUrl(event, ticket);
  const isMulti = booking.quantity > 1;
  const isTable = booking.quantity >= 10 || booking.amount_pence === 45000;

  const unitPrice = isTable
    ? '£450.00'
    : formatPrice(
        Math.round(booking.amount_pence / Math.max(booking.quantity, 1)),
        booking.currency
      );

  // Generate official PDF Event Pass with full attendee details
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = generateServerTicketPDF({
      ticketNumber: ticket,
      eventTitle,
      venue,
      date: day || 'TBC',
      time: time || 'Evening',
      total,
      quantity: booking.quantity,
      isTable,
      primaryBuyer: {
        name: booking.name,
        email: booking.email,
        phone: booking.phone || '',
        company: booking.company || '',
        role: booking.role || '',
      },
      guests: Array.isArray(booking.guest_details) ? booking.guest_details : [],
    });
  } catch (pdfErr) {
    console.error('[bookingEmail] Failed to generate ticket PDF:', pdfErr);
  }

  const buyerAttachments = pdfBuffer
    ? [
        {
          filename: `Ticket-${ticket}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ]
    : undefined;

  const mailJobs: Array<() => Promise<unknown>> = [];

  // 1. Primary Buyer Email (Receipt + Ticket + PDF attachment)
  const attendeeHtml = buildTicketEmail({
    name: booking.name,
    eventTitle,
    venue,
    day,
    time,
    ticket,
    quantity: booking.quantity,
    unitPrice,
    total,
    calUrl,
    paidAt: formatPaidAt(booking.paid_at),
    paymentRef: booking.stripe_payment_intent_id,
    email: booking.email,
    phone: booking.phone,
    company: booking.company,
    role: booking.role,
    isTable,
    guests: Array.isArray(booking.guest_details) ? booking.guest_details : [],
    hasAttachment: !!pdfBuffer,
  });

  mailJobs.push(() =>
    sendEmail({
      from: `"Chutney & Chat" <${SENDER_EMAIL}>`,
      to: booking.email,
      subject: `🎟️ Booking Confirmation: ${ticket} — ${eventTitle}`,
      html: attendeeHtml,
      text:
        `Your booking is confirmed.\n\n` +
        `Ticket Reference: ${ticket}\n` +
        `Event: ${eventTitle}\n` +
        (day ? `Date: ${day}${time ? ', ' + time : ''}\n` : '') +
        `Venue: ${venue}\n` +
        `Package: ${isTable ? 'Table of 10 Package (10 guests)' : booking.quantity + ' Ticket(s)'}\n\n` +
        `--- PAYMENT RECEIPT ---\n` +
        `${eventTitle}\n` +
        `${isTable ? 'Table of 10 Package' : unitPrice + ' x ' + booking.quantity}\n` +
        `Total paid: ${total}\n` +
        `Paid on: ${formatPaidAt(booking.paid_at)}\n` +
        `Payment method: Card - via Stripe\n` +
        `Billed to: ${booking.name} <${booking.email}>\n` +
        (booking.stripe_payment_intent_id
          ? `Payment reference: ${booking.stripe_payment_intent_id}\n`
          : '') +
        `\nYour official printable PDF ticket pass has been attached to this email. Please have your ticket reference ready on arrival.\n\n` +
        `Chutney & Chat • https://chutneyandchat.co.uk`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
      },
      attachments: buyerAttachments,
    })
  );

  // 2. Individual guest E-Tickets (if distinct guest emails are provided)
  if (Array.isArray(booking.guest_details) && booking.guest_details.length > 1) {
    booking.guest_details.forEach((guest, index) => {
      // Guest 1 is primary buyer; skip if already sent
      if (index === 0) return;

      const guestEmail = (guest.email || '').trim();
      // Skip if invalid, empty, example.com, or identical to buyer
      if (
        !guestEmail ||
        guestEmail.toLowerCase() === booking.email.toLowerCase() ||
        guestEmail.endsWith('@example.com') ||
        guestEmail.endsWith('@test.com') ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)
      ) {
        return;
      }

      const guestTicketRef = `${ticket}-${index + 1}`;
      const guestCalUrl = calendarUrl(event, guestTicketRef);
      const guestHtml = buildTicketEmail({
        name: guest.name || `Guest #${index + 1}`,
        eventTitle,
        venue,
        day,
        time,
        ticket: guestTicketRef,
        quantity: 1,
        unitPrice,
        total,
        calUrl: guestCalUrl,
        paidAt: formatPaidAt(booking.paid_at),
        paymentRef: booking.stripe_payment_intent_id,
        email: guestEmail,
      });

      mailJobs.push(() =>
        sendEmail({
          from: `"Chutney & Chat" <${SENDER_EMAIL}>`,
          to: guestEmail,
          subject: `🎟️ Your Event Pass: ${guestTicketRef} — ${eventTitle}`,
          html: guestHtml,
          text:
            `Hi ${guest.name || 'Guest'},\n\n` +
            `Your event pass for ${eventTitle} is confirmed.\n\n` +
            `Ticket Reference: ${guestTicketRef}\n` +
            `Venue: ${venue}\n` +
            (day ? `Date: ${day}${time ? ', ' + time : ''}\n` : '') +
            `Attendee: ${guest.name || 'Guest'}\n\n` +
            `Please present this ticket reference on arrival at the door.\n\n` +
            `Chutney & Chat`,
          headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
          },
        })
      );
    });
  }

  // 3. Admin Notification Email
  const adminHtml = buildAdminEmail({ booking, eventTitle, venue, day, ticket, total });
  mailJobs.push(() =>
    sendEmail({
      from: `"Chutney & Chat Bookings" <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: booking.email,
      subject: `🔔 Paid Booking [${isTable ? 'Table of 10' : `${booking.quantity}x Ticket`}]: ${booking.name} — ${ticket}`,
      html: adminHtml,
      attachments: buyerAttachments,
    })
  );

  // Dispatch sequentially with safe 150ms delay to prevent rate limit (429) spikes
  for (let i = 0; i < mailJobs.length; i++) {
    try {
      await mailJobs[i]();
      console.log(`[bookingEmail] Mail #${i + 1}/${mailJobs.length} sent successfully.`);
    } catch (err) {
      console.error(`[bookingEmail] Mail #${i + 1}/${mailJobs.length} failed:`, err);
    }
    if (i < mailJobs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

/**
 * Table-based layout with inline styles throughout — Gmail, Outlook and Apple
 * Mail all strip <style> blocks and ignore flex/grid, so this is the only
 * markup that renders consistently.
 */
function buildTicketEmail(d: {
  name: string;
  eventTitle: string;
  venue: string;
  day: string;
  time: string;
  ticket: string;
  quantity: number;
  unitPrice: string;
  total: string;
  calUrl: string | null;
  paidAt: string;
  paymentRef: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  isTable?: boolean;
  guests?: Array<{ name: string; email?: string; company?: string; role?: string }>;
  hasAttachment?: boolean;
}): string {
  const firstName = esc(d.name.split(' ')[0]);
  const guestsBadge = d.isTable
    ? `<div style="font-size:13px;color:#22A06B;font-weight:bold;margin-top:6px;">Table Package • Accommodates 10 Guests (Includes 3-Course Balti Meal)</div>`
    : d.quantity > 1
    ? `<div style="font-size:13px;color:${BRAND.muted};margin-top:6px;">Admits ${d.quantity} guests</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f2ef;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your booking confirmation and official pass ${esc(d.ticket)} for ${esc(d.eventTitle)} — ${esc(d.venue)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ef;padding:28px 12px;">
    <tr><td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.orangeLight} 0%,${BRAND.orange} 100%);padding:32px 30px;text-align:center;">
            <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.85);margin-bottom:8px;font-weight:600;">Chutney &amp; Chat • Business Network</div>
            <div style="font-size:26px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;">Booking Confirmation</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.9);margin-top:4px;">Official Event Pass &amp; Tax Receipt</div>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:28px 30px 6px 30px;">
            <p style="margin:0 0 8px 0;font-size:16px;color:${BRAND.ink};">Dear ${firstName},</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.body};">
              Thank you for booking with Chutney &amp; Chat. Your order is confirmed and your place is secured for <strong>${esc(d.eventTitle)}</strong>. ${d.hasAttachment ? 'Your official printable PDF ticket pass is attached to this email.' : 'Please keep this confirmation for your records.'}
            </p>
          </td>
        </tr>

        ${
          d.hasAttachment
            ? `<!-- Attachment Notification Banner -->
        <tr>
          <td style="padding:14px 30px 2px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5FBF7;border:1px solid #C3E6D0;border-radius:10px;">
              <tr>
                <td style="padding:12px 16px;">
                  <span style="font-size:16px;vertical-align:middle;">📎</span>
                  <span style="font-size:13px;font-weight:600;color:#18734A;vertical-align:middle;margin-left:8px;">
                    Official PDF Event Pass Attached — Includes full attendee roster &amp; check-in barcodes.
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
            : ''
        }

        <!-- ── TICKET ── -->
        <tr>
          <td style="padding:20px 30px 8px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.creamSoft};border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">

              <!-- ticket number band -->
              <tr>
                <td style="padding:24px 26px 20px 26px;text-align:center;background-color:${BRAND.cream};">
                  <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:8px;font-weight:600;">Official Ticket Reference</div>
                  <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:30px;font-weight:bold;letter-spacing:2px;color:${BRAND.orange};">${esc(d.ticket)}</div>
                  ${guestsBadge}
                </td>
              </tr>

              <!-- perforation -->
              <tr>
                <td style="padding:0 18px;">
                  <div style="border-top:2px dashed ${BRAND.line};font-size:0;line-height:0;">&nbsp;</div>
                </td>
              </tr>

              <!-- details -->
              <tr>
                <td style="padding:22px 26px 24px 26px;">
                  <div style="font-size:18px;font-weight:bold;color:${BRAND.ink};margin-bottom:18px;">${esc(d.eventTitle)}</div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    ${row('Venue / Location', esc(d.venue), true)}
                    ${d.day ? row('Date', esc(d.day)) : ''}
                    ${d.time ? row('Time', esc(d.time)) : ''}
                    ${row('Seating Package', d.isTable ? 'Reserved Table of 10 (10 guests)' : d.quantity === 1 ? '1 Standard Ticket' : `${d.quantity} Standard Tickets`)}
                    ${row('Meal Included', '3-Course Balti Meal (Served during evening)')}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${
          d.guests && d.guests.length > 0
            ? `<!-- ── ATTENDEES ROSTER ── -->
        <tr>
          <td style="padding:16px 30px 8px 30px;">
            <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;font-weight:bold;">
              Table Attendees &amp; Guest Passes (${d.guests.length} Registered)
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.creamSoft};border:1px solid ${BRAND.line};border-radius:10px;overflow:hidden;font-size:13px;">
              <tr style="background-color:${BRAND.cream};font-size:11px;font-weight:bold;color:#73685e;text-transform:uppercase;">
                <td style="padding:8px 12px;width:24px;">#</td>
                <td style="padding:8px 12px;">Attendee Name</td>
                <td style="padding:8px 12px;">Email Address</td>
                <td style="padding:8px 12px;">Company / Role</td>
              </tr>
              ${d.guests
                .map(
                  (g, idx) => `
                <tr style="border-top:1px solid ${BRAND.line};">
                  <td style="padding:8px 12px;color:${BRAND.muted};font-size:11px;">${idx + 1}</td>
                  <td style="padding:8px 12px;font-weight:bold;color:${BRAND.ink};">${esc(g.name || (idx === 0 ? d.name : 'Guest #' + (idx + 1)))}</td>
                  <td style="padding:8px 12px;color:${BRAND.body};font-size:12px;">${esc(g.email || (idx === 0 ? d.email : '—'))}</td>
                  <td style="padding:8px 12px;color:${BRAND.muted};font-size:12px;">${esc([g.company, g.role].filter(Boolean).join(' • ') || (idx === 0 ? [d.company, d.role].filter(Boolean).join(' • ') : '—'))}</td>
                </tr>`
                )
                .join('')}
            </table>
          </td>
        </tr>`
            : ''
        }

        ${
          d.calUrl
            ? `<tr><td style="padding:14px 30px 4px 30px;text-align:center;">
                 <a href="${d.calUrl}" style="display:inline-block;padding:12px 28px;background-color:${BRAND.orange};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Add to Google Calendar</a>
               </td></tr>`
            : ''
        }

        <!-- ── PAYMENT SLIP ── -->
        <tr>
          <td style="padding:22px 30px 6px 30px;">
            <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:12px;font-weight:600;">Tax Invoice &amp; Payment Receipt</div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:12px;">

              <!-- line items -->
              <tr>
                <td style="padding:20px 22px 6px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:0 0 10px 0;color:${BRAND.body};">
                        <strong>${esc(d.eventTitle)}</strong><br>
                        <span style="font-size:12px;color:${BRAND.muted};">${d.isTable ? 'Table of 10 Package (10 Seats)' : `${esc(d.unitPrice)} × ${d.quantity} Ticket(s)`}</span>
                      </td>
                      <td style="padding:0 0 10px 0;text-align:right;color:${BRAND.ink};font-weight:bold;white-space:nowrap;">${esc(d.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- total -->
              <tr>
                <td style="padding:0 22px;">
                  <div style="border-top:1px solid #ececec;font-size:0;line-height:0;">&nbsp;</div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:15px;font-weight:bold;color:${BRAND.ink};">Total Paid</td>
                      <td style="font-size:19px;font-weight:bold;color:${BRAND.orange};text-align:right;white-space:nowrap;">${esc(d.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- meta -->
              <tr>
                <td style="padding:0 22px 18px 22px;">
                  <div style="border-top:1px solid #ececec;padding-top:14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:${BRAND.muted};">
                      ${slipRow('Paid on', esc(d.paidAt))}
                      ${slipRow('Payment method', 'Credit / Debit Card (via Stripe)')}
                      ${slipRow('Cardholder / Billed to', `${esc(d.name)} &lt;${esc(d.email)}&gt;`)}
                      ${d.phone ? slipRow('Phone', esc(d.phone)) : ''}
                      ${d.company ? slipRow('Organisation', esc(d.company)) : ''}
                      ${d.paymentRef ? slipRow('Stripe payment ID', esc(d.paymentRef)) : ''}
                      ${slipRow('Ticket reference', esc(d.ticket))}
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Note -->
        <tr>
          <td style="padding:22px 30px 28px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.creamSoft};border-left:3px solid ${BRAND.orange};border-radius:6px;">
              <tr><td style="padding:14px 18px;font-size:13px;line-height:1.6;color:${BRAND.body};">
                Please retain this confirmation and the attached PDF ticket pass. You may present either the digital PDF or printed pass at the reception desk on arrival.
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#0A0B0E;padding:24px 30px;text-align:center;">
            <div style="font-size:14px;font-weight:bold;color:#ffffff;margin-bottom:6px;">Chutney &amp; Chat</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.55);">Connecting Entrepreneurs &amp; Business Leaders Across the UK • https://chutneyandchat.co.uk</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Small muted key/value line used inside the payment slip. */
function slipRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:3px 0;color:${BRAND.muted};width:44%;vertical-align:top;">${label}</td>
    <td style="padding:3px 0;color:${BRAND.body};text-align:right;word-break:break-all;">${value}</td>
  </tr>`;
}

function row(label: string, value: string, bold = false): string {
  return `<tr>
    <td style="padding:7px 0;color:${BRAND.muted};width:38%;vertical-align:top;">${label}</td>
    <td style="padding:7px 0;color:${BRAND.ink};text-align:right;${bold ? 'font-weight:bold;' : ''}">${value}</td>
  </tr>`;
}

function buildAdminEmail(d: {
  booking: BookingRow;
  eventTitle: string;
  venue: string;
  day: string;
  ticket: string;
  total: string;
}): string {
  const b = d.booking;
  const isTable = b.quantity >= 10 || b.amount_pence === 45000;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f2ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ef;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">

        <tr><td style="background:linear-gradient(135deg,#444 0%,#121212 100%);padding:24px 26px;">
          <div style="font-size:20px;font-weight:bold;color:#ffffff;">New Paid Booking ${isTable ? '(Table of 10)' : ''}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px;">${esc(d.eventTitle)}</div>
        </td></tr>

        <tr><td style="padding:22px 26px;">
          <div style="background-color:${BRAND.creamSoft};border:1px solid ${BRAND.line};border-radius:10px;padding:14px 18px;margin-bottom:20px;text-align:center;">
            <span style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.muted};">Ticket Reference</span><br>
            <span style="font-family:Menlo,Consolas,monospace;font-size:22px;font-weight:bold;color:${BRAND.orange};">${esc(d.ticket)}</span>
            <div style="font-size:12px;color:#22A06B;margin-top:4px;font-weight:bold;">📎 PDF Ticket Pass Attached</div>
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            ${row('Primary Buyer', esc(b.name), true)}
            ${row('Email', `<a href="mailto:${esc(b.email)}" style="color:${BRAND.orange};text-decoration:none;">${esc(b.email)}</a>`)}
            ${row('Phone', esc(b.phone) || '—')}
            ${row('Company', esc(b.company) || '—')}
            ${row('Role', esc(b.role) || '—')}
            ${row('Venue', esc(d.venue))}
            ${d.day ? row('Date', esc(d.day)) : ''}
            ${row('Package / Tickets', isTable ? 'Table of 10 Package (10 seats)' : `${b.quantity} ticket(s)`)}
            ${
              Array.isArray(b.guest_details) && b.guest_details.length > 0
                ? row(
                    `Attendees Breakdown (${b.guest_details.length})`,
                    b.guest_details
                      .map((g, i) => `${i + 1}. <strong>${esc(g.name)}</strong> — ${esc(g.email || 'No email')}${g.company || g.role ? ' (' + esc([g.company, g.role].filter(Boolean).join(' / ')) + ')' : ''}`)
                      .join('<br>')
                  )
                : ''
            }
            ${row('Amount Paid', esc(d.total), true)}
            ${row('Payment Ref', esc(b.stripe_payment_intent_id) || '—')}
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
