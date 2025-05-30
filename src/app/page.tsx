'use client';

import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now(),
      title: newTodo.trim(),
      completed: false
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) => todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
      )
    )
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
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 rounded-r"
        >Add
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
                onChange={() => toggleComplete(id)}
              />
              {title}
            </li>
          )
        })}
      </ul>
    </main>
  )
}