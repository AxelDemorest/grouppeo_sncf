import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthContextProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';
import App from './app/App';
import './index.css';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
);

reportWebVitals();
