import React from 'react';
import { Provider } from 'react-redux';
import { Container, Typography } from '@mui/material';
import store from './contexts/store';
import FormularioBusca from './components/FormularioBusca';
import ListaAnimes from './components/ListaAnimes';

function App() {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        
        <FormularioBusca />
        <ListaAnimes />
      </Container>
    </Provider>
  );
}

export default App;
