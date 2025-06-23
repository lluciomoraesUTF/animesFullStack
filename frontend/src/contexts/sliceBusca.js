
import { createSlice } from '@reduxjs/toolkit';

const sliceBusca = createSlice({
  name: 'busca',
  initialState: {
    query: '',
    resultados: [],
    animeSelecionado: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setResultados: (state, action) => {
      state.resultados = action.payload;
    },
    setAnimeSelecionado: (state, action) => {
      state.animeSelecionado = action.payload;
    },
  },
});

export const { setQuery, setResultados, setAnimeSelecionado } = sliceBusca.actions;
export default sliceBusca.reducer;
