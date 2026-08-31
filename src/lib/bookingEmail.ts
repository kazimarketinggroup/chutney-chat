import nodemailer from 'nodemailer';
import { formatPrice, type BookingRow, type EventRow } from './supabase';

/** Server-only: sends the attendee ticket and the internal notification. */

const ADMIN_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || 'officialmdmahadi@gmail.com';

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

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
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
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[bookingEmail] EMAIL_USER/EMAIL_PASS not set — skipping emails.');
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

  const unitPrice = formatPrice(
    Math.round(booking.amount_pence / Math.max(booking.quantity, 1)),
    booking.currency
  );

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
  });

  const adminHtml = buildAdminEmail({ booking, eventTitle, venue, day, ticket, total });

  await Promise.allSettled([
    transporter.sendMail({
      from: `"Chutney & Chat" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `Your ticket ${ticket} — ${eventTitle}`,
      html: attendeeHtml,
      text:
        `Your booking is confirmed.\n\n` +
        `Ticket number: ${ticket}\n` +
        `Event: ${eventTitle}\n` +
        (day ? `Date: ${day}${time ? ', ' + time : ''}\n` : '') +
        `Venue: ${venue}\n` +
        `Tickets: ${booking.quantity}\n\n` +
        `--- PAYMENT RECEIPT ---\n` +
        `${eventTitle}\n` +
        `${unitPrice} x ${booking.quantity}\n` +
        `Total paid: ${total}\n` +
        `Paid on: ${formatPaidAt(booking.paid_at)}\n` +
        `Payment method: Card - via Stripe\n` +
        `Billed to: ${booking.email}\n` +
        (booking.stripe_payment_intent_id
          ? `Payment reference: ${booking.stripe_payment_intent_id}\n`
          : '') +
        `\nPlease bring your ticket number with you${isMulti ? ' — it covers all ' + booking.quantity + ' guests' : ''}.\n\n` +
        `Chutney & Chat`,
    }),
    transporter.sendMail({
      from: `"Chutney & Chat Bookings" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: booking.email,
      subject: `New booking ${ticket} — ${booking.name} — ${eventTitle}`,
      html: adminHtml,
    }),
  ]);
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

/**
 * Table-based layout with inline styles throughout — Gmail, Outlook and Apple
 * Mail all strip <style> blocks and ignore flex/grid, so this is the only
 * markup that renders consistently. The perforated edge is drawn with a
 * dashed border rather than an image so it survives image-blocking.
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
}): string {
  const firstName = esc(d.name.split(' ')[0]);
  const guests =
    d.quantity > 1
      ? `<div style="font-size:13px;color:${BRAND.muted};margin-top:6px;">Admits ${d.quantity} guests</div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f2ef;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your ticket ${esc(d.ticket)} for ${esc(d.eventTitle)} — ${esc(d.venue)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ef;padding:28px 12px;">
    <tr><td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.orangeLight} 0%,${BRAND.orange} 100%);padding:34px 30px;text-align:center;">
            <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.85);margin-bottom:8px;">Chutney &amp; Chat</div>
            <div style="font-size:27px;font-weight:bold;color:#ffffff;">You're booked in!</div>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:28px 30px 6px 30px;">
            <p style="margin:0 0 8px 0;font-size:16px;color:${BRAND.ink};">Hi ${firstName},</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.body};">
              Your payment went through and your place is confirmed. Here's your ticket — please have the number ready on the door.
            </p>
          </td>
        </tr>

        <!-- ── TICKET ── -->
        <tr>
          <td style="padding:24px 30px 8px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.creamSoft};border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">

              <!-- ticket number band -->
              <tr>
                <td style="padding:24px 26px 20px 26px;text-align:center;background-color:${BRAND.cream};">
                  <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:10px;">Ticket Number</div>
                  <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:30px;font-weight:bold;letter-spacing:2px;color:${BRAND.orange};">${esc(d.ticket)}</div>
                  ${guests}
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
                  <div style="font-size:19px;font-weight:bold;color:${BRAND.ink};margin-bottom:18px;">${esc(d.eventTitle)}</div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    ${row('Venue', esc(d.venue), true)}
                    ${d.day ? row('Date', esc(d.day)) : ''}
                    ${d.time ? row('Time', esc(d.time)) : ''}
                    ${row('Admits', d.quantity === 1 ? '1 guest' : `${d.quantity} guests`)}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${
          d.calUrl
            ? `<tr><td style="padding:14px 30px 4px 30px;text-align:center;">
                 <a href="${d.calUrl}" style="display:inline-block;padding:13px 30px;background-color:${BRAND.orange};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">Add to calendar</a>
               </td></tr>`
            : ''
        }

        <!-- ── PAYMENT SLIP ── -->
        <tr>
          <td style="padding:26px 30px 6px 30px;">
            <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${BRAND.muted};margin-bottom:12px;">Payment Receipt</div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:12px;">

              <!-- line items -->
              <tr>
                <td style="padding:20px 22px 6px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:0 0 10px 0;color:${BRAND.body};">
                        ${esc(d.eventTitle)}<br>
                        <span style="font-size:12px;color:${BRAND.muted};">${esc(d.unitPrice)} × ${d.quantity}</span>
                      </td>
                      <td style="padding:0 0 10px 0;text-align:right;color:${BRAND.ink};white-space:nowrap;">${esc(d.total)}</td>
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
                      <td style="font-size:15px;font-weight:bold;color:${BRAND.ink};">Total paid</td>
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
                      ${slipRow('Payment method', 'Card — via Stripe')}
                      ${slipRow('Billed to', esc(d.email))}
                      ${d.paymentRef ? slipRow('Payment reference', esc(d.paymentRef)) : ''}
                      ${slipRow('Ticket number', esc(d.ticket))}
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
                Keep this email — your ticket number is your entry. If anything changes, just reply and we'll sort it.
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#0A0B0E;padding:24px 30px;text-align:center;">
            <div style="font-size:14px;font-weight:bold;color:#ffffff;margin-bottom:6px;">Chutney &amp; Chat</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.55);">Informal &nbsp;|&nbsp; Educational &nbsp;|&nbsp; Connection</div>
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
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f2ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2ef;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">

        <tr><td style="background:linear-gradient(135deg,#444 0%,#121212 100%);padding:24px 26px;">
          <div style="font-size:20px;font-weight:bold;color:#ffffff;">New Paid Booking</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px;">${esc(d.eventTitle)}</div>
        </td></tr>

        <tr><td style="padding:22px 26px;">
          <div style="background-color:${BRAND.creamSoft};border:1px solid ${BRAND.line};border-radius:10px;padding:14px 18px;margin-bottom:20px;text-align:center;">
            <span style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.muted};">Ticket</span><br>
            <span style="font-family:Menlo,Consolas,monospace;font-size:22px;font-weight:bold;color:${BRAND.orange};">${esc(d.ticket)}</span>
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            ${row('Name', esc(b.name), true)}
            ${row('Email', `<a href="mailto:${esc(b.email)}" style="color:${BRAND.orange};text-decoration:none;">${esc(b.email)}</a>`)}
            ${row('Phone', esc(b.phone) || '—')}
            ${row('Company', esc(b.company) || '—')}
            ${row('Role', esc(b.role) || '—')}
            ${row('Venue', esc(d.venue))}
            ${d.day ? row('Date', esc(d.day)) : ''}
            ${row('Tickets', String(b.quantity))}
            ${row('Amount', esc(d.total), true)}
            ${row('Payment ref', esc(b.stripe_payment_intent_id) || '—')}
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
