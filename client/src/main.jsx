import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';
import { UniversityProvider } from './contexts/UniversityContext';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <>
        <AuthProvider>
          <UniversityProvider>
            <App />
          </UniversityProvider>
        </AuthProvider>
      </>
    </React.StrictMode>
);
