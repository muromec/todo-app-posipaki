import React from 'react';
import ReactDOM from 'react-dom/client';
import { Registry } from 'react-pspki';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import App from './App';
import TodoList from './todo/TodoList';
import TodoDetails from './todo/TodoDetails';

import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'development') {

  const { worker } = require('./mocks/browser')

  worker.start({quiet: true});

}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App><TodoList /></App>,
  },
  {
    path: "/todo/:id",
    element: <App><TodoDetails /></App>,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const registry = {};
root.render(
  <Registry value={registry}>
    <RouterProvider router={router} />
  </Registry>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
