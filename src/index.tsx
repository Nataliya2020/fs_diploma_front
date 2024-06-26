import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import {Provider} from 'react-redux';

const preloader = document.querySelector(".preloader");

if (preloader !== null) {
  window.onload = function () {
    preloader.classList.add('loaded');
    document.body.style.overflowY = 'scroll';
  }
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
