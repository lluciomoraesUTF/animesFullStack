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
import { useDispatch, useSelector } from 'react-redux';
import { setResultados, setQuery, setAnimeSelecionado } from '../contexts/sliceBusca';

function FormularioBusca() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.busca.query);
  const [inputValue, setInputValue] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const abrirMenu = (event) => setAnchorEl(event.currentTarget);
  const fecharMenu = () => setAnchorEl(null);
  const menuAberto = Boolean(anchorEl);

  async function buscar(query, tipo = 'texto') {
    dispatch(setQuery(query));

    const filtro =
      tipo === 'categoria'
        ? `filter[categories]=${encodeURIComponent(query)}`
        : `filter[text]=${encodeURIComponent(query)}`;

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
        setSugestoes([]);
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
      <AppBar position="static" sx={{ backgroundColor: '#1a1a1a' }}>
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
        </Toolbar>
      </AppBar>

      <Popover
        open={menuAberto}
        anchorEl={anchorEl}
        onClose={fecharMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ sx: { p: 2, width: 300 } }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Autocomplete
            freeSolo
            options={sugestoes}
            loading={carregando}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(event, value) => {
              if (value?.trim()) {
                buscar(value, 'texto');
                fecharMenu();
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar anime"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {carregando ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Typography variant="subtitle2">Categorias</Typography>
          <Paper sx={{ maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {categorias.map((categoria) => (
                <ListItemButton
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
        </Box>
      </Popover>
    </>
  );
}

export default FormularioBusca;
