import { useResource } from 'react-pspki';

import { TodoItems } from './types';
const NO_ITEMS: TodoItems = [];

export function useTodos() {
  const url = new URL('/api/todo/', document.location.origin);
  const { items = NO_ITEMS, isLoading } = useResource<TodoItems>({ url, id: 'todos' });
  return { items, isLoading};
}
