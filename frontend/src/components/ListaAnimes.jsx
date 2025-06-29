import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setAnimeSelecionado, setResultados } from '../contexts/sliceBusca';
import CardAnime from './CardAnime';

function ListaAnimes() {
  const resultados = useSelector((state) => state.busca.resultados);
  const animeSelecionado = useSelector((state) => state.busca.animeSelecionado);
  const dispatch = useDispatch();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarAnimes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/animes');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao buscar animes');
        dispatch(setResultados(data));
      } catch (error) {
        console.error('Erro ao buscar animes:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarAnimes();
  }, [dispatch]);

  const formatarData = (dataString) => {
    if (!dataString) return '—';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (carregando) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!resultados.length && !animeSelecionado) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
        <Typography variant="h6" color="white">Nenhum anime encontrado.</Typography>
      </Box>
    );
  }

  if (animeSelecionado) {
    let usuarioId = null;
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        usuarioId = payload?.id;
      }
    } catch (e) {
      console.warn('Erro ao decodificar token:', e.message);
    }

    const animeEhMeu = animeSelecionado.userId === usuarioId;

    const handleDeletarAnime = async () => {
      if (!window.confirm('Deseja realmente deletar este anime?')) return;
      try {
        const res = await fetch(`http://localhost:4000/api/animes/${animeSelecionado.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao deletar o anime.');
        dispatch(setAnimeSelecionado(null));
        dispatch(setResultados((prev) => prev.filter((a) => a.id !== animeSelecionado.id)));
      } catch (err) {
        alert(err.message);
      }
    };

    return (
      <Box minHeight="100vh" bgcolor="#000" color="white" p={4}>
        <Button
          variant="outlined"
          onClick={() => dispatch(setAnimeSelecionado(null))}
          sx={{ mb: 3, borderColor: '#42a5f5', color: '#42a5f5', '&:hover': { borderColor: '#64b5f6', color: '#64b5f6' } }}
        >
          VOLTAR
        </Button>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {animeSelecionado.poster && (
            <Box flexShrink={0}>
              <img
                src={animeSelecionado.poster}
                alt={`Poster de ${animeSelecionado.titulo}`}
                style={{ width: '250px', borderRadius: '8px' }}
              />
            </Box>
          )}

          <Box>
            <Typography variant="h4" color="#42a5f5" gutterBottom>
              {animeSelecionado.titulo}
            </Typography>

            <Typography sx={{ mb: 1 }}><strong>Sinopse:</strong> {animeSelecionado.synopsis || 'Sem sinopse disponível.'}</Typography>
            <Typography><strong>Início:</strong> {formatarData(animeSelecionado.startDate)}</Typography>
            <Typography><strong>Fim:</strong> {formatarData(animeSelecionado.endDate)}</Typography>
            <Typography><strong>Episódios:</strong> {animeSelecionado.episodeCount || '—'}</Typography>
            <Typography><strong>Nota Média:</strong> {animeSelecionado.averageRating || '—'}</Typography>
            <Typography><strong>Status:</strong> {animeSelecionado.dados?.status || '—'}</Typography>

            {animeEhMeu && (
              <Box mt={3} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.href = `/animes/editar/${animeSelecionado.id}`}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeletarAnime}
                >
                  Deletar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#000" color="white" p={4}>
      <Grid container spacing={3} justifyContent="center">
        {resultados.map((anime) => (
          <Grid item key={anime.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <CardAnime
              anime={anime}
              onClick={() => dispatch(setAnimeSelecionado(anime))}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListaAnimes;
