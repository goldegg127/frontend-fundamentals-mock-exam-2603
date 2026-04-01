import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { server } from './_tosslib/server/browser';
import { BrowserRouter as Router } from 'react-router-dom';
import queryString from 'query-string';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

server.start({ onUnhandledRequest: 'bypass' });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify,
          updateType: 'replaceIn',
        }}
      >
        <App />
      </QueryParamProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
