import { useState, useEffect } from 'react';
import './Todo.css';
import { TodoItems } from './types';

const NO_ITEMS: TodoItems = [];

function useTodos() {
  const [ resource, setResource ] = useState<TodoItems | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/todo/');
      if (res.ok) {
        const data = await res.json();
        setResource(data);
      } else {
        setResource(null);
      }
    }
    async function tryLoad() {
      setIsLoading(true);
      try {
        await load();
      } finally {
        setIsLoading(false);
      }
    }
    tryLoad();
  }, []);

  return { items: resource || NO_ITEMS, isLoading };
}

export default function TodoList() {
  const { items, isLoading } = useTodos();

  return <div className="TodoContainer">
    <h2>List</h2>
    <div className="TodoLoader">
      {isLoading ? 'Loading' : ''}
    </div>
    <ul>
    {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  </div>
}
