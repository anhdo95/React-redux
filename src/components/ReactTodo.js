import React, { PureComponent, Fragment } from "react";
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
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map(t => todo(t, action));
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
  ReactDOM.render(
    <ReactTodo {...store.getState()} />,
    document.getElementById("root")
  );
};
store.subscribe(render);

const FilterLink = ({ filter, currentFilter, children, onClick }) => {
  if (filter === currentFilter) return <small>{children}</small>;

  return (
    <a href="#" onClick={(e) => {
			e.preventDefault();
			onClick(filter);
		}}>
      <small>{children}</small>
    </a>
  );
};

const Todo = ({ text, completed, onClick }) => {
  const lineThrough = {
    textDecoration: completed ? "line-through" : "none"
  };
  return (
    <li style={lineThrough} onClick={onClick}>
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
  );
};

const AddTodo = ({ onAddClick }) => {
  let input;
  return (
    <Fragment>
      <input ref={node => (input = node)} />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </Fragment>
  );
};

const Footer = ({ visibilityFilter, onFilterClick }) => {
  return (
    <p>
      Show:&nbsp;
      <FilterLink
        filter="SHOW_ALL"
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
      >
        All
      </FilterLink>
      ,&nbsp;
      <FilterLink
        filter="SHOW_ACTIVE"
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
      >
        Active
      </FilterLink>
      ,&nbsp;
      <FilterLink
        filter="SHOW_COMPLETED"
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
      >
        Completed
      </FilterLink>
    </p>
  );
};

export default class ReactTodo extends PureComponent {
  _nextTodoId = 0;
  constructor(props) {
    super(props);
    this.onAddClick = this.onAddClick.bind(this);
    this.onTodoClick = this.onTodoClick.bind(this);
    this.onFilterClick = this.onFilterClick.bind(this);
  }

  getVisibleTodos(todos, visibilityFilter) {
    switch (visibilityFilter) {
      case "SHOW_ACTIVE":
        return todos.filter(t => !t.completed);
      case "SHOW_COMPLETED":
        return todos.filter(t => t.completed);
      case "SHOW_ALL":
      default:
        return todos;
    }
  }

  onAddClick(text) {
    store.dispatch({
      type: "ADD_TODO",
      id: this._nextTodoId++,
      text
    });
  }

  onTodoClick(id) {
    store.dispatch({
      type: "TOGGLE_TODO",
      id
    });
  }

  onFilterClick(filter) {
    store.dispatch({
      type: "SET_VISIBILITY_FILTER",
      filter
    });
  }

  render() {
    const { todos = [], visibilityFilter } = this.props;
    return (
      <div>
        <AddTodo onAddClick={text => this.onAddClick(text)} />
        <TodoList
          todos={this.getVisibleTodos(todos, visibilityFilter)}
          onTodoClick={this.onTodoClick}
        />
        <Footer
          visibilityFilter={visibilityFilter}
          onFilterClick={filter => this.onFilterClick(filter)}
        />
      </div>
    );
  }
}
