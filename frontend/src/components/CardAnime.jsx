import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Snackbar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarFavorito, removerFavorito } from '../contexts/sliceFavoritos';
import { useAuth } from '../contexts/sliceAuth';

function normalizar(raw) {
  if (!raw) return null;
  // Formato Kitsu
  if (raw.attributes) {
    const a = raw.attributes;
    return {
      id: raw.id,
      titulo: a.titles?.en_jp || a.titles?.ja_jp || a.slug,
      poster: a.posterImage?.medium,
      inicio: a.startDate,
      fim: a.endDate,
      sinopse: a.synopsis,
      rating: a.averageRating,
      episodios: a.episodeCount,
      full: raw,
    };
  }
  // Formato vindo do backend
  if (raw.dados?.attributes) return normalizar(raw.dados);

  return {
    id: raw.animeId || raw.id,
    titulo: raw.titulo || raw.title,
    poster: raw.poster || raw.image,
    inicio: raw.startDate,
    fim: raw.endDate,
    sinopse: raw.synopsis,
    rating: raw.averageRating,
    episodios: raw.episodeCount,
    full: raw,
  };
}

function CardAnime({ anime, modoDetalhe = false, onClick }) {
  const info = normalizar(anime);
  if (!info) return null;

  const dispatch = useDispatch();
  const favoritos = useSelector((s) => s.favoritos.favoritos);
  const { isAutenticado } = useAuth();
  const [snack, setSnack] = useState(false);

  const isFav = favoritos.some((f) => f.animeId === info.id);
  const token = localStorage.getItem('token');

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!isAutenticado || !token) return alert('Faça login para salvar favoritos');

    if (isFav) {
      await fetch(`http://localhost:4000/api/favoritos/${info.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removerFavorito(info.id));
    } else {
      await fetch('http://localhost:4000/api/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animeId: info.id, titulo: info.titulo, dados: info.full }),
      });
      dispatch(adicionarFavorito({ animeId: info.id, titulo: info.titulo, dados: info.full }));
      setSnack(true);
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        width: modoDetalhe ? '100%' : 320,
        bgcolor: '#1a1a1a',
        display: 'flex',
        flexDirection: modoDetalhe ? 'row' : 'column',
        gap: 2,
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        color: '#fff',
      }}
    >
      {info.poster && (
        <CardMedia
          component="img"
          image={info.poster}
          alt={info.titulo}
          sx={{
            width: modoDetalhe ? 220 : '100%',
            height: modoDetalhe ? 330 : 420,
            objectFit: 'cover',
            borderRadius: 2,
          }}
        />
      )}

      <CardContent sx={{ flex: 1, textAlign: modoDetalhe ? 'left' : 'center', p: 0 }}>
        <Typography variant={modoDetalhe ? 'h4' : 'h6'} color="primary" gutterBottom noWrap={!modoDetalhe}>
          {info.titulo}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} px={0.5}>
          <Box textAlign="left">
            <Typography variant="body2">
              <strong>Início:</strong> {info.inicio || '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Fim:</strong> {info.fim || '—'}
            </Typography>
          </Box>
          {isAutenticado && (
            <IconButton onClick={toggleFav} color="primary">
              {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
        </Box>

        {modoDetalhe && (
          <>
            <Typography variant="body2" paragraph mt={2}>
              {info.sinopse || 'Sem sinopse disponível.'}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {info.rating && <Chip label={`Rating: ${info.rating}%`} size="small" color="primary" />}
              {info.episodios && <Chip label={`Eps: ${info.episodios}`} size="small" color="primary" />}
            </Box>
          </>
        )}
      </CardContent>

      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message="Anime salvo nos favoritos"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Card>
  );
}

export default CardAnime;
