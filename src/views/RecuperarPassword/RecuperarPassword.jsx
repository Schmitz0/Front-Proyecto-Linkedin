import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsuarios } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, Typography, Box, TextField } from '@mui/material';

export default function RecuperarPassword(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate('/graciasReviseEmail');
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <FormControl className="signin-form">
          <Typography
            textAlign="center"
            sx={{
              m: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'roboto',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Recuperar contraseña
          </Typography>

          <Box>
            <TextField
              sx={{ m: 1, width: 300 }}
              required
              name="name"
              variant="outlined"
              placeholder="Ingrese su nombre..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              rows={2}
            />
            <TextField
              sx={{ m: 1, width: 300 }}
              required
              name="email"
              variant="outlined"
              placeholder="Ingrese su email..."
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              rows={2}
            />
            <div>
              <Button
                style={{ right: 10, marginBottom: 10 }}
                variant="contained"
                className="primary"
                type="submit"
                disabled={!name || !email}
              >
                Enviar
              </Button>
            </div>
          </Box>
        </FormControl>
      </form>
    </div>
  );
}
