import { getDb } from "../db";

export async function getUserStats(): Promise<{
  total: number;
  adminCount: number;
  userCount: number;
  moderatorCount: number;
}> {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as adminCount,
      SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as userCount,
      SUM(CASE WHEN role = 'moderator' THEN 1 ELSE 0 END) as moderatorCount
    FROM users
  `).get() as any;
  return stats;
}
