import React from 'react';
import { Provider } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import store from './contexts/store';
import FormularioBusca from './components/FormularioBusca';
import ListaAnimes from './components/ListaAnimes';
import Login from './components/Login';
import Cadastro from './components/Cadastro';

function App() {
  const isAutenticado = !!localStorage.getItem('token');

  return (
    <Provider store={store}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#000', color: '#fff' }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isAutenticado ? (
                  <>
                    <FormularioBusca />
                    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
                      <ListaAnimes />
                    </Box>
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Box>
    </Provider>
  );
}

export default App;
