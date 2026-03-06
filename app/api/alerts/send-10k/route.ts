import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { send10KAlert } from '@/lib/sendgrid-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/alerts/send-10k
 * Sends 10-K alerts to subscribed users
 * Called by GitHub Actions workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ALERTS_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get latest 10-K filings without alert_sent flag
    const { data: newFilings, error: filingError } = await supabase
      .from('filings_10k')
      .select('*, builders!inner(*)')
      .is('alert_sent', null)
      .limit(10);

    if (filingError) throw filingError;

    if (!newFilings || newFilings.length === 0) {
      return NextResponse.json({ message: 'No new filings to alert' });
    }

    let sent = 0;
    let failed = 0;

    // For each new filing
    for (const filing of newFilings) {
      // Get all subscribers
      const { data: subscribers, error: subError } = await supabase
        .from('alert_subscriptions')
        .select('email')
        .eq('active', true);

      if (subError) {
        console.error('Error fetching subscribers:', subError);
        failed++;
        continue;
      }

      // Send alert to each subscriber
      for (const subscriber of subscribers || []) {
        const success = await send10KAlert(subscriber.email, filing.builders, filing);

        if (success) {
          sent++;
        } else {
          failed++;
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Mark filing as alerted
      await supabase
        .from('filings_10k')
        .update({ alert_sent: true })
        .eq('id', filing.id);
    }

    return NextResponse.json({
      message: '10-K alerts sent',
      sent,
      failed,
      filings: newFilings.length,
    });
  } catch (error) {
    console.error('Alert error:', error);
    return NextResponse.json(
      { error: 'Failed to send alerts' },
      { status: 500 }
    );
  }
}
