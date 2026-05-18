import { useState } from 'react';
import { useTodos, Priority } from '@/hooks/useTodos';
import { Trash2, Plus, CheckCircle2, Circle, Sparkles } from 'lucide-react';

type Filter = 'all' | 'active' | 'completed';

const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  function handleAdd() {
    addTodo(input, priority);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <Sparkles size={28} color="#6366f1" />
          <h1 style={styles.title}>My Todos</h1>
        </div>

        {/* Input row */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <select
            style={styles.select}
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button style={styles.addBtn} onClick={handleAdd}>
            <Plus size={20} />
          </button>
        </div>

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              style={{
                ...styles.tab,
                ...(filter === f ? styles.tabActive : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <ul style={styles.list}>
          {filtered.length === 0 && (
            <li style={styles.empty}>No todos here 🎉</li>
          )}
          {filtered.map(todo => (
            <li key={todo.id} style={styles.item}>
              <button
                style={styles.iconBtn}
                onClick={() => toggleTodo(todo.id)}
                aria-label="toggle"
              >
                {todo.completed ? (
                  <CheckCircle2 size={22} color="#6366f1" />
                ) : (
                  <Circle size={22} color="#94a3b8" />
                )}
              </button>
              <span
                style={{
                  ...styles.dot,
                  background: PRIORITY_COLORS[todo.priority],
                }}
              />
              <span
                style={{
                  ...styles.todoText,
                  ...(todo.completed ? styles.todoTextDone : {}),
                }}
              >
                {todo.text}
              </span>
              <button
                style={{ ...styles.iconBtn, marginLeft: 'auto' }}
                onClick={() => deleteTodo(todo.id)}
                aria-label="delete"
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.count}>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
          {todos.some(t => t.completed) && (
            <button style={styles.clearBtn} onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    padding: '36px',
    width: '100%',
    maxWidth: '560px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#1e1b4b',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#1e293b',
  },
  select: {
    padding: '10px 8px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#475569',
    background: '#fff',
  },
  addBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
  },
  tab: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '2px solid #e2e8f0',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#6366f1',
    borderColor: '#6366f1',
    color: '#fff',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '120px',
  },
  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '15px',
    padding: '40px 0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    transition: 'background 0.2s',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    flexShrink: 0,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  todoText: {
    fontSize: '15px',
    color: '#1e293b',
    flex: 1,
    wordBreak: 'break-word',
  },
  todoTextDone: {
    textDecoration: 'line-through',
    color: '#94a3b8',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  count: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#6366f1',
    fontWeight: 500,
  },
};
