import { createStore, applyMiddleware } from "redux";
import contactReducer from "../reducers/contactReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
    contactReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

export default store;
