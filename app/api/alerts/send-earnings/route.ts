import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEarningsAlert } from '@/lib/sendgrid-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/alerts/send-earnings
 * Sends earnings call alerts to subscribed users
 * Called by GitHub Actions workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ALERTS_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get latest earnings calls without alert_sent flag
    const { data: newCalls, error: callError } = await supabase
      .from('earnings_calls')
      .select('*, builders!inner(*)')
      .is('alert_sent', null)
      .limit(10);

    if (callError) throw callError;

    if (!newCalls || newCalls.length === 0) {
      return NextResponse.json({ message: 'No new earnings calls to alert' });
    }

    let sent = 0;
    let failed = 0;

    // For each new earnings call
    for (const call of newCalls) {
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
        const success = await sendEarningsAlert(subscriber.email, call.builders, call);

        if (success) {
          sent++;
        } else {
          failed++;
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Mark call as alerted
      await supabase
        .from('earnings_calls')
        .update({ alert_sent: true })
        .eq('id', call.id);
    }

    return NextResponse.json({
      message: 'Earnings alerts sent',
      sent,
      failed,
      calls: newCalls.length,
    });
  } catch (error) {
    console.error('Alert error:', error);
    return NextResponse.json(
      { error: 'Failed to send alerts' },
      { status: 500 }
    );
  }
}
