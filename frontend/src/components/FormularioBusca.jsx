import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popover,
  Box,
  TextField,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setResultados, setQuery, setAnimeSelecionado } from '../contexts/sliceBusca';
import { useAuth } from '../contexts/sliceAuth';

function getInitials(email) {
  return email?.[0]?.toUpperCase() || '?';
}

function FormularioBusca() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout, isAutenticado } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [erroBusca, setErroBusca] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);

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

  const buscar = async (q) => {
    if (!q.trim()) return;
    dispatch(setQuery(q));
    dispatch(setAnimeSelecionado(null));
    salvarHistorico(q);
    setCarregando(true);
    try {
      const res = await fetch(`http://localhost:4000/api/animes/buscar?titulo=${encodeURIComponent(q)}`);
      const data = await res.json();
      dispatch(setResultados(data));
      fecharMenu();
      navigate('/');
    } catch (e) {
      console.error('Erro ao buscar:', e);
    } finally {
      setCarregando(false);
    }
  };

  const limparHistorico = () => {
    localStorage.removeItem('historicoBuscas');
  };

  let email = '';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      email = payload?.email || '';
    }
  } catch (e) {
    console.warn('Token inválido ou ausente:', e.message);
  }

  const confirmarSaida = () => setConfirmarLogout(true);
  const cancelarSaida = () => setConfirmarLogout(false);
  const sair = () => {
    logout();
    navigate('/login');
    setConfirmarLogout(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1a1a1a' }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ color: '#42a5f5', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Animes FullStack
          </Typography>

          <IconButton color="inherit" onClick={abrirMenu} sx={{ marginLeft: 'auto' }}>
            <SearchIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/favoritos')}>
            <FavoriteIcon />
          </IconButton>

          <IconButton color="inherit" onClick={() => navigate('/animes/novo')}>
            <AddCircleOutlineIcon />
          </IconButton>

          {isAutenticado ? (
            <>
              <Tooltip title={email || ''}>
                <Avatar sx={{ bgcolor: '#42a5f5', width: 32, height: 32, fontSize: 14, ml: 1 }}>
                  {getInitials(email)}
                </Avatar>
              </Tooltip>

              <IconButton onClick={confirmarSaida} sx={{ ml: 1 }}>
                <PowerSettingsNewIcon sx={{ color: '#f44336' }} />
              </IconButton>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                ml: 2,
                borderColor: '#42a5f5',
                color: '#42a5f5',
                '&:hover': {
                  borderColor: '#64b5f6',
                  color: '#64b5f6',
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={confirmarLogout} onClose={cancelarSaida}>
        <DialogTitle>Deseja realmente sair?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelarSaida}>Cancelar</Button>
          <Button onClick={sair} color="error" variant="contained">
            Sair
          </Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={menuAberto}
        anchorEl={anchorEl}
        onClose={fecharMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2, width: 300, bgcolor: '#1a1a1a', color: 'white' } }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Buscar anime"
            variant="outlined"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (erroBusca) setErroBusca(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputValue.trim()) {
                  buscar(inputValue);
                } else {
                  setErroBusca(true);
                }
              }
            }}
            error={erroBusca}
            helperText={erroBusca ? 'Digite algo para buscar' : ''}
            sx={{
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: erroBusca ? '#f44336' : '#42a5f5',
              },
              '& .MuiInputLabel-root': {
                color: erroBusca ? '#f44336' : '#42a5f5',
              },
            }}
            InputProps={{
              endAdornment: carregando ? <CircularProgress color="inherit" size={20} /> : null,
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ color: '#42a5f5' }}>
              Histórico de busca
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#42a5f5', cursor: 'pointer' }}
              onClick={limparHistorico}
            >
              Limpar histórico
            </Typography>
          </Box>

          <Paper sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#1a1a1a' }}>
            <List dense>
              {getHistorico().map((hist, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => {
                    buscar(hist);
                  }}
                >
                  <ListItemText primary={hist} sx={{ color: '#42a5f5' }} />
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
