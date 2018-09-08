import React, { PureComponent, Component, Fragment} from "react";
import PropTypes  from 'prop-types';
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
 
const Link = ({ active, children, onClick }) => {
  if (active) return <span>{children}</span>;

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

class FilterLink extends Component {
  componentDidMount() {
		const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
		const { filter, children } = this.props;
		const { store } = this.context;
    const state = store.getState();
    return (
      <Link
        active={filter === state.visibilityFilter}
        onClick={() =>
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter
          })
        }
      >
        {children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
	store: PropTypes.object
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

let _nextTodoId = 0;
const AddTodo = (props, { store }) => {
  let input;
  return (
    <Fragment>
      <input ref={node => (input = node)} />
      <button
        onClick={() => {
          store.dispatch({
						type: "ADD_TODO",
						id: _nextTodoId++,
						text: input.value
					});
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </Fragment>
  );
};
AddTodo.contextTypes = {
	store: PropTypes.object
};

const Footer = () => {
  return (
    <p>
      Show:&nbsp;
      <FilterLink filter="SHOW_ALL">All</FilterLink>
      ,&nbsp;
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
      ,&nbsp;
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
    </p>
  );
};

class VisibleTodoList extends Component {
	componentDidMount() {
		const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  render() {
		const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList
				todos={this.getVisibleTodos(state.todos, state.visibilityFilter)}
				onTodoClick={(id) => store.dispatch({
					type: 'TOGGLE_TODO', 
					id
				})}
      />
    );
  }
}
VisibleTodoList.contextTypes = {
	store: PropTypes.object
};

class TodoApp extends PureComponent {
  render() {
    return (
      <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    );
  }
}

class Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		};
	}

	render() {
		return this.props.children;
	}
}
Provider.childContextTypes = {
	store: PropTypes.object
};

const ReactTodo = () => (
	<Provider store={createStore(todoApp)}>
		<TodoApp />
	</Provider>
);

export default ReactTodo;