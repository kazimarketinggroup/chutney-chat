import { generateETicketHTML, ETicketPrintData } from './generateETicketHTML';

/**
 * Directly generates and downloads an official, high-resolution E-Ticket PDF file
 * without opening the browser's print dialog or popup window.
 */
export async function downloadTicketPDF(data: ETicketPrintData): Promise<void> {
  // Dynamically import jsPDF and html2canvas on client side
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const html = generateETicketHTML(data, { autoPrint: false });

  // Create an off-screen container in document.body
  const container = document.createElement('div');
  container.id = '__ticket_pdf_temp_container__';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '820px';
  container.style.zIndex = '-999999';
  container.style.pointerEvents = 'none';
  container.style.backgroundColor = '#ffffff';

  // Parse HTML string to safely extract styles and the document container
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(html, 'text/html');
  const styleEl = parsedDoc.querySelector('style');
  const docContainer = parsedDoc.querySelector('.doc-container');

  if (styleEl) {
    container.appendChild(styleEl);
  }
  if (docContainer) {
    container.appendChild(docContainer);
  } else {
    container.innerHTML = html;
  }

  document.body.appendChild(container);

  try {
    // Wait for fonts and DOM layout to be fully ready
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));

    const renderTarget =
      (container.querySelector('.doc-container') as HTMLElement) || container;

    const canvas = await html2canvas(renderTarget, {
      scale: 2, // High DPI / retina resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 840,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Initialize A4 portrait PDF document (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      // Single page document
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
    } else {
      // Multi-page document handling for orders with multiple guest tickets
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    // Direct browser download
    const cleanRef = (data.ticketNumber || 'TICKET').replace(/[^a-zA-Z0-9-_]/g, '_');
    pdf.save(`Chutney-and-Chat-Ticket-${cleanRef}.pdf`);
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
