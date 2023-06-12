import { rest, RestContext, RestRequest, ResponseComposition } from 'msw'
import { TodoItems } from '../todo/types';

const ITEMS = [
  {id: '1', name: 'Todo Item 1'},
];

function todoMock(req: RestRequest, res: ResponseComposition<TodoItems>, ctx:RestContext) {
    return res(
      ctx.status(200),
      ctx.delay(300),
      ctx.json(ITEMS)
    )
}

export const handlers = [
  rest.get('/api/todo/', todoMock)
]
