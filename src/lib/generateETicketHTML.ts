/**
 * Generates an official, pixel-perfect printable E-Ticket document HTML string
 * for primary buyers and guest attendees.
 */

export interface ETicketPrintData {
  ticketNumber: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  total: string;
  primaryBuyer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
  };
  guests: Array<{
    name: string;
    email?: string;
    company?: string;
    role?: string;
  }>;
  paymentRef?: string;
}

export function generateETicketHTML(data: ETicketPrintData): string {
  const primaryName = data.primaryBuyer.name || 'Valued Guest';
  const primaryEmail = data.primaryBuyer.email || '';
  const totalQuantity = Math.max(data.guests.length, 1);

  // Build individual ticket cards for primary buyer + all guests
  const ticketCards = [];

  // Card 1: Primary Buyer
  ticketCards.push({
    refNumber: totalQuantity > 1 ? `${data.ticketNumber}-1` : data.ticketNumber,
    holderName: primaryName,
    holderEmail: primaryEmail,
    roleCompany: [data.primaryBuyer.role, data.primaryBuyer.company].filter(Boolean).join(' at ') || 'Primary Attendee',
    ticketType: `Primary Buyer (Ticket 1 of ${totalQuantity})`,
  });

  // Cards 2..N: Guests
  if (data.guests.length > 1) {
    data.guests.slice(1).forEach((guest, i) => {
      ticketCards.push({
        refNumber: `${data.ticketNumber}-${i + 2}`,
        holderName: guest.name || `Guest #${i + 2}`,
        holderEmail: guest.email || primaryEmail,
        roleCompany: [guest.role, guest.company].filter(Boolean).join(' at ') || 'Guest Attendee',
        ticketType: `Guest Recipient (Ticket ${i + 2} of ${totalQuantity})`,
      });
    });
  }

  const renderedCardsHtml = ticketCards
    .map(
      (tc) => `
      <div class="ticket-card">
        <div class="ticket-header">
          <div class="brand">
            <span class="brand-sub">CHUTNEY &amp; CHAT</span>
            <h1 class="event-title">${esc(data.eventTitle)}</h1>
          </div>
          <div class="ticket-badge">
            <span class="badge-label">OFFICIAL E-TICKET</span>
            <div class="ref-num">${esc(tc.refNumber)}</div>
          </div>
        </div>

        <div class="ticket-body">
          <div class="info-section">
            <div class="grid-row">
              <div class="info-group">
                <span class="label">Ticket Holder / Attendee</span>
                <span class="value-name">${esc(tc.holderName)}</span>
              </div>
              <div class="info-group text-right">
                <span class="label">Ticket Category</span>
                <span class="value-badge">${esc(tc.ticketType)}</span>
              </div>
            </div>

            <div class="grid-row">
              <div class="info-group">
                <span class="label">Venue / Location</span>
                <span class="value">${esc(data.venue || 'TBA')}</span>
              </div>
              <div class="info-group text-right">
                <span class="label">Date &amp; Time</span>
                <span class="value">${esc(data.date)} ${data.time ? ' &bull; ' + esc(data.time) : ''}</span>
              </div>
            </div>

            <div class="grid-row">
              <div class="info-group">
                <span class="label">Delivery Email</span>
                <span class="value-muted">${esc(tc.holderEmail)}</span>
              </div>
              <div class="info-group text-right">
                <span class="label">Role &amp; Company</span>
                <span class="value-muted">${esc(tc.roleCompany)}</span>
              </div>
            </div>
          </div>

          <div class="barcode-stub">
            <div class="qr-box">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#FAF0E6"/>
                <rect x="10" y="10" width="30" height="30" fill="#EE6422"/>
                <rect x="15" y="15" width="20" height="20" fill="#FAF0E6"/>
                <rect x="20" y="20" width="10" height="10" fill="#EE6422"/>
                <rect x="60" y="10" width="30" height="30" fill="#EE6422"/>
                <rect x="65" y="15" width="20" height="20" fill="#FAF0E6"/>
                <rect x="70" y="20" width="10" height="10" fill="#EE6422"/>
                <rect x="10" y="60" width="30" height="30" fill="#EE6422"/>
                <rect x="15" y="65" width="20" height="20" fill="#FAF0E6"/>
                <rect x="20" y="70" width="10" height="10" fill="#EE6422"/>
                <rect x="50" y="50" width="15" height="15" fill="#EE6422"/>
                <rect x="75" y="50" width="15" height="15" fill="#1F1F1F"/>
                <rect x="50" y="75" width="15" height="15" fill="#1F1F1F"/>
                <rect x="70" y="70" width="20" height="20" fill="#EE6422"/>
              </svg>
            </div>
            <div class="stub-code">
              <span class="scan-text">SCAN AT VENUE ENTRANCE</span>
              <span class="code-text">${esc(tc.refNumber)}</span>
              <span class="status-tag">CONFIRMED PASS</span>
            </div>
          </div>
        </div>

        <div class="ticket-footer">
          <span>Master Booking Ref: <strong>${esc(data.ticketNumber)}</strong></span>
          <span>Primary Buyer: <strong>${esc(primaryName)}</strong></span>
          <span>Total Paid: <strong>${esc(data.total)}</strong> (${totalQuantity} ${totalQuantity === 1 ? 'Ticket' : 'Tickets'})</span>
        </div>
      </div>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Official E-Ticket — ${esc(data.eventTitle)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f2ef;
      color: #1f1f1f;
      padding: 30px 20px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .doc-container {
      max-width: 820px;
      margin: 0 auto;
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #E5D5C5;
    }
    .doc-brand {
      font-size: 22px;
      font-weight: 800;
      color: #EE6422;
      letter-spacing: -0.5px;
    }
    .doc-notice {
      font-size: 12px;
      color: #777;
      text-align: right;
    }

    .ticket-card {
      background: #ffffff;
      border: 2px solid #E8D5C4;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      page-break-inside: avoid;
    }

    .ticket-header {
      background: linear-gradient(135deg, #FF7B39 0%, #EE6422 100%);
      color: #ffffff;
      padding: 22px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-sub {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
      display: block;
      margin-bottom: 4px;
    }
    .event-title {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.2;
      margin: 0;
    }
    .ticket-badge {
      text-align: right;
      background: rgba(0,0,0,0.18);
      padding: 8px 16px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.25);
    }
    .badge-label {
      font-size: 9px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      opacity: 0.95;
      display: block;
    }
    .ref-num {
      font-family: 'SF Mono', Menlo, Consolas, monospace;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-top: 2px;
    }

    .ticket-body {
      display: flex;
      padding: 24px 28px;
      gap: 24px;
      background-color: #FAF0E6;
    }
    .info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .grid-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .info-group {
      flex: 1;
    }
    .label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8a8a8a;
      font-weight: 700;
      margin-bottom: 3px;
    }
    .value {
      font-size: 14px;
      font-weight: 600;
      color: #1f1f1f;
    }
    .value-name {
      font-size: 18px;
      font-weight: 800;
      color: #EE6422;
    }
    .value-badge {
      display: inline-block;
      background: #FFF8F2;
      border: 1px solid #F0E2D4;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #333;
    }
    .value-muted {
      font-size: 13px;
      color: #555555;
    }
    .text-right { text-align: right; }

    .barcode-stub {
      width: 140px;
      border-left: 2px dashed #E0D0C0;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .qr-box {
      margin-bottom: 8px;
    }
    .scan-text {
      font-size: 8px;
      letter-spacing: 0.8px;
      color: #777;
      display: block;
      margin-bottom: 2px;
    }
    .code-text {
      font-family: monospace;
      font-size: 11px;
      font-weight: 700;
      color: #EE6422;
      display: block;
    }
    .status-tag {
      font-size: 9px;
      font-weight: 800;
      color: #22a06b;
      background: #E8F7F0;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      display: inline-block;
    }

    .ticket-footer {
      background: #ffffff;
      border-top: 1px solid #F0E2D4;
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #666;
    }

    .doc-rules {
      margin-top: 30px;
      padding: 18px 24px;
      background: #ffffff;
      border: 1px solid #E5D5C5;
      border-radius: 12px;
      font-size: 11px;
      color: #666;
      line-height: 1.6;
    }
    .doc-rules h4 {
      font-size: 12px;
      color: #1f1f1f;
      margin-bottom: 6px;
    }

    @media print {
      body { background: white; padding: 0; }
      .doc-container { width: 100%; max-width: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <div class="doc-header">
      <div class="doc-brand">Chutney &amp; Chat</div>
      <div class="doc-notice">
        Official Event E-Ticket Pass<br>
        Issued on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>

    ${renderedCardsHtml}

    <div class="doc-rules">
      <h4>Entry &amp; Admission Guidelines</h4>
      <p>&bull; Please present this printed E-Ticket or display it on your mobile device at the venue check-in desk.</p>
      <p>&bull; Each ticket contains a unique reference ID and QR code. Unique tickets are issued per guest attendee.</p>
      <p>&bull; For support or booking queries, contact <strong>Chutney &amp; Chat Team</strong>.</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
}

function esc(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
