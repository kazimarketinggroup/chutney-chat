import { NextResponse } from 'next/server';
import { getSupabaseAdmin, formatPrice } from '@/lib/supabase';
import { isValidToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Check authorization token from cookie or header
  const cookieToken = req.headers.get('cookie')
    ?.split(';')
    .find((c) => c.trim().startsWith('cc_admin_token='))
    ?.split('=')[1];

  const headerToken = req.headers.get('x-admin-token');
  const token = cookieToken || headerToken;

  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, events(title, venue, starts_at, ends_at)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/bookings] fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings.' }, { status: 500 });
    }

    const items = (bookings || []).map((b) => {
      // Determine primary attendee role from column or guest_details array
      const rawGuestDetails = Array.isArray(b.guest_details) ? b.guest_details : [];
      const primaryRole = b.role || rawGuestDetails[0]?.role || '';

      return {
        id: b.id,
        ticketNumber: b.ticket_number || `CC-${b.id.slice(0, 8).toUpperCase()}`,
        name: b.name,
        email: b.email,
        phone: b.phone || '',
        company: b.company || '',
        role: primaryRole,
        quantity: b.quantity || 1,
        status: b.status,
        amountPence: b.amount_pence,
        amountFormatted: formatPrice(b.amount_pence, b.currency || 'gbp'),
        currency: (b.currency || 'gbp').toUpperCase(),
        eventTitle: b.events?.title || 'Business Networking Evening',
        eventVenue: b.events?.venue || 'Tipu Sultan, Leicester',
        eventDate: b.events?.starts_at || '',
        eventEndsAt: b.events?.ends_at || '',
        stripePaymentIntentId: b.stripe_payment_intent_id || '',
        paidAt: b.paid_at,
        createdAt: b.created_at,
        guestDetails: rawGuestDetails,
      };
    });

    // Compute live stats
    const totalBookings = items.length;
    const paidBookings = items.filter((b) => b.status === 'paid');
    const pendingBookings = items.filter((b) => b.status === 'pending');
    const failedBookings = items.filter((b) => ['failed', 'expired', 'refunded'].includes(b.status));
    const totalRevenuePence = paidBookings.reduce((sum, b) => sum + (b.amountPence || 0), 0);
    const totalTicketsSold = paidBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const uniqueCompanies = new Set(
      paidBookings.map((b) => b.company?.trim().toLowerCase()).filter(Boolean)
    );
    const uniqueEvents = Array.from(new Set(items.map((b) => b.eventTitle).filter(Boolean)));
    const averageOrderValue = paidBookings.length > 0 
      ? formatPrice(Math.round(totalRevenuePence / paidBookings.length), 'gbp')
      : '£0.00';
    const conversionRate = totalBookings > 0
      ? Math.round((paidBookings.length / totalBookings) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: formatPrice(totalRevenuePence, 'gbp'),
        totalRevenuePence,
        totalTicketsSold,
        paidBookingsCount: paidBookings.length,
        pendingBookingsCount: pendingBookings.length,
        failedBookingsCount: failedBookings.length,
        totalBookingsCount: totalBookings,
        averageOrderValue,
        conversionRate,
        uniqueCompaniesCount: uniqueCompanies.size,
        eventsList: uniqueEvents,
      },
      bookings: items,
    });
  } catch (err) {
    console.error('[admin/bookings] error:', err);
    return NextResponse.json({ error: 'Server error loading bookings.' }, { status: 500 });
  }
}
