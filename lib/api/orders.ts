import { getDb } from "../db";

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  qty: number;
  total: number;
  status: string;
  created_at: string;
  user_name?: string;
  product_name?: string;
}

export async function getOrderStats(): Promise<{
  total: number;
  totalRevenue: number;
  avgOrderValue: number;
  pendingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
}> {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(total) as totalRevenue,
      AVG(total) as avgOrderValue,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCount,
      SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shippedCount,
      SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as deliveredCount,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledCount
    FROM orders
  `).get() as any;
  return {
    ...stats,
    totalRevenue: Math.round(stats.totalRevenue * 100) / 100,
    avgOrderValue: Math.round(stats.avgOrderValue * 100) / 100,
  };
}

export async function getRecentOrders(payload: { limit?: number }): Promise<Order[]> {
  const db = getDb();
  const limit = Math.min(payload.limit ?? 10, 50);
  return db.prepare(`
    SELECT o.*, u.name as user_name, p.name as product_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN products p ON p.id = o.product_id
    ORDER BY o.created_at DESC LIMIT ?
  `).all(limit) as Order[];
}
