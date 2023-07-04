import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { postInsumo, getAllInsumos, getAllProveedores } from '../../redux/actions';
import NavBar from '../NavBar/NavBar';
import style from '../InsumosForm/InsumosForm.module.css';
import { OutlinedInput, Button, TextField, Select, MenuItem, Box, Typography, FormControl, InputLabel } from '@mui/material';
import swal from 'sweetalert';

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

const InsumosForm = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllInsumos());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProveedores());
  }, [dispatch]);

  const insumosGlobal = useSelector((state) => state.insumos);
  const proveedoresGlobal = useSelector((state) => state.proveedores);

  const categoria = insumosGlobal?.map((e) => e.categoria);
  const categorias = [...new Set(categoria)];

  const unidad = insumosGlobal?.map((e) => e.unidad);
  const unidades = [...new Set(unidad)];

  const proveedores = proveedoresGlobal.map((e) => e.nombre);

  const [input, setInput] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    unidad: '',
    stockCritico: '',
    descripcion: '',
    proveedor: '',
    imagen: '',
  });

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.name === 'precio' || event.target.name === 'stock') {
      const number = event.target.value;
      setInput({
        ...input,
        [event.target.name]: number,
      });
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    dispatch(postInsumo(input));
    swal({
      position: 'top-end',
      icon: 'success',
      title: 'Insumo creado correctamente',
      button: true,
    }).then(() => {
      navigate('/insumos');
    });

  };

  return (
    <>
      <div>
        <div>
          <NavBar />
          <form onSubmit={HandleSubmit}>
            <FormControl sx={{ m: 1.5, alignItems: 'center' }}>
              <div>
                <Typography
                  textAlign="center"
                  sx={{
                    m: 2,
                    fontFamily: 'roboto',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  Crear nuevo insumo
                </Typography>
              </div>
              <div className={style.selectContainer}>
                <Box>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="nombre"
                    variant="outlined"
                    placeholder="Insumo..."
                    label="Insumo..."
                    onChange={handleChange}
                    value={input.nombre}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="precio"
                    type='number'
                    variant="outlined"
                    placeholder="Precio..."
                    onChange={handleChange}
                    value={input.precio}
                  />

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="stock"
                    type='number'
                    variant="outlined"
                    placeholder="Stock..."
                    onChange={handleChange}
                    value={input.stock}
                  />
                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="stockCritico"
                    type='number'
                    variant="outlined"
                    placeholder="Stock Critico..."
                    onChange={handleChange}
                    value={input.stockCritico}
                  />
                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: '100%' }}
                      displayEmpty
                      name="unidad"
                      value={input.unidad}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        <span>Unidades de medida</span>
                      </MenuItem>
                      {unidades?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: '100%' }}
                      displayEmpty
                      name="categoria"
                      value={input.categoria}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        <span>Categorias</span>
                      </MenuItem>
                      {categorias?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      sx={{ m: 1, width: 300, height: '100%' }}
                      displayEmpty
                      name="proveedor"
                      value={input.proveedor}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        <span>Elegir proveedor</span>
                      </MenuItem>
                      {proveedores?.map((e, i) => (
                        <MenuItem key={i} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{ m: 1, width: 300 }}
                    required
                    name="descripcion"
                    variant="outlined"
                    placeholder="Descripcion..."
                    label="Descripcion..."
                    multiline
                    onChange={handleChange}
                    value={input.descripcion}
                    rows={1}
                  />


                  <TextField
                    sx={{ m: 1, width: 300 }}

                    name="imagen"
                    variant="outlined"
                    placeholder="Imagen..."
                    multiline
                    onChange={handleChange}
                    value={input.imagen}
                  />
                </Box>
              </div>

              <div className={style.botonContainer}>
                <Button
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
                  Ingresar nuevo insumo
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default InsumosForm;
