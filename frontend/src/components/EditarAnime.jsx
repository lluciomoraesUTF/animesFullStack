import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function EditarAnime() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [anime, setAnime] = useState({
    titulo: '',
    poster: '',
    sinopse: '',
    episodios: '',
    rating: '',
    inicio: '',
    fim: '',
  });

  useEffect(() => {
    const buscarAnime = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/animes`);
        const lista = await res.json();

        const encontrado = lista.find(a => a.id === parseInt(id));
        if (!encontrado) throw new Error('Anime não encontrado.');

        setAnime({
          titulo: encontrado.titulo,
          poster: encontrado.poster,
          sinopse: encontrado.synopsis || '',
          episodios: encontrado.episodeCount || '',
          rating: encontrado.averageRating || '',
          inicio: encontrado.startDate || '',
          fim: encontrado.endDate || '',
        });
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarAnime();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnime((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/animes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: anime.titulo,
          poster: anime.poster,
          synopsis: anime.sinopse,
          episodeCount: Number(anime.episodios),
          averageRating: anime.rating,
          startDate: anime.inicio,
          endDate: anime.fim,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar anime.');

      alert('Anime atualizado com sucesso!');
      navigate('/');
    } catch (err) {
      setErro(err.message);
    }
  };

  if (carregando) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
        <CircularProgress />
      </Box>
    );
  }

  const inputStyle = {
    '& .MuiFilledInput-root': {
      backgroundColor: '#2c2c2c', 
      '& input': {
        color: 'white', 
      },
      '& textarea': {
        color: 'white', 
      },
    },
    '& .MuiInputLabel-filled': {
      color: '#42a5f5',
    },
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
      <Paper elevation={5} sx={{ p: 5, bgcolor: '#1e1e1e', color: 'white', width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" color="#42a5f5" gutterBottom>
          Editar Anime
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Título"
            name="titulo"
            variant="filled"
            value={anime.titulo}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="URL do Poster"
            name="poster"
            variant="filled"
            value={anime.poster}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Sinopse"
            name="sinopse"
            variant="filled"
            value={anime.sinopse}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={inputStyle} // Now this inputStyle handles multiline text correctly
          />
          <TextField
            label="Episódios"
            name="episodios"
            variant="filled"
            value={anime.episodios}
            onChange={handleChange}
            type="number"
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Rating (%)"
            name="rating"
            variant="filled"
            value={anime.rating}
            onChange={handleChange}
            type="number"
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Data de Início"
            name="inicio"
            variant="filled"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={anime.inicio}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Data de Fim"
            name="fim"
            variant="filled"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={anime.fim}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />

          {erro && <Typography color="error" textAlign="center">{erro}</Typography>}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => navigate('/')} variant="outlined" color="secondary" sx={{ color: '#42a5f5', borderColor: '#42a5f5' }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} variant="contained" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#1e88e5' } }}>
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default EditarAnime;