import * as React from 'react';
import './App.css';

import TodoList from "./TodoList";
import Input from "./Input";

import { IAppContext, TodosContext } from './AppProvider';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
      	<TodosContext.Consumer>
					{({ error, loading, todos, add, remove }: IAppContext) =>
						error ? (
							'An unexpected error occurred'
						) : loading ? (
							'Loading...'
						) : (
							<div className="App">
                <Input submit={add} />
                <TodoList todos={todos} remove={remove}/>
							</div>
						)}
				</TodosContext.Consumer>

      </div>
    );
  }
}

export default App;
