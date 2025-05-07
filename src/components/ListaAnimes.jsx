import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Box, Button } from '@mui/material';
import CardAnime from './CardAnime';
import { setAnimeSelecionado } from '../contexts/sliceBusca';

function ListaAnimes() {
  const resultados = useSelector((state) => state.busca.resultados);
  const animeSelecionado = useSelector((state) => state.busca.animeSelecionado);
  const dispatch = useDispatch();

  if (animeSelecionado) {
    return (
      <Box mt={4}>
        <Button variant="outlined" onClick={() => dispatch(setAnimeSelecionado(null))} sx={{ mb: 2 }}>
          Voltar
        </Button>

        <Typography variant="h4" color="primary" gutterBottom>
          Detalhes do Anime
        </Typography>
        <CardAnime anime={animeSelecionado} modoDetalhe />
      </Box>
    );
  }

  if (!resultados.length) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" color="primary" gutterBottom>
        Resultados
      </Typography>
      <Grid container spacing={3}>
        {resultados.map((anime) => (
          <Grid item xs={12} sm={6} md={4} key={anime.id}>
            <CardAnime anime={anime} onClick={() => dispatch(setAnimeSelecionado(anime))} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListaAnimes;
