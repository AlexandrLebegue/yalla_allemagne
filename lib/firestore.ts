// Firestore REST API — no SDK needed.
// Cloud Run: auth via GCP metadata server (automatic).
// Local dev: set GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token) in .env.local
//
// Setup:
//   1. Enable Firestore (native mode) in GCP project
//   2. Grant Cloud Run SA roles/datastore.user
//   3. GOOGLE_CLOUD_PROJECT is auto-set on Cloud Run

import type { LeaderboardEntry } from '@/models/LeaderboardEntry';

export type { LeaderboardEntry };

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getToken(): Promise<string | null> {
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    return process.env.GOOGLE_ACCESS_TOKEN;
  }
  // Cloud Run metadata server
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' }, signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  } catch {
    return null;
  }
}

type FirestoreValue = { stringValue: string } | { integerValue: string };
type FirestoreDoc = { name?: string; fields?: Record<string, FirestoreValue> };

function toDoc(entry: LeaderboardEntry) {
  return {
    fields: {
      name:       { stringValue: entry.name },
      score:      { integerValue: String(entry.score) },
      total:      { integerValue: String(entry.total) },
      percentage: { integerValue: String(entry.percentage) },
      deckId:     { stringValue: entry.deckId },
      deckTitle:  { stringValue: entry.deckTitle },
      createdAt:  { stringValue: entry.createdAt },
    },
  };
}

function fromDoc(doc: FirestoreDoc): LeaderboardEntry {
  const f = doc.fields ?? {};
  const str = (v?: FirestoreValue) => (v && 'stringValue' in v ? v.stringValue : '');
  const int = (v?: FirestoreValue) => (v && 'integerValue' in v ? parseInt(v.integerValue, 10) : 0);
  return {
    id:         doc.name?.split('/').pop(),
    name:       str(f.name),
    score:      int(f.score),
    total:      int(f.total),
    percentage: int(f.percentage),
    deckId:     str(f.deckId),
    deckTitle:  str(f.deckTitle),
    createdAt:  str(f.createdAt),
  };
}

export async function getLeaderboard(deckId: string, limit = 20): Promise<LeaderboardEntry[]> {
  if (!PROJECT_ID) return [];
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BASE_URL}:runQuery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'leaderboard' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'deckId' },
              op: 'EQUAL',
              value: { stringValue: deckId },
            },
          },
          orderBy: [{ field: { fieldPath: 'percentage' }, direction: 'DESCENDING' }],
          limit,
        },
      }),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const results = (await res.json()) as Array<{ document?: FirestoreDoc }>;
    return results.filter((r) => r.document).map((r) => fromDoc(r.document!));
  } catch {
    return [];
  }
}

export async function addLeaderboardEntry(entry: LeaderboardEntry): Promise<boolean> {
  if (!PROJECT_ID) return false;
  const token = await getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${BASE_URL}/leaderboard`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(toDoc(entry)),
    });
    return res.ok;
  } catch {
    return false;
  }
}
