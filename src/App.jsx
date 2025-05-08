import React from 'react';
import { Provider } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import store from './contexts/store';
import FormularioBusca from './components/FormularioBusca';
import ListaAnimes from './components/ListaAnimes';

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#000',  
          color: '#fff',
        }}
      >
        <FormularioBusca />
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
          <ListaAnimes />
        </Box>
      </Box>
    </Provider>
  );
}

export default App;
