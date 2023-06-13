import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { worker } from './mocks/browser';
import { Registry } from 'react-pspki';

if (process.env.NODE_ENV === 'development') {

  const { worker } = require('./mocks/browser')

  worker.start({quiet: true});

}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Registry value={{}}>
    <App />
  </Registry>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
