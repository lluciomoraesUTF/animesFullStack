import React from 'react';
import { Provider } from 'react-redux';
import store from './contexts/store';
import { Container, Typography, Box } from '@mui/material';
import FormularioBusca from './components/FormularioBusca.jsx';
import ListaAnimes from './components/ListaAnimes.jsx';

function App() {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h3" align="center" color="primary" gutterBottom>
              Animes FullStack
          </Typography>
          <FormularioBusca />
          <ListaAnimes />
        </Box>
      </Container>
    </Provider>
  );
}

export default App;
