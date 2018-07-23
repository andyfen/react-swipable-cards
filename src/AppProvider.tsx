import * as React from 'react';

import { ITodo } from "./Interfaces";
import { getStorage, setStorage } from "./localStorage";

export interface IAppState {
	error: string | null;
	loading: boolean;
	todos: ITodo[];
}

export interface IAppContext extends IAppState {
  add: (title: string) => void;
  remove: (id: string) => void;
}

const KEY_LOCALSTORAGE = "todos";

export const TodosContext = React.createContext({});

export default class TodosStore extends React.Component<{}, IAppState, IAppContext> {
	public readonly state: IAppState = {
		error: null,
		loading: false,
		todos: [
      {id: "1", text: "Das Surma" },
      {id: "2", text: "Aerotwist" },
      {id: "3", text: "Kinlanimus Maximus" },
      {id: "4", text: "Addyoooooooooo"},
      {id: "5", text: "Gaunty McGaunty Gaunt" },
      {id: "6", text: "Jack Archibungle" },
      {id: "7", text: "Sam The Dutts Dutton" },
    ]
	};

	public componentDidMount() {
   const cacheState = getStorage(KEY_LOCALSTORAGE);
    if(cacheState){
      this.setState({
        ...cacheState
      });
    } else {
      setStorage(KEY_LOCALSTORAGE, this.state);
    }
	}

	public remove = (id: string) => {
		this.setState((state) => ({
			todos: state.todos.filter((todo) => todo.id !== id)
		}), this.updateStorage);
	};

	public add = (text: string) => {
		const todo = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, ''),
      text,
		};
		this.setState((state) => ({
			todos: [todo, ...state.todos]
    }), this.updateStorage);
	};

	public render() {
    const value = {
      remove: this.remove,
      error: this.state.error,
      loading: this.state.loading,
      todos: this.state.todos,
      add: this.add
    };

		return (
			<TodosContext.Provider value={value}>
				{this.props.children}
			</TodosContext.Provider>
		);
  }
  
  private updateStorage = () => {
    setStorage(KEY_LOCALSTORAGE, this.state);
  };
}