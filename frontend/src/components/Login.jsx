import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');

      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Box mt={8} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#1a1a1a', color: 'white', width: 360 }}>
        <Typography variant="h5" color="#42a5f5" gutterBottom>Login</Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ input: { color: 'white' }, label: { color: '#42a5f5' } }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          sx={{ input: { color: 'white' }, label: { color: '#42a5f5' } }}
        />

        {erro && <Typography color="error" mt={1}>{erro}</Typography>}

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 3, color: '#42a5f5', borderColor: '#42a5f5' }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;