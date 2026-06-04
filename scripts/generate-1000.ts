#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "components", "1000");
const PAGE_PATH = path.resolve(import.meta.dirname, "..", "pages", "bench-1000.tsx");

function cssFor(n: number): string {
  return `/* Component${String(n).padStart(4, "0")}.module.css */

.app-${n} { max-width: 480px; margin: 1rem auto; padding: 0 0.5rem; }
.header-${n} h1 { font-size: 1.6rem; font-weight: 800; text-align: center; color: #0f172a; margin-bottom: 0.8rem; }

.add-input-${n} {
  width: 100%; padding: 0.45rem 0.6rem;
  border: 1px solid #cbd5e1; border-radius: 5px;
  font-size: 0.9rem; box-sizing: border-box;
}
.add-input--error-${n} { border-color: #e74c3c; }

.add-btn-${n} {
  margin-top: 0.4rem; padding: 0.4rem 1rem;
  background: #0f172a; color: white;
  border: none; border-radius: 5px; cursor: pointer; font-size: 0.85rem;
}

.field-error-${n} { color: #e74c3c; font-size: 0.8rem; margin: 0.2rem 0; }

.filters-${n} { display: flex; gap: 0.4rem; margin: 0.8rem 0; }
.filter-btn-${n} {
  padding: 0.25rem 0.6rem; border: 1px solid #cbd5e1;
  border-radius: 999px; background: white; cursor: pointer; font-size: 0.8rem;
}
.filter-btn--active-${n} { background: #0f172a; color: white; border-color: #0f172a; }

.todo-list-${n} { list-style: none; padding: 0; margin: 0; }
.todo-item-${n} {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
}
.todo-item--done-${n} .todo-text-${n} { text-decoration: line-through; opacity: 0.5; }

.todo-check-${n} {
  width: 1.3rem; height: 1.3rem; border: 2px solid #cbd5e1;
  border-radius: 50%; background: white; cursor: pointer;
  font-size: 0.7rem; flex-shrink: 0;
}
.todo-check--done-${n} { background: #0f172a; border-color: #0f172a; color: white; }

.todo-text-${n} { flex: 1; cursor: pointer; font-size: 0.85rem; }

.todo-delete-${n} {
  background: none; border: none; color: #94a3b8;
  font-size: 1.1rem; cursor: pointer; line-height: 1; padding: 0 0.2rem;
}

.edit-form-${n} { flex: 1; }
.edit-input-${n} {
  width: 100%; padding: 0.25rem 0.4rem;
  border: 1px solid #94a3b8; border-radius: 4px;
  font-size: 0.85rem; box-sizing: border-box;
}

.loading-${n}, .empty-${n} { text-align: center; color: #94a3b8; padding: 1.5rem 0; font-size: 0.85rem; }

.footer-${n} {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0; font-size: 0.8rem; color: #64748b;
}
.clear-btn-${n} {
  background: none; border: none; color: #e74c3c;
  cursor: pointer; font-size: 0.8rem;
}
`;
}

