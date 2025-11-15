import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';

// 1. IMPORTA TU AUTHPROVIDER (desde el archivo que creamos)
import { AuthProvider } from './context/AuthContext.jsx';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// 2. ENVUELVE <App /> CON EL <AuthProvider>
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);