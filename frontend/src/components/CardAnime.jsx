import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarFavorito, removerFavorito } from '../contexts/sliceFavoritos';

function formatarData(dataStr) {
  if (!dataStr) return '––';
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
}

function CardAnime({ anime, onClick, modoDetalhe = false, isFavorito = false }) {
  const dispatch = useDispatch();
  const favoritos = useSelector((state) => state.favoritos.favoritos);
  const token = localStorage.getItem('token');

  const animeData = isFavorito ? anime.anime : anime;

  if (!animeData) {
    console.error("Dados do anime inválidos recebidos pelo CardAnime:", anime);
    return null;
  }

  const favoritoNaLista = favoritos.find((fav) => fav.animeId === animeData.id);
  const jaFavoritado = Boolean(favoritoNaLista);

  const handleToggleFavorito = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert('Você precisa estar logado para favoritar.');
      return;
    }

    try {
      if (jaFavoritado) {
        const idParaDeletar = favoritoNaLista.id;
        const response = await fetch(`http://localhost:4000/api/favoritos/${idParaDeletar}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Erro ao remover favorito');
        dispatch(removerFavorito(idParaDeletar));
      } else {
        const response = await fetch('http://localhost:4000/api/favoritos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ animeId: animeData.id }),
        });

        if (!response.ok) throw new Error('Erro ao adicionar favorito');
        const novoFavoritoCompleto = await response.json();
        dispatch(adicionarFavorito(novoFavoritoCompleto));
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      alert('Ocorreu um erro ao atualizar o favorito.');
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        bgcolor: '#1e1e1e',
        color: 'white',
        width: '100%', // ✅ Agora o card se adapta ao Grid
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: onClick ? '0 0 10px #2196f3' : 'none',
        },
      }}
    >
      {animeData.poster && (
        <CardMedia
          component="img"
          image={animeData.poster}
          alt={`Poster de ${animeData.titulo}`}
          sx={{ height: 350, objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          align="center"
          color="#2196f3"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {animeData.titulo}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2"><strong>Início:</strong> {formatarData(animeData.startDate)}</Typography>
            <Typography variant="body2"><strong>Fim:</strong> {formatarData(animeData.endDate)}</Typography>
          </Box>
          <IconButton
            onClick={handleToggleFavorito}
            sx={{ color: jaFavoritado ? 'red' : 'white', ml: 1 }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>

        {modoDetalhe && (
          <Typography sx={{ mt: 2 }}>
            {animeData.synopsis || 'Sem descrição disponível.'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default CardAnime;
