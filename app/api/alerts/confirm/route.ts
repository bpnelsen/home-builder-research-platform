import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/sendgrid-service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/alerts/confirm
 * Sends confirmation email to new subscriber
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    // Get all builders for list in email
    const { data: builders } = await supabase
      .from('builders')
      .select('name')
      .order('name');

    const builderNames = builders?.map((b) => b.name) || [];

    // Send confirmation
    const success = await sendConfirmationEmail(email, builderNames);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Confirmation email sent',
      email,
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation' },
      { status: 500 }
    );
  }
}
