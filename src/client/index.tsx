import React from 'react';
import ReactDom from 'react-dom';

//Redux:
import { Provider as ReduxProvider} from 'react-redux';

//Utils:
import { reduxStore } from '../model/reducers/store'

import App from './components/App';

// Initialize CasparCG:
/*
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

window.apolloClient = apolloClient;
*/

// Now we can render our application into it
ReactDom.render(
        <ReduxProvider store={reduxStore}>
            <App />
        </ReduxProvider>
    ,
    document.getElementById("root")
)
