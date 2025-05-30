'use client';

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    setLoading(true);
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo.trim() }),
    })
    if (res.ok) {
      const todo = await res.json();
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
    }
    setLoading(false);
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    })
    setTodos(
      todos.map((todo) => todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
      )
    )
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter(todo => todo.id !== id))
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Todo List</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow border rounded-1 px-3 py-2"
          placeholder="Add a new todo..."
          disabled={loading}
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 rounded-r"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      <ul>
        {todos.map((todo) => {
          const { id, completed, title } = todo;
          return (
            <li key={id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleComplete(id, !completed)}
                className="mr-2"
              />
              <span className={completed ? 'line-through text-gray-500' : ''}>
                {title}
              </span>
              <button
                onClick={() => deleteTodo(id)}
                className="ml-auto text-red-600 font-bold"
              >X</button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}