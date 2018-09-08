import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";

const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) return state;

      return {
        ...state,
        completed: !state.completed
      };
    case "SET_VISIBILITY_FILTER":
      switch (action.filter) {
        case "SHOW_COMPLETED":
          return state.completed;
        default:
          return state;
      }
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map(t => todo(t, action));
    case "SET_VISIBILITY_FILTER":
      switch (action.filter) {
        case "SHOW_COMPLETED":
          return state.filter(t => todo(t, action));
        default:
          return state;
      }
    default:
      return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);
const render = () => {
  ReactDOM.render(<ReactTodo todos={store.getState().todos} />, document.getElementById("root"));
};
store.subscribe(render);
let nextTodoId = 0;

export default class ReactTodo extends PureComponent {
	constructor(props) {
		super(props);
		this.addNewTodo = this.addNewTodo.bind(this);
		this.toggleTodo = this.toggleTodo.bind(this);
	}

	addNewTodo() {
		store.dispatch({
			type: 'ADD_TODO',
			text: this.input.value,
			id: nextTodoId++
		});
		this.input.value = '';
	};

	toggleTodo(id) {
		store.dispatch({
			type: 'TOGGLE_TODO',
			id
		});
	}

  render() {
		const { todos = [] } = this.props;
		
    return (
      <div>
				<input ref={node => this.input = node}  />
        <button onClick={this.addNewTodo}>
					Add Todo
				</button>
				<ul>
					{todos.map(todo => { 
						const lineThrough = {textDecoration: todo.completed ? 'line-through' : 'none'};
						return (
							<li
								style={lineThrough} 
								key={todo.id}
								onClick={() => this.toggleTodo(todo.id)}
							>
								{todo.text}
							</li>
						)
					})}
				</ul>
      </div>
    );
  }
}
