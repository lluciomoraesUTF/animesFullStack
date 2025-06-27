import { createSlice } from '@reduxjs/toolkit';

const sliceFavoritos = createSlice({
  name: 'favoritos',
  initialState: {
    favoritos: [],
  },
  reducers: {
    adicionarFavorito: (state, action) => {
      const existe = state.favoritos.find(f => f.animeId === action.payload.animeId);
      if (!existe) state.favoritos.push(action.payload);
    },
    removerFavorito: (state, action) => {
      state.favoritos = state.favoritos.filter(f => f.animeId !== action.payload);
    },
    limparFavoritos: (state) => {
      state.favoritos = [];
    },
  },
});

export const { adicionarFavorito, removerFavorito, limparFavoritos } = sliceFavoritos.actions;
export default sliceFavoritos.reducer;
