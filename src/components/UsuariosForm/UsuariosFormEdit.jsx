// import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { getAllUsuarios, putUsuario } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import { emailRegex } from '../../helpers/helpers.js';
import style from '../UsuariosForm/UsuariosForm.module.css';
import NavBarDashboard from "../NavBarDashboard/NavBarDashboard"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, Typography, FormControl, InputLabel } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UsuariosFormEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const roles = ["Admin", "User", "SuperAdmin"];

  useEffect(() => {
    dispatch(getAllUsuarios);
  }, [dispatch]);

  const usuarios = useSelector((state) => state.usuarios);
  const usuario = usuarios.filter((p) => p.id === Number(id));

  const [input, setInput] = useState({
    name: usuario[0]?.name || '',
    role: usuario[0]?.role || '',
    email: usuario[0]?.email || '',
    password: usuario[0]?.password || '',
    imgUrl: usuario[0]?.imgUrl || '',
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setInput({
      ...input,
      [name]: value,
    });

    // Validar la entrada de correo electrónico
    if (name === 'email') {
      const isValidEmail = emailRegex.test(value);
      setInput({
        ...input,
        [name]: value,
        emailError: !isValidEmail,
        emailErrorMessage: isValidEmail
          ? ''
          : 'Ingrese un correo electrónico válido',
      });
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    dispatch(putUsuario(id, input));
    swal({
      title: `El usuario ${input.name} fue editado con éxito`,
      icon: "success",
    }).then(
      () => { navigate('/usuarios') })
  };

  return (
    <>
      {loading ? (
        <h1>Cargando</h1>
      ) : (
        <div>
          <NavBar />
          <NavBarDashboard/>


          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: 'center' }}>
              <div className={style.selectContainer}>

                <Link to={'/usuarios'} style={{ textDecoration: 'none' }}>
                  <Button>
                    <ArrowBackIcon /> Atrás 
                  </Button>
                </Link> 
                <br/>
                <br/>
                <Box>
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="name"
                    label="Nombre"
                    variant="outlined"
                    placeholder="Nombre..."
                    onChange={handleChange}
                    value={input.name}
                  />

                  <Select
                    sx={{ m: 1, width: 300, height: 67 }}
                    displayEmpty
                    name="role"
                    value={input.role}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem disabled value="">
                      <span>Rol</span>
                    </MenuItem>
                    {roles?.map((e, i) => (
                      <MenuItem key={i} value={e}>
                        {e}
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="email"
                    disabled
                    variant="outlined"
                    placeholder="Email..."
                    label="Email..."
                    onChange={handleChange}
                    value={input.email}
                    error={input.emailError}
                    helperText={input.emailErrorMessage}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="password"
                    type="password"
                    variant="outlined"
                    placeholder="password..."
                    label="password..."
                    onChange={handleChange}
                    value={input.password}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="imgUrl"
                    variant="outlined"
                    label="imgUrl..."
                    multiline
                    onChange={handleChange}
                    value={input.imgUrl}
                    rows={2}
                  />
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
                  disabled={!input.name || !emailRegex.test(input.email)}
                  className={style.boton}
                  type="submit"
                  sx={{
                    paddingRight: '25px',
                    paddingLeft: '25px',
                    marginBottom: '10px',
                    color: 'white',
                    borderRadius: '6px',
                    background: '#2779ff',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: '#5151519c',
                      transition: '1s',
                    },
                  }}
                >
                  Actualizar usuario
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      )}
    </>
  );
};

export default UsuariosFormEdit;