function tsxFor(n: number): string {
  const padded = String(n).padStart(4, "0");
  const name = "Component" + padded;
  return `import { useState, useEffect } from "react";
import styles from "./${name}.module.css";

interface Todo { id: string; text: string; done: boolean; }
type Filter = "all" | "active" | "done";

export default function ${name}() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTodos([
        { id: "1", text: "Buy groceries", done: false },
        { id: "2", text: "Walk the dog", done: true },
        { id: "3", text: "Write some code", done: false },
        { id: "4", text: "Read a book", done: false },
        { id: "5", text: "Clean the house", done: true },
      ]);
      setLoading(false);
    }, 0);
  }, []);

  const add = () => {
    const text = input.trim();
    if (!text) { setError("Text is required"); return; }
    setError("");
    setTodos(t => [{ id: Date.now().toString(), text, done: false }, ...t]);
    setInput("");
  };

  const toggle = (id: string) =>
    setTodos(t => t.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  const remove = (id: string) =>
    setTodos(t => t.filter(todo => todo.id !== id));
  const startEdit = (todo: Todo) => { setEditingId(todo.id); setEditingText(todo.text); };
  const saveEdit = () => {
    if (!editingId) return;
    const text = editingText.trim();
    if (text) setTodos(t => t.map(todo => todo.id === editingId ? { ...todo, text } : todo));
    setEditingId(null);
  };
  const clearCompleted = () => setTodos(t => t.filter(todo => !todo.done));

  const filtered = todos.filter(todo =>
    filter === "active" ? !todo.done : filter === "done" ? todo.done : true
  );
  const activeCount = todos.filter(t => !t.done).length;
  const doneCount = todos.filter(t => t.done).length;

  return (
    <div className={styles["app-${n}"]}>
      <header className={styles["header-${n}"]}>
        <h1>todos — ${name}</h1>
      </header>
      <main>
        <input className={styles["add-input-${n}"] + (error ? " " + styles["add-input--error-${n}"] : "")}
          type="text" placeholder="What needs to be done?" value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          onKeyDown={e => { if (e.key === "Escape") setInput(""); if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <button className={styles["add-btn-${n}"]} onClick={add}>Add</button>
        {error && <p className={styles["field-error-${n}"]}>{error}</p>}

        {todos.length > 0 && (
          <div className={styles["filters-${n}"]}>
            {(["all", "active", "done"] as Filter[]).map(f => (
              <button key={f}
                className={styles["filter-btn-${n}"] + (filter === f ? " " + styles["filter-btn--active-${n}"] : "")}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        )}

        {loading ? <p className={styles["loading-${n}"]}>Loading...</p>
        : filtered.length === 0 ? <p className={styles["empty-${n}"]}>{todos.length === 0 ? "No todos yet." : "No " + filter + " todos."}</p>
        : <ul className={styles["todo-list-${n}"]}>
            {filtered.map(todo => (
              <li key={todo.id} className={styles["todo-item-${n}"] + (todo.done ? " " + styles["todo-item--done-${n}"] : "")}>
                <button className={styles["todo-check-${n}"] + (todo.done ? " " + styles["todo-check--done-${n}"] : "")}
                  onClick={() => toggle(todo.id)} aria-label={todo.done ? "Mark undone" : "Mark done"}>
                  {todo.done ? "\u2713" : ""}
                </button>
                {editingId === todo.id ? (
                  <form className={styles["edit-form-${n}"]} onSubmit={e => { e.preventDefault(); saveEdit(); }}>
                    <input className={styles["edit-input-${n}"]} value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Escape") setEditingId(null); }}
                      onBlur={saveEdit} autoFocus />
                  </form>
                ) : (
                  <span className={styles["todo-text-${n}"]} onDoubleClick={() => startEdit(todo)}>{todo.text}</span>
                )}
                <button className={styles["todo-delete-${n}"]} onClick={() => remove(todo.id)} aria-label="Delete">&times;</button>
              </li>
            ))}
          </ul>}

        {todos.length > 0 && (
          <footer className={styles["footer-${n}"]}>
            <span>{activeCount} item{activeCount === 1 ? "" : "s"} left</span>
            {doneCount > 0 && <button className={styles["clear-btn-${n}"]} onClick={clearCompleted}>Clear ({doneCount})</button>}
          </footer>
        )}
      </main>
    </div>
  );
}
`;
}

console.log("Generating 1000 todo-list components...");
for (let i = 1; i <= 1000; i++) {
  const padded = String(i).padStart(4, "0");
  const dir = path.join(OUT_DIR, "Component" + padded);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "Component" + padded + ".module.css"), cssFor(i));
  fs.writeFileSync(path.join(dir, "Component" + padded + ".tsx"), tsxFor(i));
}

const imports: string[] = [];
const rendered: string[] = [];
for (let i = 1; i <= 1000; i++) {
  const padded = String(i).padStart(4, "0");
  const name = "Component" + padded;
  imports.push('const ' + name + ' = dynamic(() => import("../components/1000/' + name + '/' + name + '"), { ssr: true });');
  rendered.push('          <' + name + ' key="' + name + '" />');
}

fs.writeFileSync(PAGE_PATH,
  'import dynamic from "next/dynamic";\nimport Head from "next/head";\n\n' +
  '// 1000 lazy-loaded todo-list components (SSR: true)\n' +
  imports.join("\n") + '\n\n' +
  'export default function Bench1000Page() {\n' +
  '  return (\n' +
  '    <>\n' +
  '      <Head>\n' +
  '        <title>Next.js 1000 Components</title>\n' +
  '      </Head>\n' +
  '      <div style={{ fontFamily: "system-ui, sans-serif", padding: "0.5rem" }}>\n' +
  '        <h1>Next.js 1000 Components</h1>\n' +
  '        <p style={{ color: "#888", fontSize: "0.85rem" }}>1000 todo-list components via next/dynamic</p>\n' +
  '        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "0.25rem" }}>\n' +
  rendered.join("\n") + '\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </>\n' +
  '  );\n' +
  '}\n'
);

console.log("Done. Generated 1000 components.");
