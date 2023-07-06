import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { postProveedor } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import { TextField, Box, Typography, Button, FormControl } from '@mui/material';
import style from '../ProveedoresForm/ProveedoresForm.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import swal from 'sweetalert';


const ProveedoresForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [areAllFieldsComplete, setAreAllFieldsComplete] = useState(false);

  const [input, setInput] = useState({
    nombre: '',
    nombreContacto: '',
    email: '',
    descripcion: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
  });

  const handleChange = (event) => {
    event.preventDefault();
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
   
      const { nombre,  nombreContacto,email,descripcion,telefono,direccion,codigoPostal } = input;
      const fieldsComplete = nombre.trim() !== '' && nombreContacto.trim() !== '' && email.trim() !== '' && descripcion.trim() !== '' && telefono.trim() !== ''&& direccion.trim() !== ''&& codigoPostal.trim() !== '';
      setAreAllFieldsComplete(fieldsComplete);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (input && input.nombre && input.nombreContacto && input.email && input.descripcion && input.telefono && input.direccion && input.codigoPostal) {
    dispatch(postProveedor(input));
    swal({
      position: 'top-end',
      icon: 'success',
      title: `Proveedor "${input.nombre}" creado correctamente`,
      button: true,
      }).then(() => {navigate('/proveedores')});
    }
  };

  return (
    <>
      <div>
        <div>
          <NavBar />

          <Link to={'/proveedores'} style={{ textDecoration: 'none' }}>
            <Button>
              <ArrowBackIcon /> Atrás 
            </Button>
          </Link> 

          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: 'center', maxWidth:'900px' }}>
              {/* <div>
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
                  Crear nuevo proveedor
                </Typography>
              </div> */}
              <div className={style.selectContainer}>
                <Box>
                  <TextField
                    sx={{ m: 1, width: 300,  }}
                    name="nombre"
                    label="Nombre de la empresa"
                    variant="outlined"
                    placeholder="Proveedor..."
                    onChange={handleChange}
                    value={input.nombre}
                    error={submitted && input.nombre === ''}
                    helperText={submitted && input.nombre === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="nombreContacto"
                    label="Nombre del contacto"
                    variant="outlined"
                    placeholder="Nombre del contacto..."
                    onChange={handleChange}
                    value={input.nombreContacto}
                    error={submitted && input.nombreContacto === ''}
                    helperText={submitted && input.nombreContacto === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="email"
                    label="Email"
                    variant="outlined"
                    placeholder="Email..."
                    onChange={handleChange}
                    value={input.email}
                    error={submitted && input.email === ''}
                    helperText={submitted && input.email === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="telefono"
                    label="telefono"
                    type="tel"
                    variant="outlined"
                    placeholder="Telefono..."
                    onChange={handleChange}
                    value={input.telefono}
                    error={submitted && input.telefono === ''}
                    helperText={submitted && input.telefono === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="direccion"
                    label="direccion"
                    variant="outlined"
                    placeholder="direccion..."
                    onChange={handleChange}
                    value={input.direccion}
                    error={submitted && input.direccion === ''}
                    helperText={submitted && input.direccion === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="codigoPostal"
                    label="codigoPostal"
                    variant="outlined"
                    placeholder="Codigo postal..."
                    onChange={handleChange}
                    value={input.codigoPostal}
                    error={submitted && input.codigoPostal === ''}
                    helperText={submitted && input.codigoPostal === '' ? 'Este campo es requerido' : ''}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    name="descripcion"
                    label="Descripción"
                    variant="outlined"
                    placeholder="Descripcion..."
                    onChange={handleChange}
                    value={input.descripcion}
                    error={submitted && input.descripcion === ''}
                    helperText={submitted && input.descripcion === '' ? 'Este campo es requerido' : ''}
                    multiline
                    rows={2}
                  />
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
                  className={style.boton}
                  type="submit"
                //   disabled={
                //   !input.nombre ||
                //   !/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g.test(input.email)
                // }
                  sx={{
                    paddingRight: '25px',
                    paddingLeft: '25px',
                    width: '300px',
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
                  Crear nuevo proveedor
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProveedoresForm;
