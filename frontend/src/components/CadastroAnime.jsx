import React, { useState } from 'react';
import {
  Box, Button, Typography, Paper, Stack, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CadastroAnime() {
  const [titulo, setTitulo] = useState('');
  const [poster, setPoster] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [episodios, setEpisodios] = useState('');
  const [rating, setRating] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <Box
        minHeight="100vh"
        bgcolor="#000"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        color="white"
      >
        <Typography variant="h5" color="#f44336" gutterBottom>
          Você precisa estar logado para cadastrar um anime.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mt: 2, bgcolor: '#42a5f5', '&:hover': { bgcolor: '#1e88e5' } }}
        >
          Fazer Login
        </Button>
      </Box>
    );
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/animes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          poster,
          synopsis: sinopse,               // ✅ nome que o backend espera
          episodeCount: Number(episodios), // ✅ nome correto
          averageRating: rating,           // ✅ nome correto
          startDate: inicio,               // ✅ nome correto
          endDate: fim,                    // ✅ nome correto
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar anime');

      setTitulo('');
      setPoster('');
      setSinopse('');
      setEpisodios('');
      setRating('');
      setInicio('');
      setFim('');
      setErro('');
      alert('Anime cadastrado com sucesso!');
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
      <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white', width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" color="#42a5f5" gutterBottom>
          Cadastrar Novo Anime
        </Typography>

        <Stack spacing={2}>
          <TextField label="Título" fullWidth variant="filled" value={titulo} onChange={e => setTitulo(e.target.value)} sx={inputStyle} />
          <TextField label="URL do Poster" fullWidth variant="filled" value={poster} onChange={e => setPoster(e.target.value)} sx={inputStyle} />
          <TextField
            label="Sinopse"
            fullWidth
            variant="filled"
            multiline
            rows={4}
            value={sinopse}
            onChange={e => setSinopse(e.target.value)}
            InputProps={{
              sx: {
                color: 'white',
                backgroundColor: '#2c2c2c',
              },
            }}
            InputLabelProps={{
              sx: { color: '#42a5f5' }
            }}
          />
          <TextField label="Episódios" fullWidth variant="filled" type="number" value={episodios} onChange={e => setEpisodios(e.target.value)} sx={inputStyle} />
          <TextField label="Rating (%)" fullWidth variant="filled" value={rating} onChange={e => setRating(e.target.value)} sx={inputStyle} />
          <TextField label="Data de Início" fullWidth variant="filled" type="date" InputLabelProps={{ shrink: true }} value={inicio} onChange={e => setInicio(e.target.value)} sx={inputStyle} />
          <TextField label="Data de Fim" fullWidth variant="filled" type="date" InputLabelProps={{ shrink: true }} value={fim} onChange={e => setFim(e.target.value)} sx={inputStyle} />

          {erro && <Typography color="error" textAlign="center">{erro}</Typography>}

          <Button
            variant="contained"
            sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#1e88e5' } }}
            onClick={handleSubmit}
          >
            Salvar Anime
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

const inputStyle = {
  input: { color: 'white' },
  label: { color: '#42a5f5' },
  '.MuiFilledInput-root': { backgroundColor: '#2c2c2c' },
};

export default CadastroAnime;
