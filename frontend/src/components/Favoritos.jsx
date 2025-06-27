import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Container,
  Button,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adicionarFavorito, limparFavoritos } from '../contexts/sliceFavoritos';
import { useAuth } from '../contexts/sliceAuth';
import CardAnime from './CardAnime';

function Favoritos() {
  const favoritos = useSelector((state) => state.favoritos.favoritos);
  const [carregando, setCarregando] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/favoritos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(limparFavoritos());
          data.forEach((fav) => {
            dispatch(adicionarFavorito(fav));
          });
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

  const handleLogout = () => {
    dispatch(limparFavoritos());
    logout();
    navigate('/login');
  };

  return (
    <>
      {}
      <AppBar position="static" sx={{ bgcolor: '#1a1a1a', borderRadius: 1 }}>
        <Toolbar>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ textTransform: 'none' }}>
            <Typography variant="h6" sx={{ color: '#42a5f5' }}>
              Animes FullStack
            </Typography>
          </Button>

          <IconButton color="inherit" onClick={() => navigate('/favoritos')} sx={{ marginLeft: 'auto' }}>
            <FavoriteIcon />
          </IconButton>

          <Button onClick={handleLogout} sx={{ color: '#f44336', marginLeft: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Meus Favoritos
        </Typography>

        {carregando ? (
          <Typography color="textSecondary">Carregando favoritos...</Typography>
        ) : favoritos.length === 0 ? (
          <Typography color="textSecondary">Nenhum anime favoritado.</Typography>
        ) : (
          <Grid container spacing={2}>
            {favoritos.map((anime) => (
              <Grid item xs={12} sm={6} md={4} key={anime.animeId || anime.id}>
                <CardAnime anime={anime} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default Favoritos;
