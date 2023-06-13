import { Link } from "react-router-dom";

import './Todo.css';

import { useTodos } from './useTodos';
import { TodoItem } from './types';

type Props = {
  item: TodoItem,
}

function TodoListItem( { item } : Props) {
  const url = `/todo/${item.id}/`
  return <li>
    {item.name} <Link to={url}>see details</Link>
  </li>
}


export default function TodoList() {
  const { items, isLoading } = useTodos();

  return <div className="TodoContainer">
    <h2>List</h2>
    <div className="TodoLoader">
      {isLoading ? 'Loading' : ''}
    </div>
    <ul>
    {items.map(item => <TodoListItem key={item.id} item={item} />)}
    </ul>
  </div>
}
