import { jsPDF } from 'jspdf';

export interface ServerTicketPDFData {
  ticketNumber: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  total: string;
  quantity: number;
  isTable: boolean;
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
}

/**
 * Server-side high-resolution PDF ticket document generator.
 * Emits a cleanly styled A4 event pass listing all guests, ticket references,
 * seating allocation, and primary buyer contact details without text clipping or overlapping.
 */
export function generateServerTicketPDF(data: ServerTicketPDFData): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  // 1. Header Banner
  doc.setFillColor(238, 100, 34); // #EE6422 brand orange
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('CHUTNEY & CHAT — OFFICIAL EVENT PASS', margin, 14);

  doc.setFontSize(18);
  doc.text(data.eventTitle, margin, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 240, 230);
  doc.text(`${data.date}  •  ${data.time}`, margin, 32);

  // Ticket Code Badge in Header
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 54, 9, 54, 24, 3, 3, 'F');
  doc.setTextColor(140, 70, 20);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TICKET REF', pageWidth - margin - 27, 16, { align: 'center' });
  doc.setTextColor(238, 100, 34);
  doc.setFontSize(13);
  doc.text(data.ticketNumber, pageWidth - margin - 27, 26, { align: 'center' });

  // 2. Seating & Event Info Card
  let y = 48;
  doc.setFillColor(255, 248, 242);
  doc.setDrawColor(240, 226, 212);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(115, 104, 94);
  doc.setFont('helvetica', 'bold');
  doc.text('VENUE / LOCATION', margin + 6, y + 7);
  doc.text('SEATING / PACKAGE', margin + 68, y + 7);
  doc.text('TOTAL PAID', margin + 138, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(31, 31, 31);
  doc.text(data.venue, margin + 6, y + 14, { maxWidth: 58 });

  doc.setFont('helvetica', 'bold');
  doc.text(data.isTable ? 'Table of 10 Package' : `${data.quantity} Standard Ticket(s)`, margin + 68, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(34, 160, 107);
  doc.text(data.isTable ? 'Includes 3-Course Balti Meal (10 Guests)' : 'Includes 3-Course Balti Meal', margin + 68, y + 20);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(238, 100, 34);
  doc.text(data.total, margin + 138, y + 16);

  // 3. Primary Buyer Info Card (3 separate non-overlapping columns)
  y = 80;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(228, 228, 228);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(130, 120, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIMARY BUYER & LEAD CONTACT', margin + 6, y + 5.5);

  // Col 1: Buyer Name
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 120);
  doc.text('NAME', margin + 6, y + 11.5);
  doc.setFontSize(9);
  doc.setTextColor(31, 31, 31);
  doc.setFont('helvetica', 'bold');
  doc.text(data.primaryBuyer.name || 'Valued Guest', margin + 6, y + 17, { maxWidth: 45 });

  // Col 2: Contact Info
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(140, 130, 120);
  doc.text('EMAIL & PHONE', margin + 54, y + 11.5);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 31, 31);
  doc.text(data.primaryBuyer.email, margin + 54, y + 16, { maxWidth: 62 });
  if (data.primaryBuyer.phone) {
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(data.primaryBuyer.phone, margin + 54, y + 20.5, { maxWidth: 62 });
  }

  // Col 3: Company & Role
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(140, 130, 120);
  doc.text('COMPANY / ROLE', margin + 120, y + 11.5);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 31, 31);
  const buyerCompany = data.primaryBuyer.company || '—';
  doc.text(buyerCompany, margin + 120, y + 16, { maxWidth: 52 });
  if (data.primaryBuyer.role) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(data.primaryBuyer.role, margin + 120, y + 20.5, { maxWidth: 52 });
  }

  // 4. Attendee & Guest Passes Section
  y = 109;
  const guestCount = data.isTable ? 10 : Math.max(data.guests.length, data.quantity, 1);
  const sectionTitle = data.isTable
    ? 'Table Attendees & Guest Passes (10 Guests Included)'
    : data.quantity === 1
    ? 'Attendee Ticket Pass (1 Guest)'
    : `Event Passes (${guestCount} Guests Included)`;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 31, 31);
  doc.text(sectionTitle, margin, y);

  y += 4.5;
  // Table Header
  doc.setFillColor(242, 235, 227);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 70, 60);

  const colX = {
    num: margin + 2.5,   // width 6
    ref: margin + 9,     // width 27
    name: margin + 37,   // width 42
    email: margin + 80,  // width 48
    comp: margin + 129,  // width 47
  };

  doc.text('#', colX.num, y + 4.8);
  doc.text('PASS REF', colX.ref, y + 4.8);
  doc.text('ATTENDEE NAME', colX.name, y + 4.8);
  doc.text('EMAIL ADDRESS', colX.email, y + 4.8);
  doc.text('COMPANY / ROLE', colX.comp, y + 4.8);

  y += 7;

  // Build guest list:
  // - If single ticket (quantity = 1): exactly 1 row
  // - If quantity = 3: exactly 3 rows
  // - If isTable: 10 rows (filling any unassigned table passes cleanly as Reserved Seat)
  const guestsToRender = data.guests.length > 0
    ? (data.isTable && data.guests.length < 10
        ? [
            ...data.guests,
            ...Array.from({ length: 10 - data.guests.length }, (_, k) => ({
              name: `Reserved Table Seat #${data.guests.length + k + 1}`,
              email: '',
              company: data.primaryBuyer.company || '',
              role: 'Table Guest',
            }))
          ]
        : data.guests)
    : Array.from({ length: guestCount }, (_, i) => ({
        name: i === 0 ? data.primaryBuyer.name : `Guest #${i + 1}`,
        email: i === 0 ? data.primaryBuyer.email : '',
        company: i === 0 ? data.primaryBuyer.company : '',
        role: i === 0 ? data.primaryBuyer.role : 'Guest Pass',
      }));

  guestsToRender.forEach((g, i) => {
    const attendeeName = g.name || (i === 0 ? data.primaryBuyer.name : `Guest #${i + 1}`);
    const emailStr = g.email || (i === 0 ? data.primaryBuyer.email : '—');

    // Split company/role cleanly
    const compParts = [g.company, g.role].filter(Boolean);
    const compRoleText = compParts.join(' • ') || (i === 0 ? 'Lead Attendee' : 'Guest Pass');

    doc.setFontSize(7.5);
    const compLines = doc.splitTextToSize(compRoleText, 46);
    const nameLines = doc.splitTextToSize(attendeeName, 41);
    const maxLines = Math.max(compLines.length, nameLines.length, 1);

    // Dynamic row height so text NEVER overflows or overlaps into another row!
    const rowHeight = maxLines > 1 ? 10.5 : 8;

    const isEven = i % 2 === 0;
    doc.setFillColor(isEven ? 255 : 252, isEven ? 255 : 250, isEven ? 255 : 248);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(240, 235, 230);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    // Number
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 110);
    doc.text(String(i + 1), colX.num, y + 5.2);

    // Pass Ref
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 100, 34);
    const passRef = i === 0 ? data.ticketNumber : `${data.ticketNumber}-${i + 1}`;
    doc.text(passRef, colX.ref, y + 5.2);

    // Attendee Name
    doc.setTextColor(31, 31, 31);
    if (nameLines.length > 1) {
      doc.text(nameLines[0], colX.name, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text(nameLines[1], colX.name, y + 8.2);
    } else {
      doc.text(attendeeName, colX.name, y + 5.2);
    }

    // Email
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(emailStr, colX.email, y + 5.2, { maxWidth: 47 });

    // Company / Role (multi-line safe)
    if (compLines.length > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(compLines[0], colX.comp, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(compLines[1], colX.comp, y + 8.2);
    } else {
      doc.setTextColor(70, 70, 70);
      doc.text(compRoleText, colX.comp, y + 5.2);
    }

    y += rowHeight;
  });

  // 5. Entry Notice Box
  y += 6;
  doc.setFillColor(255, 248, 242);
  doc.setDrawColor(240, 226, 212);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(238, 100, 34);
  doc.text('ADMISSION & ENTRY INSTRUCTIONS', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 70, 60);
  doc.text(`• Present this PDF ticket pass or quote reference ${data.ticketNumber} at the door reception desk.`, margin + 6, y + 11);
  doc.text(
    data.isTable
      ? '• All guests on this table are admitted to the full networking evening, 3-course Balti meal, and awards.'
      : '• Admitted to the full networking evening, 3-course Balti meal, and awards.',
    margin + 6,
    y + 16
  );

  // Footer branding
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text('Chutney & Chat  •  https://chutneyandchat.co.uk  •  Award Winning Business Network', pageWidth / 2, pageHeight - 8, { align: 'center' });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
