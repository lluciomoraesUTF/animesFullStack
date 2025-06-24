import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [erro, setErro] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password: senha, nascimento }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');

      navigate('/login');
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleClickShowSenha = () => {
    setShowSenha((prevShowSenha) => !prevShowSenha);
  };

  const handleClickShowConfirmarSenha = () => {
    setShowConfirmarSenha((prevShowConfirmarSenha) => !prevShowConfirmarSenha);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
      <Paper elevation={5} sx={{ p: 5, bgcolor: '#1e1e1e', color: 'black', width: '100%', maxWidth: 420 }}>
        <Typography variant="h4" textAlign="center" color="#42a5f5" gutterBottom>
          Cadastro
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Nome"
          variant="filled"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={inputStyle}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={inputStyle}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Data de Nascimento"
          type="date"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
          sx={inputStyle}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Senha"
          type={showSenha ? 'text' : 'password'}
          variant="filled"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowSenha}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showSenha ? <VisibilityOff sx={{ color: 'black' }} /> : <Visibility sx={{ color: 'black' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Confirmar Senha"
          type={showConfirmarSenha ? 'text' : 'password'}
          variant="filled"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmarSenha}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmarSenha ? <VisibilityOff sx={{ color: 'black' }} /> : <Visibility sx={{ color: 'black' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {erro && (
          <Typography color="error" mt={1} textAlign="center">
            {erro}
          </Typography>
        )}

        <Stack direction="column" spacing={2} mt={3}>
          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#1e88e5' } }}
          >
            Cadastrar
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ borderColor: '#42a5f5', color: '#42a5f5', '&:hover': { borderColor: '#64b5f6' } }}
          >
            Já tenho conta
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

export default Cadastro;