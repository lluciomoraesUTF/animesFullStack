import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popover,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { setResultados, setQuery, setAnimeSelecionado } from '../contexts/sliceBusca';

function FormularioBusca() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [erroBusca, setErroBusca] = useState(false);

  const abrirMenu = (event) => setAnchorEl(event.currentTarget);
  const fecharMenu = () => {
    setAnchorEl(null);
    setErroBusca(false);
  };
  const menuAberto = Boolean(anchorEl);

  const salvarHistorico = (novaQuery) => {
    if (!novaQuery.trim()) return;
    const historico = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
    if (!historico.includes(novaQuery)) {
      historico.unshift(novaQuery);
      if (historico.length > 10) historico.pop();
      localStorage.setItem('historicoBuscas', JSON.stringify(historico));
    }
  };

  const getHistorico = () => JSON.parse(localStorage.getItem('historicoBuscas')) || [];

  const limparHistorico = () => {
    localStorage.removeItem('historicoBuscas');
    setSugestoes([]);
  };

  async function buscar(queryBusca, tipo = 'texto') {
    if (!queryBusca.trim() && tipo !== 'texto') return;

    dispatch(setQuery(queryBusca));
    if (queryBusca.trim()) salvarHistorico(queryBusca);

    const filtro =
      tipo === 'categoria'
        ? `filter[categories]=${encodeURIComponent(queryBusca)}`
        : `filter[text]=${encodeURIComponent(queryBusca)}`;

    try {
      const resposta = await fetch(`https://kitsu.io/api/edge/anime?${filtro}`);
      const dados = await resposta.json();
      dispatch(setResultados(dados.data));
    } catch (erro) {
      console.error('Erro ao buscar anime:', erro);
    }
  }

  const navTelaInicial = () => {
    dispatch(setAnimeSelecionado(null));
    buscar('', 'texto');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.trim()) {
        setCarregando(true);
        fetch(
          `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(inputValue)}&page[limit]=5`
        )
          .then((res) => res.json())
          .then((dados) => {
            const nomes = dados.data.map((anime) => anime.attributes.titles.en_jp);
            setSugestoes(nomes);
            setCarregando(false);
          })
          .catch((e) => {
            console.error(e);
            setCarregando(false);
          });
      } else {
        setSugestoes(getHistorico());
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    async function buscarCategorias() {
      try {
        const resposta = await fetch('https://kitsu.io/api/edge/categories?page[limit]=20');
        const dados = await resposta.json();
        setCategorias(dados.data);
      } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
      }
    }

    buscarCategorias();
    buscar('', 'texto');
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1a1a1a', borderRadius: 1 }}>
      <Toolbar>
          <Button color="inherit" onClick={navTelaInicial} sx={{ textTransform: 'none' }}>
            <Typography variant="h6" sx={{ color: '#42a5f5' }}>
              Animes FullStack
            </Typography>
          </Button>

          <IconButton
            color="inherit"
            onClick={abrirMenu}
            onMouseEnter={abrirMenu}
            sx={{ marginLeft: 'auto' }}
          >
            <SearchIcon />
          </IconButton>

          <Button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            sx={{ color: '#f44336', textTransform: 'none', marginLeft: 2 }}
          >
            Logout
          </Button>
        </Toolbar>

      </AppBar>

      <Popover
        open={menuAberto}
        anchorEl={anchorEl}
        onClose={fecharMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 2,
            width: 300,
            bgcolor: '#1a1a1a',
            color: 'white',
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Autocomplete
            freeSolo
            options={sugestoes}
            loading={carregando}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              if (newInputValue.trim()) setErroBusca(false);
            }}
            onFocus={() => {
              if (!inputValue.trim()) {
                setSugestoes(getHistorico());
              }
            }}
            onChange={(event, value) => {
              if (value?.trim()) {
                buscar(value, 'texto');
                fecharMenu();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputValue.trim()) {
                  buscar(inputValue, 'texto');
                  fecharMenu();
                } else {
                  setErroBusca(true);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar anime"
                variant="outlined"
                error={erroBusca}
                helperText={erroBusca ? 'Digite algo para buscar' : ''}
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: erroBusca ? '#f44336' : '#42a5f5',
                  },
                  '& .MuiInputLabel-root': {
                    color: erroBusca ? '#f44336' : '#42a5f5',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {carregando ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Button
            variant="outlined"
            sx={{ borderColor: '#42a5f5', color: '#42a5f5' }}
            onClick={() => {
              if (inputValue.trim()) {
                buscar(inputValue, 'texto');
                fecharMenu();
              } else {
                setErroBusca(true);
              }
            }}
          >
            Buscar
          </Button>

          <Typography variant="subtitle2" sx={{ color: '#42a5f5', mb: 1 }}>
            Categorias
          </Typography>

          <Paper sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#1a1a1a' }}>
            <List dense>
              {categorias.map((categoria) => (
                <ListItemButton
                  sx={{ color: '#42a5f5', mb: 1, borderBottom: '1px solid #1a1a1a' }}
                  key={categoria.id}
                  onClick={() => {
                    buscar(categoria.attributes.slug, 'categoria');
                    fecharMenu();
                  }}
                >
                  <ListItemText primary={categoria.attributes.title} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Button
            onClick={limparHistorico}
            sx={{
              mt: 2,
              color: '#42a5f5',
              textTransform: 'uppercase',
              fontSize: 12,
              display: 'block',
              mx: 'auto',
            }}
          >
            Limpar histórico
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default FormularioBusca;
