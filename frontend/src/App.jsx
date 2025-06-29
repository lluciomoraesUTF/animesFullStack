import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cadastro from './components/Cadastro';
import Login from './components/Login';
import Favoritos from './components/Favoritos';
import ListaAnimes from './components/ListaAnimes';
import CadastroAnime from './components/CadastroAnime';
import FormularioBusca from './components/FormularioBusca';
import { AuthProvider } from './contexts/sliceAuth';
import EditarAnime from './components/editarAnime';
import { Provider } from 'react-redux';
import store from './contexts/store';
import { Box, GlobalStyles } from '@mui/material';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        {/* Aplica estilo global para remover margens do body/html */}
        <GlobalStyles
          styles={{
            'html, body, #root': {
              margin: 0,
              padding: 0,
              backgroundColor: '#000',
              color: '#fff',
              minHeight: '100vh',
              overflowX: 'hidden',
            },
          }}
        />
        {/* Container principal do app */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#000',
          }}
        >
          <Router>
            <FormularioBusca />
            <Routes>
              <Route path="/" element={<ListaAnimes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/animes/novo" element={<CadastroAnime />} />
              <Route path="/animes/editar/:id" element={<EditarAnime />} />
            </Routes>
          </Router>
        </Box>
      </AuthProvider>
    </Provider>
  );
}

export default App;
