import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, addLeaderboardEntry } from '@/lib/firestore';

export async function GET(req: NextRequest) {
  const deckId = req.nextUrl.searchParams.get('deckId') ?? '';
  if (!deckId) {
    return NextResponse.json({ error: 'deckId required' }, { status: 400 });
  }
  const entries = await getLeaderboard(deckId);
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      score?: number;
      total?: number;
      deckId?: string;
      deckTitle?: string;
    };

    const { name, score, total, deckId, deckTitle } = body;
    if (!name || score == null || total == null || !deckId || !deckTitle) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (name.trim().length < 1 || name.trim().length > 30) {
      return NextResponse.json({ error: 'Name must be 1–30 characters' }, { status: 400 });
    }

    const ok = await addLeaderboardEntry({
      name: name.trim(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      deckId,
      deckTitle,
      createdAt: new Date().toISOString(),
    });

    if (!ok) {
      // Firestore not configured — return graceful failure, not 500
      return NextResponse.json({ error: 'Leaderboard not configured' }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
