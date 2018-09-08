import React, { PureComponent, Component, Fragment} from 'react';
import PropTypes  from 'prop-types';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux'

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) return state;
      return {
        ...state,
        completed: !state.completed
      };
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const getVisibleTodos = (todos, visibilityFilter) => {
	switch (visibilityFilter) {
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ALL':
		default:
			return todos;
	}
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
});
 
const Link = ({ active, children, onClick }) => {
  if (active) return <span>{children}</span>;

  return (
    <a
      href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const mapStateToLinkProps = (state, ownProps) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch({
				type: 'SET_VISIBILITY_FILTER',
				filter: ownProps.filter
			});
		}
	};
};

const FilterLink = connect(
	mapStateToLinkProps,
	mapDispatchToLinkProps
)(Link);

const Todo = ({ text, completed, onClick }) => {
  const lineThrough = {
    textDecoration: completed ? 'line-through' : 'none'
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
let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <Fragment>
      <input ref={node => (input = node)} />
      <button
        onClick={() => {
					dispatch({
						type: 'ADD_TODO',
						id: _nextTodoId++,
						text: input.value
					});
					input.value = '';
				}}
      >
        Add Todo
      </button>
    </Fragment>
  );
};
AddTodo = connect()(AddTodo);

const Footer = () => {
  return (
    <p>
      Show:&nbsp;
      <FilterLink filter='SHOW_ALL'>All</FilterLink>
      ,&nbsp;
      <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
      ,&nbsp;
      <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  );
};

const mapStateToTodoListProps = (state) => {
	return {
		todos: getVisibleTodos(
			state.todos,
			state.visibilityFilter
		)
	};
};

const mapDispatchToTodoListProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch({
				type: 'TOGGLE_TODO', 
				id
			})
		}
	};
};

const VisibleTodoList = connect(
	mapStateToTodoListProps,
	mapDispatchToTodoListProps
)(TodoList);

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

const ReactTodo = () => (
	<Provider store={createStore(todoApp)}>
		<TodoApp />
	</Provider>
);

export default ReactTodo;