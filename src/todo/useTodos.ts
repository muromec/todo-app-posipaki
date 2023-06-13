import { xfetch, FetchState } from 'pspki/xfetch.js';
import { useProcess } from '../useProcess';

import { TodoItems } from './types';
const NO_ITEMS: TodoItems = [];

export function useTodos() {
  const url = new URL('/api/todo/', document.location.origin);
  const { pstate } = useProcess<FetchState<TodoItems>>(xfetch, 'todos', { url });

  if (!pstate) {
    return { items: NO_ITEMS, isLoading: false };
  }

  return { items: pstate.data || NO_ITEMS, isLoading: pstate.code === 'loading' };
}

