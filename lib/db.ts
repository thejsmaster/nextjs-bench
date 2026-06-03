import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const PROJECT_ROOT = process.cwd();
const DB_PATH = path.resolve(PROJECT_ROOT, "data/bench.db");

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db: Database.Database | null = null;

const PRODUCT_CATEGORIES = ["Electronics", "Clothing", "Food", "Books", "Sports"];
const USER_ROLES = ["admin", "user", "moderator"];
const ORDER_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function seedIfEmpty(db: Database.Database): void {
  const count = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
  if (count > 0) return;

  console.log("[db] Seeding database with 1000 products, 500 users, 5000 orders...");

  // Products
  const insertProduct = db.prepare("INSERT INTO products (id, name, category, price, stock, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  const seedProducts = db.transaction(() => {
    for (let i = 0; i < 1000; i++) {
      insertProduct.run(randomId(), `Product ${i}`, PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length], Math.round(Math.random() * 1000 * 100) / 100, Math.floor(Math.random() * 500), randomDate(new Date("2023-01-01"), new Date()));
    }
  });
  seedProducts();
  const productIds = db.prepare("SELECT id FROM products").all().map((r: any) => r.id);

  // Users
  const insertUser = db.prepare("INSERT INTO users (id, name, email, role, created_at) VALUES (?, ?, ?, ?, ?)");
  const seedUsers = db.transaction(() => {
    for (let i = 0; i < 500; i++) {
      insertUser.run(randomId(), `User ${i}`, `user${i}@example.com`, USER_ROLES[i % USER_ROLES.length], randomDate(new Date("2023-01-01"), new Date()));
    }
  });
  seedUsers();
  const userIds = db.prepare("SELECT id FROM users").all().map((r: any) => r.id);

  // Orders
  const insertOrder = db.prepare("INSERT INTO orders (id, user_id, product_id, qty, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const seedOrders = db.transaction(() => {
    for (let i = 0; i < 5000; i++) {
      const productId = productIds[Math.floor(Math.random() * productIds.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      insertOrder.run(randomId(), userId, productId, Math.floor(Math.random() * 10) + 1, Math.round(Math.random() * 5000 * 100) / 100, ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)], randomDate(new Date("2024-01-01"), new Date()));
    }
  });
  seedOrders();

  console.log("[db] Seeding complete: 1000 products, 500 users, 5000 orders");
}

export function getDb(): Database.Database {
  if (!_db) {
    const start = Date.now();
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("busy_timeout = 5000");
    initSchema(_db);
    seedIfEmpty(_db);
    const elapsed = Date.now() - start;
    if (elapsed > 100) console.log(`[db] DB ready (${elapsed}ms)`);
  }
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  `);
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
