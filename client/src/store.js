import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

const initialSate = {};

const middleware = [thunk]

const store = createStore(rootReducer, initialSate, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
console.log(store)
export default store;