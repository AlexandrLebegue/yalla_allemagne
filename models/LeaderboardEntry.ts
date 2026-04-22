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
