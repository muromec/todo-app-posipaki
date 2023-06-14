import React from 'react';
import { Link, useParams } from "react-router-dom";

import TodoName from './todo/TodoName';
import './App.css';

type Props = {
  children?: React.ReactNode,
};

function App({ children }: Props) {
  const { id } = useParams() as { id: string };
  return (
    <div className="App">
      <header className="App-header">
        {id
          ? <TodoName id={id} />
          : <span>Todo List</span>
        }
      </header>

      { children }

      <footer>
        <Link to="/">List</Link>
        <Link to="/about">About</Link>
      </footer>
    </div>
  );
}

export default App;
