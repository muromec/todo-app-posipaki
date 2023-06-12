import { setupWorker } from 'msw'

import { handlers } from './todoMock';


export const worker = setupWorker(...handlers)
