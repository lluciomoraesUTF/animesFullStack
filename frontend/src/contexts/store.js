import { configureStore } from '@reduxjs/toolkit';
import buscaReducer from './sliceBusca';
import favoritosReducer from './sliceFavoritos';
const store = configureStore({
  reducer: {
    busca: buscaReducer,
    favoritos: favoritosReducer, 
  },
});

export default store;
