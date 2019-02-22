import React from 'react';
import ReactDOM, { render } from 'react-dom';

//Apollo GraphQl:
import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

//Redux:
import { createStore } from 'redux';
import { Provider as ReduxProvider} from 'react-redux';
import indexReducer from './reducers/indexReducer';

//Utils:
import { loadSettings } from './util/SettingsStorage';

import App from './components/App';



const storeRedux = createStore(
    indexReducer
);
window.store = storeRedux;

storeRedux.dispatch({
    type:'UPDATE_SETTINGS',
    data: loadSettings(storeRedux.getState())
});


// Initialize CasparCG-State-Scanner GraphQL:

const wsLink = new WebSocketLink({
    uri: "ws://" + storeRedux.getState().settings[0].ipAddress + ":5254/graphql",
    options: {
        reconnect: true
    }
});

const apolloClient = new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all'
        }
    }
});



// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

// Now we can render our application into it
render(
    <ApolloProvider client={apolloClient}>
        <ReduxProvider store={storeRedux}>
            <App />
        </ReduxProvider>
    </ApolloProvider>

    ,
    document.getElementById("root")
)
