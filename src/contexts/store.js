
import { configureStore } from '@reduxjs/toolkit';
import buscaReducer from './sliceBusca';

const store = configureStore({
  reducer: {
    busca: buscaReducer,
  },
});

export default store;
