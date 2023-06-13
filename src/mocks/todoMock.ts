import { rest, RestContext, RestRequest, ResponseComposition } from 'msw'
import { TodoItem, TodoItems } from '../todo/types';

type Error = {
  status: 'ERROR',
};

const ITEMS = [
  {id: '1', name: 'Todo Item 1', description: 'Something to do first'},
  {id: '2', name: 'Todo Item 2', description: 'Next thing to do'},
];

function todoListMock(req: RestRequest, res: ResponseComposition<TodoItems>, ctx:RestContext) {
  return res(
    ctx.status(200),
    ctx.delay(300),
    ctx.json(ITEMS)
  )
}

function todoDetailsMock(req: RestRequest, res: ResponseComposition<TodoItem | Error>, ctx:RestContext) {
  const { id } = req.params
  const details = ITEMS.find(iter=> iter.id === id);
  if (!details) {
    return res(ctx.status(404), ctx.json({ status: 'ERROR'}));
  }
  return res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json(details)
  )
}

export const handlers = [
  rest.get('/api/todo/', todoListMock),
  rest.get('/api/todo/:id/', todoDetailsMock),
]
