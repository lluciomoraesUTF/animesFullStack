import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarFavorito, limparFavoritos } from '../contexts/sliceFavoritos';
import CardAnime from '../components/CardAnime'; 

function Favoritos() {
  const favoritos = useSelector((state) => state.favoritos.favoritos);
  const [carregando, setCarregando] = useState(true);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const carregarFavoritos = async () => {
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/api/favoritos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(limparFavoritos());
          data.forEach((fav) => dispatch(adicionarFavorito(fav)));
        } else {
          console.error('Erro ao carregar favoritos:', data.error);
        }
      } catch (err) {
        console.error('Erro na requisição de favoritos:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarFavoritos();
  }, [dispatch, token]);

  if (!token) {
    return (
      <Box minHeight="100vh" bgcolor="#000" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" color="white">
          Você precisa estar logado para ver seus favoritos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#000" color="white" p={4}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#42a5f5', fontWeight: 'bold', textAlign: 'center', mb: 4 }}
      >
        Meus Favoritos
      </Typography>

      {carregando ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
          <CircularProgress color="inherit" />
        </Box>
      ) : favoritos.length === 0 ? (
        <Typography align="center" color="gray">
          Nenhum anime favoritado.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {favoritos.map((fav) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={fav.id}>
              <CardAnime 
                anime={fav} 
                isFavorito={true} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Favoritos;