import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    keyStart: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 5) : null,
    time: new Date().toISOString()
  });
}
