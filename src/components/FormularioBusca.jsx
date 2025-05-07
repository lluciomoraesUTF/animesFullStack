import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setResultados, setAnimeSelecionado } from '../contexts/sliceBusca';
import { Box, TextField, Button, Typography } from '@mui/material';

function FormularioBusca() {
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState(false);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.busca.query);

  async function buscar(queryBusca = busca, ignorarValidacao = false) {
    if (!ignorarValidacao && !queryBusca.trim()) {
      setErro(true);
      return;
    }

    setErro(false);
    dispatch(setQuery(queryBusca));

    try {
      const resposta = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(queryBusca)}`);

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

  // Carrega os animes iniciais na primeira renderização
  useEffect(() => {
    buscar('', true);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={4}>
      <Box display="flex" alignItems="center" gap={2} justifyContent="center">
        <TextField
          label="Buscar anime"
          variant="outlined"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          size="small"
          onKeyPress={handleKeyPress}
          error={erro}
        />
        <Button onClick={() => buscar()} variant="contained" color="primary">
          Buscar
        </Button>

        
        {query && (
          <Button onClick={() => buscar('', true)} variant="text" color="secondary">
            Tela Inicial
          </Button>
        )}
      </Box>

      {erro && (
        <Typography color="error" variant="body2">
          Por favor, insira o nome de um anime.
        </Typography>
      )}
    </Box>
  );
}

export default FormularioBusca;
