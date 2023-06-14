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
  remote: Process<FetchArgs<D>, FetchState<D>, FetchMessage<D>, FetchMessage<D>>,
  data: D | null,
};

type RMessage<DataType> =
  { type: 'STOP' } |
  { type: 'EXIT', pid: Symbol } |
  { type: 'OK', data: DataType } |
  { type: 'PATCH', id: string, data: Partial<DataType>};

function* resource<D>(ctx: ProcessCtx<FetchMessage<D> | RMessage<D>, FetchMessage<D>>, { url } : { url: URL }) : Generator<R<D> | null, void, RMessage<D>> {
  const state: R<D> = {
    remote: ctx.fork<FetchArgs<D>, FetchState<D>, FetchMessage<D>, FetchMessage<D>>(xfetch, `${ctx.pname}:fetch`)({ url }),
    data: null,
  };
  yield state;

  while(state) {
    const msg = (yield null) as RMessage<D>;
    if (msg.type === 'OK' && msg.data) {
      state.data = msg.data;
      ctx.toParent(msg);
    }
    if (msg.type === 'EXIT' && state.remote?.id === msg.pid) {
    }
    if (msg.type === 'PATCH' && msg.data) {
      state.data = ({...state.data, ...msg.data}) as D;
      state.remote = ctx.fork<FetchArgs<D>, FetchState<D>, FetchMessage<D>, FetchMessage<D>>(xfetch, `${ctx.pname}:fetch`)({ url, method: 'PUT', body: state.data });
    }
    if (msg.type === 'STOP') {
      break;
    }
  }
}

export function useTodoDetails(id: string): { isLoading: boolean, details: TodoItem | null, patch: (arg: Partial<TodoItem>) => void} {
  const cachedDetails = useCachedDetails(id);
  const url = new URL(`/api/todo/${id}/`, document.location.origin);
  const { pstate: rstate, send } = useProcess(resource<TodoItem>, `todos:${id}`, {url});
  const details: TodoItem | null = rstate?.data || null;
  const isLoading = false;

  function patch(data: Partial<TodoItem>) {
    if (send) {
      send({ type: 'PATCH', id, data});
    }
  }

  return { details: details || cachedDetails || null, isLoading, patch };
}
