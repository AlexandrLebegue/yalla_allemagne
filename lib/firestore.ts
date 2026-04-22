// Firestore REST API helper — no SDK, uses Cloud Run's built-in service account auth.
//
// Setup required:
//   1. Enable Firestore in GCP project (Native mode)
//   2. Give Cloud Run service account roles/datastore.user
//   3. Set GOOGLE_CLOUD_PROJECT env var (auto-set on Cloud Run)
//   4. For local dev: set GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token) in .env.local

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getToken(): Promise<string | null> {
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    return process.env.GOOGLE_ACCESS_TOKEN;
  }
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' }, signal: AbortSignal.timeout(2000) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  } catch {
    return null;
  }
}

export interface LeaderboardEntry {
  id?: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  deckId: string;
  deckTitle: string;
  createdAt: string;
}

function toFirestoreDoc(entry: LeaderboardEntry) {
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

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string };

function fromFirestoreDoc(doc: { name?: string; fields?: Record<string, FirestoreValue> }): LeaderboardEntry {
  const f = doc.fields ?? {};
  const str = (v: FirestoreValue | undefined) =>
    v && 'stringValue' in v ? v.stringValue : '';
  const int = (v: FirestoreValue | undefined) =>
    v && 'integerValue' in v ? parseInt(v.integerValue, 10) : 0;
  const docId = doc.name?.split('/').pop();
  return {
    id: docId,
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
  const results = (await res.json()) as Array<{ document?: { name?: string; fields?: Record<string, FirestoreValue> } }>;
  return results.filter((r) => r.document).map((r) => fromFirestoreDoc(r.document!));
}

export async function addLeaderboardEntry(entry: LeaderboardEntry): Promise<boolean> {
  if (!PROJECT_ID) return false;
  const token = await getToken();
  if (!token) return false;

  const res = await fetch(`${BASE_URL}/leaderboard`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(toFirestoreDoc(entry)),
  });

  return res.ok;
}
