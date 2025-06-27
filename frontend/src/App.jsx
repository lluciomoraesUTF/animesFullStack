import React from 'react';
import { Provider } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import store from './contexts/store';
import { AuthProvider, useAuth } from './contexts/sliceAuth';

import FormularioBusca from './components/FormularioBusca';
import ListaAnimes from './components/ListaAnimes';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Favorito from './components/Favoritos';

function Rotas() {
  const { isAutenticado } = useAuth();

  return (
    <Routes>
      {}
      <Route
        path="/"
        element={
          <>
            <FormularioBusca />
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
              <ListaAnimes />
            </Box>
          </>
        }
      />

      {}
      <Route
        path="/favoritos"
        element={isAutenticado ? <Favorito /> : <Navigate to="/login" />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: '#000', color: '#fff' }}>
          <Router>
            <Rotas />
          </Router>
        </Box>
      </AuthProvider>
    </Provider>
  );
}

export default App;
