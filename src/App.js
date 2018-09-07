import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const createStore = (reducer) => {
  let state, listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    debugger;
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const store = createStore(counter);
const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};
store.subscribe(render);

const Counter = ({ value, onIncrement, onDecrement }) => {
  return (
    <div>
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <Counter 
        value={store.getState()}
        onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
      />
    );
  }
}




export default App;
