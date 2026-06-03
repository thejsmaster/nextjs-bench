import { getDb } from "../db";

export async function getCategories(): Promise<string[]> {
  const db = getDb();
  return (db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all() as any[]).map(r => r.category);
}

export async function getProductStats(): Promise<{
  total: number;
  avgPrice: number;
  totalStock: number;
  categories: number;
}> {
  const db = getDb();
  const stats = db.prepare(`
    SELECT COUNT(*) as total, AVG(price) as avgPrice, SUM(stock) as totalStock, COUNT(DISTINCT category) as categories
    FROM products
  `).get() as any;
  return {
    total: stats.total,
    avgPrice: Math.round(stats.avgPrice * 100) / 100,
    totalStock: stats.totalStock,
    categories: stats.categories,
  };
}
