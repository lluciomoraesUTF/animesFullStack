import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery, setResultados, setAnimeSelecionado } from '../contexts/sliceBusca';
import { Box, TextField, Button } from '@mui/material';

function FormularioBusca() {
  const [busca, setBusca] = useState('');
  const dispatch = useDispatch();

  async function buscar() {
    dispatch(setQuery(busca));

    try {
      const resposta = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(busca)}`);

      if (!resposta.ok) {
        throw new Error(`Erro na requisição: ${resposta.status}`);
      }

      const dados = await resposta.json();
      dispatch(setResultados(dados.data));
      dispatch(setAnimeSelecionado(null));
    } catch (erro) {
      console.error('Erro ao buscar anime:', erro);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      buscar();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} justifyContent="center" mb={4}>
      <TextField
        label="Buscar anime"
        variant="outlined"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        size="small"
        onKeyPress={handleKeyPress}
      />
      <Button onClick={buscar} variant="contained" color="primary">
        Buscar
      </Button>
    </Box>
  );
}

export default FormularioBusca;