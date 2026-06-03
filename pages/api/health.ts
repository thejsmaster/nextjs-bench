import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDb();
    const productCount = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
    const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
    const orderCount = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as any).count;
    res.status(200).json({
      status: "ok",
      db: {
        products: productCount,
        users: userCount,
        orders: orderCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err?.message ?? "unknown error" });
  }
}
