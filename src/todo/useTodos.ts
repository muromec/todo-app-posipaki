import { Process, ProcessCtx } from 'posipaki';
import { xfetch, FetchState, FetchArgs, FetchMessage } from 'posipaki/dist/xfetch.js';
import { useProcess, useResource } from 'react-posipaki';

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

type R<D> = {
  remote: Process<FetchArgs<D>, FetchState<D>, FetchMessage<D>, FetchMessage<D>> | null,
  data: D | null,
  isLoading: boolean,
};

type RMessage<DataType> =
  FetchMessage<DataType> |
  { type: 'STOP' } |
  { type: 'PATCH', id: string, data: Partial<DataType>};

function* resource<D>(ctx: ProcessCtx<RMessage<D>, FetchMessage<D>>, { url, lazy } : { url: URL, lazy: boolean }) : Generator<R<D> | null, void, RMessage<D>> {
  const state: R<D> = {
    remote: null,
    data: null,
    isLoading: false,
  };
  if (!lazy) {
    state.remote = ctx.fork(xfetch<D>, `${ctx.pname}:fetch`)({ url });
    state.isLoading = true;
  }
  yield state;

  while(state) {
    const msg = (yield null);
    console.log('m', msg);
    if (msg.type === 'OK' && msg.data) {
      state.data = msg.data;
    }
    if (msg.type === 'EXIT' && state.remote?.id === msg.pid) {
      state.remote = null;
      state.isLoading = false;
    }
    if (msg.type === 'PATCH' && msg.data) {
      state.data = ({...state.data, ...msg.data}) as D;
      state.remote = ctx.fork(xfetch<D>, `${ctx.pname}:fetch`)({ url, method: 'PUT', body: state.data });
    }
    if (msg.type === 'STOP') {
      break;
    }
  }
}

export function useTodoDetails(id: string): { isLoading: boolean, details: TodoItem | null, patch: (arg: Partial<TodoItem>) => void} {
  const cachedDetails = useCachedDetails(id);
  const url = new URL(`/api/todo/${id}/`, document.location.origin);
  const { pstate: rstate, send } = useProcess(resource<TodoItem>, `todos:${id}`, {url, lazy: Boolean(cachedDetails)});
  const details: TodoItem | null = rstate?.data || null;
  const isLoading = rstate?.isLoading || false;

  function patch(data: Partial<TodoItem>) {
    if (send) {
      send({ type: 'PATCH', id, data});
    }
  }

  return { details: details || cachedDetails || null, isLoading, patch };
}
