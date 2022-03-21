import Shell from '@dhis2/app-shell'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    {/**
      * --> WARNING! <--
      * ================
      *
      * Do not use the `<Shell />` component in your app.
      * This file is purely for development purposes, the app will later be
      * wrapped with the dhis2's app-shell automatically
      */}
    <Shell>
      <App />
    </Shell>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
