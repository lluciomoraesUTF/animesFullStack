
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

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
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
      </AuthProvider>
    </Provider>
  );
}

export default App;
