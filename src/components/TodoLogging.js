import React from 'react';
import { createStore } from 'redux';

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
    case 'SET_VISIBILITY_FILTER':
    switch (action.filter) {
      case 'SHOW_COMPLETED':
        return state.completed;
      default:
        return state;
    }
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    case 'SET_VISIBILITY_FILTER':
      switch (action.filter) {
        case 'SHOW_COMPLETED':
          return state.filter(t => todo(t, action));
        default:
          return state;
      }
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

const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](
          state[key], action
        );
        return nextState;
      }, {}
    );
  };
};

const todoApp = combineReducers({
  todos, visibilityFilter
});

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     filter: visibilityFilter(state.visibilityFilter, action)
//   };
// };

const store = createStore(todoApp);
const logState = () => console.log(store.getState());
store.subscribe(logState);

console.log('Initial state:');
logState();
console.log('---------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping'
});

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0,
});

console.log('Dispatching SET_VISIBILITY_FILTER.');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});

const TodoLogging = () => {
  return <h1>Todo logging by console</h1>;
};

export default TodoLogging;
