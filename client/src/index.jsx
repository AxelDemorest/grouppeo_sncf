import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthContextProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';
import App from './App/App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
);

reportWebVitals();
