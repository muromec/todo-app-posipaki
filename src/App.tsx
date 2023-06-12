import React from 'react';

import './App.css';
import TodoList from './todo/TodoList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo List
      </header>

      <TodoList />
    </div>
  );
}

export default App;
