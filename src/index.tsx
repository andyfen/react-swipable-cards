import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import AppProvider from "./AppProvider"

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root') as HTMLElement
);

