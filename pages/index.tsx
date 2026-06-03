import { GetServerSideProps } from "next";
import { getProductStats, getCategories } from "../lib/api/products";
import { getUserStats } from "../lib/api/users";
import { getOrderStats, getRecentOrders, Order } from "../lib/api/orders";

interface DashboardProps {
  productStats: {
    total: number;
    avgPrice: number;
    totalStock: number;
    categories: number;
  };
  categories: string[];
  userStats: {
    total: number;
    adminCount: number;
    userCount: number;
    moderatorCount: number;
  };
  orderStats: {
    total: number;
    totalRevenue: number;
    avgOrderValue: number;
    pendingCount: number;
    shippedCount: number;
    deliveredCount: number;
    cancelledCount: number;
  };
  recentOrders: Order[];
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async () => {
  const [productStats, categories, userStats, orderStats, recentOrders] = await Promise.all([
    getProductStats(),
    getCategories(),
    getUserStats(),
    getOrderStats(),
    getRecentOrders({ limit: 10 }),
  ]);

  return {
    props: { productStats, categories, userStats, orderStats, recentOrders },
  };
};

export default function Dashboard({
  productStats,
  categories,
  userStats,
  orderStats,
  recentOrders,
}: DashboardProps) {
  return (
    <html>
      <head>
        <title>Next.js SSR Benchmark</title>
      </head>
      <body>
        <h1>Next.js SSR Benchmark Dashboard</h1>

        <div className="section">
          <h2>Products</h2>
          <div className="grid">
            <div className="card">
              <h3>Total Products</h3>
              <div className="value">{productStats.total}</div>
            </div>
            <div className="card">
              <h3>Categories</h3>
              <div className="value">{productStats.categories}</div>
            </div>
            <div className="card">
              <h3>Avg Price</h3>
              <div className="value">${productStats.avgPrice}</div>
            </div>
            <div className="card">
              <h3>Total Stock</h3>
              <div className="value">{productStats.totalStock}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Users</h2>
          <div className="grid">
            <div className="card">
              <h3>Total Users</h3>
              <div className="value">{userStats.total}</div>
            </div>
            <div className="card">
              <h3>Admins</h3>
              <div className="value">{userStats.adminCount}</div>
            </div>
            <div className="card">
              <h3>Users</h3>
              <div className="value">{userStats.userCount}</div>
            </div>
            <div className="card">
              <h3>Moderators</h3>
              <div className="value">{userStats.moderatorCount}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Orders</h2>
          <div className="grid">
            <div className="card">
              <h3>Total Orders</h3>
              <div className="value">{orderStats.total}</div>
            </div>
            <div className="card">
              <h3>Revenue</h3>
              <div className="value">${orderStats.totalRevenue}</div>
            </div>
            <div className="card">
              <h3>Avg Order</h3>
              <div className="value">${orderStats.avgOrderValue}</div>
            </div>
            <div className="card">
              <h3>Pending</h3>
              <div className="value">{orderStats.pendingCount}</div>
            </div>
            <div className="card">
              <h3>Shipped</h3>
              <div className="value">{orderStats.shippedCount}</div>
            </div>
            <div className="card">
              <h3>Delivered</h3>
              <div className="value">{orderStats.deliveredCount}</div>
            </div>
            <div className="card">
              <h3>Cancelled</h3>
              <div className="value">{orderStats.cancelledCount}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Categories</h2>
          <ul>
            {categories.map((cat) => (
              <li key={cat}>{cat}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id?.slice(0, 8)}</td>
                  <td>{o.user_name ?? "N/A"}</td>
                  <td>{o.product_name ?? "N/A"}</td>
                  <td>{o.qty}</td>
                  <td>${o.total}</td>
                  <td>{o.status}</td>
                  <td>{o.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <style>{`
          body {
            font-family: system-ui, sans-serif;
            margin: 2rem;
            background: #f5f5f5;
          }
          h1 { color: #333; }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .card h3 {
            margin: 0 0 0.5rem;
            color: #666;
            font-size: 0.875rem;
            text-transform: uppercase;
          }
          .card .value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #222;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 0.5rem 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background: #fafafa;
            font-weight: 600;
          }
          .section { margin: 2rem 0; }
        `}</style>
      </body>
    </html>
  );
}
