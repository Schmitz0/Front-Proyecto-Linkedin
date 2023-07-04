import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { getAllProveedores, putProveedor } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import { emailRegex } from '../../helpers/helpers.js'
import style from '../ProveedoresForm/ProveedoresForm.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, Box, Typography, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const ProveedoresForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllProveedores());
  }, [dispatch]);

  const proveedores = useSelector((state) => state.proveedores);
  const proveedor = proveedores.filter((p) => p.id === Number(id));

  const [input, setInput] = useState({
    nombre: proveedor[0]?.nombre,
    nombreContacto: proveedor[0]?.nombreContacto,
    email: proveedor[0]?.email,
    descripcion: proveedor[0]?.descripcion,
    telefono: proveedor[0]?.telefono,
    direccion: proveedor[0]?.direccion,
    codigoPostal: proveedor[0]?.codigoPostal,
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setInput({
      ...input,
      [name]: value,
    });
    if (name === 'email') {
      const isValidEmail = emailRegex.test(value);
      setInput({
        ...input,
        [name]: value,
        emailError: !isValidEmail,
        emailErrorMessage: isValidEmail ? '' : 'Ingrese un correo electrónico válido',
      });
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    dispatch(putProveedor(id, input));
    swal({
      position: 'top-end',
      icon: 'success',
      title: `Proveedor "${input.nombre}" modificado correctamente`,
      button: true,
      }).then(() => {navigate('/proveedores')});
  };

  return (
    <>
      {loading ? (
        <h1>Cargando</h1>
      ) : (
        <div>
          <NavBar />

          <Link to={'/proveedores'} style={{ textDecoration: 'none' }}>
            <Button>
              <ArrowBackIcon /> Atrás
            </Button>
          </Link>

          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: 'center', maxWidth: '800px' }}>

              <div className={style.selectContainer}>
                <Box>
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="nombre"
                    label="Proveedor"
                    variant="outlined"
                    placeholder="proveedor..."
                    onChange={handleChange}
                    value={input.nombre}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="nombreContacto"
                    variant="outlined"
                    placeholder="Nombre del contacto..."
                    label="Nombre del contacto..."
                    onChange={handleChange}
                    value={input.nombreContacto}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="email"
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
                    name="telefono"
                    variant="outlined"
                    placeholder="telefono..."
                    label="telefono..."
                    onChange={handleChange}
                    value={input.telefono}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="direccion"
                    label="direccion"
                    variant="outlined"
                    placeholder="direccion..."
                    onChange={handleChange}
                    value={input.direccion}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="codigoPostal"
                    label="codigoPostal"
                    variant="outlined"
                    placeholder="Codigo postal..."
                    onChange={handleChange}
                    value={input.codigoPostal}
                  />
                  <TextField
                    sx={{ m: 1, width: '617px' }}
                    name="descripcion"
                    variant="outlined"
                    label="Descripcion..."
                    multiline
                    onChange={handleChange}
                    value={input.descripcion}
                    rows={2}
                  />
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
                  disabled={
                    !input.nombre ||
                    !emailRegex.test(input.email)
                  }
                  className={style.boton}
                  type="submit"
                  sx={{
                    paddingRight: '25px',
                    paddingLeft: '25px',
                    maxWidth: '300px',
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
                  Guardar los cambios realizados
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      )}
    </>
  );
};

export default ProveedoresForm;
