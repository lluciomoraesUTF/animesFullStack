import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const carregarFavoritos = createAsyncThunk(
  'favoritos/carregarFavoritos',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/favoritos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erro ao carregar favoritos');

      const dados = await res.json();

      return dados.map(fav => ({
        id: fav.id,             
        animeId: fav.animeId,    
        titulo: fav.titulo,
        poster: fav.anime?.poster,
        startDate: fav.anime?.startDate,
        endDate: fav.anime?.endDate,
        synopsis: fav.anime?.synopsis,
      }));
    } catch (err) {
      return rejectWithValue(err.message); 
    }
  }
);

const sliceFavoritos = createSlice({
  name: 'favoritos',
  initialState: {
    favoritos: [],
    loading: false,
    erro: null,
  },
  reducers: {
    adicionarFavorito: (state, action) => {
      const existe = state.favoritos.find(f => f.animeId === action.payload.animeId);
      if (!existe) state.favoritos.push(action.payload);  
    },
    removerFavorito: (state, action) => {
      state.favoritos = state.favoritos.filter(f => f.id !== action.payload);  
    },
    limparFavoritos: (state) => {
      state.favoritos = [];  
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(carregarFavoritos.pending, (state) => {
        state.loading = true;    
        state.erro = null;       
      })
      .addCase(carregarFavoritos.fulfilled, (state, action) => {
        state.loading = false;   
        state.favoritos = action.payload;  
      })
      .addCase(carregarFavoritos.rejected, (state, action) => {
        state.loading = false;   
        state.erro = action.payload;  
      });
  },
});

export const {
  adicionarFavorito,
  removerFavorito,
  limparFavoritos,
} = sliceFavoritos.actions;

export default sliceFavoritos.reducer;
