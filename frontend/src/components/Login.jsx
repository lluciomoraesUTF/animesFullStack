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
import { useAuth } from '../contexts/sliceAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');

      login(data.token);
      navigate('/');
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
      <Paper elevation={5} sx={{ p: 5, bgcolor: '#1e1e1e', color: 'white', width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" textAlign="center" color="#42a5f5" gutterBottom>
          Bem-vindo
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: 'white' },
            label: { color: '#42a5f5' },
            '.MuiFilledInput-root': { backgroundColor: '#2c2c2c' },
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Senha"
          type={showPassword ? 'text' : 'password'} 
          variant="filled"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          InputProps={{ 
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff sx={{ color: 'black' }} /> : <Visibility sx={{ color: 'black' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: 'white' },
            label: { color: '#42a5f5' },
            '.MuiFilledInput-root': { backgroundColor: '#2c2c2c' },
          }}
        />

        {erro && (
          <Typography color="error" mt={1} textAlign="center">
            {erro}
          </Typography>
        )}

        <Stack direction="column" spacing={2} mt={3}>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#1e88e5' } }}
          >
            Entrar
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/cadastro')}
            sx={{ borderColor: '#42a5f5', color: '#42a5f5', '&:hover': { borderColor: '#64b5f6' } }}
          >
            Criar Conta
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;