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
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setResultados, setQuery, setAnimeSelecionado } from '../contexts/sliceBusca';
import { useAuth } from '../contexts/sliceAuth';

function FormularioBusca() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [erroBusca, setErroBusca] = useState(false);

  const abrirMenu = (e) => setAnchorEl(e.currentTarget);
  const fecharMenu = () => {
    setAnchorEl(null);
    setErroBusca(false);
  };
  const menuAberto = Boolean(anchorEl);

  const salvarHistorico = (q) => {
    if (!q.trim()) return;
    const hist = JSON.parse(localStorage.getItem('historicoBuscas')) || [];
    if (!hist.includes(q)) {
      hist.unshift(q);
      if (hist.length > 10) hist.pop();
      localStorage.setItem('historicoBuscas', JSON.stringify(hist));
    }
  };

  const getHistorico = () => JSON.parse(localStorage.getItem('historicoBuscas')) || [];

  const buscar = async (q, tipo = 'texto') => {
    if (!q.trim() && tipo !== 'texto') return;
    dispatch(setQuery(q));
    if (q.trim()) salvarHistorico(q);

    const filtro =
      tipo === 'categoria'
        ? `filter[categories]=${encodeURIComponent(q)}`
        : `filter[text]=${encodeURIComponent(q)}`;

    try {
      const r = await fetch(`https://kitsu.io/api/edge/anime?${filtro}`);
      const d = await r.json();
      dispatch(setResultados(d.data));
    } catch (e) {
      console.error(e);
    }
  };

  const limparHistorico = () => {
    localStorage.removeItem('historicoBuscas');
    setSugestoes([]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.trim()) {
        setCarregando(true);
        fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(inputValue)}&page[limit]=5`)
          .then((res) => res.json())
          .then((d) => {
            setSugestoes(d.data.map((a) => a.attributes.titles.en_jp));
            setCarregando(false);
          })
          .catch(() => setCarregando(false));
      } else {
        setSugestoes(getHistorico());
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    fetch('https://kitsu.io/api/edge/categories?page[limit]=20')
      .then((res) => res.json())
      .then((d) => setCategorias(d.data))
      .catch(console.error);

    buscar('', 'texto');
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1a1a1a', borderRadius: 1 }}>
        <Toolbar>
          <Button color="inherit" onClick={() => buscar('', 'texto')} sx={{ textTransform: 'none' }}>
            <Typography variant="h6" sx={{ color: '#42a5f5' }}>Animes FullStack</Typography>
          </Button>

          <IconButton color="inherit" onClick={abrirMenu} onMouseEnter={abrirMenu} sx={{ marginLeft: 'auto' }}>
            <SearchIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/favoritos')}>
            <FavoriteIcon />
          </IconButton>

          <Button onClick={() => { logout(); navigate('/login'); }} sx={{ color: '#f44336', marginLeft: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Popover open={menuAberto} anchorEl={anchorEl} onClose={fecharMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2, width: 300, bgcolor: '#1a1a1a', color: 'white' } }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Autocomplete
            freeSolo
            options={sugestoes}
            loading={carregando}
            inputValue={inputValue}
            onInputChange={(e, v) => { setInputValue(v); if (v.trim()) setErroBusca(false); }}
            onFocus={() => { if (!inputValue.trim()) setSugestoes(getHistorico()); }}
            onChange={(e, v) => { if (v?.trim()) { buscar(v, 'texto'); fecharMenu(); } }}
            onKeyDown={(e) => { if (e.key === 'Enter') { if (inputValue.trim()) { buscar(inputValue, 'texto'); fecharMenu(); } else { setErroBusca(true); } } }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar anime"
                variant="outlined"
                error={erroBusca}
                helperText={erroBusca ? 'Digite algo para buscar' : ''}
                sx={{ '& .MuiInputBase-root': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: erroBusca ? '#f44336' : '#42a5f5' }, '& .MuiInputLabel-root': { color: erroBusca ? '#f44336' : '#42a5f5' } }}
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

          <Button variant="outlined" sx={{ borderColor: '#42a5f5', color: '#42a5f5' }}
            onClick={() => { if (inputValue.trim()) { buscar(inputValue, 'texto'); fecharMenu(); } else { setErroBusca(true); } }}>
            Buscar
          </Button>

          <Typography variant="subtitle2" sx={{ color: '#42a5f5', mb: 1 }}>Categorias</Typography>

          <Paper sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#1a1a1a' }}>
            <List dense>
              {categorias.map((cat) => (
                <ListItemButton key={cat.id} onClick={() => { buscar(cat.attributes.slug, 'categoria'); fecharMenu(); }}>
                  <ListItemText primary={cat.attributes.title} sx={{ color: '#42a5f5' }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Button onClick={limparHistorico} sx={{ mt: 2, color: '#42a5f5', fontSize: 12, textTransform: 'uppercase' }}>Limpar histórico</Button>
        </Box>
      </Popover>
    </>
  );
}

export default FormularioBusca;