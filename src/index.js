import React from 'react';
import ReactDOM, { render } from 'react-dom';
import App from './components/App';

// Redux:
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import indexReducer from './reducers/indexReducer';

const storeRedux = createStore(indexReducer);

console.log(storeRedux.getState());
// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

// Now we can render our application into it
render(
    <Provider store={storeRedux}>
        <App />
    </Provider>
    ,
    document.getElementById("root")
)
