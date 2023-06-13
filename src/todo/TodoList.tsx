import './Todo.css';

import { useTodos } from './useTodos';


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
