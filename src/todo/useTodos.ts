import { useResource } from 'react-posipaki';

import { TodoItem, TodoItems } from './types';
const NO_ITEMS: TodoItems = [];

type ListProps = {
  lazy?: boolean,
};

export function useTodos({ lazy=false }: ListProps = {}) : { isLoading: boolean, items: TodoItems } {
  const url = new URL('/api/todo/', document.location.origin);
  const { items = NO_ITEMS, isLoading } = useResource<TodoItems>({ url, id: 'todos', lazy });
  return { items, isLoading};
}

function useCachedDetails(id: string)  : TodoItem | null {
  const { items } = useTodos({ lazy: true });
  return items.find(iter => iter.id === id) || null;
}

export function useTodoDetails(id: string): { isLoading: boolean, details: TodoItem | null} {
  const cachedDetails = useCachedDetails(id);
  const url = new URL(`/api/todo/${id}/`, document.location.origin);
  const { items: details, isLoading } = useResource<TodoItem>({ url, id: `todos:${id}`, lazy: Boolean(cachedDetails) || !id });
  return { details: cachedDetails || details || null, isLoading };
}
