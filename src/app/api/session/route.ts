import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/modules/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = getSession();
    const loggedIn = !!session.providerTokens.google?.accessToken;
    return NextResponse.json({ loggedIn });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
